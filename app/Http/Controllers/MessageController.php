<?php

namespace App\Http\Controllers;

use App\Events\SocketDeleteMessage;
use App\Events\SocketMessage;
use App\Events\SocketMessagePinned;
use App\Models\User;
use App\Models\Group;
use App\Models\Message;
use Illuminate\Support\Str;
use App\Models\Conversation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\MessageResource;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use App\Jobs\MarkConversationMessagesAsRead;
use App\Jobs\MarkMessagesAsRead;
use App\Models\MessageAttachment;
use App\Models\MessageRead;
use App\Services\CloudinaryUploadService;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    public function byUser(Conversation $conversation){
        if(!Auth::user()->conversations->contains('id', $conversation->id)){
            return redirect()->route('dashboard');
        }

        MarkConversationMessagesAsRead::dispatch($conversation->id, Auth::id());

        $messages = Message::with('attachments', 'replyTo')
            ->where('conversation_id', $conversation->id)
            ->latest()
            ->take(10)
            ->get()
            ->reverse();
        
        $pins = Message::where('conversation_id', $conversation->id)->where('is_pinned', true)->latest('updated_at')->get();

        return inertia('Home', [
            'selectedConversation' => $conversation->toConversationArray(),
            'messages' => MessageResource::collection($messages),
            'pins' => $pins ? MessageResource::collection($pins) : null
        ]);
    }

    public function byGroup(Group $group){
        $user = Auth::user();

        if ($user->role === 'member' && is_null($user->staff_id)) {
            if (! $user->groups->contains('id', $group->id)) {
                abort(401);
            }
        }

        if ($user->role === 'member') {
            $group->load(['members' => function ($q) use ($user) {
                $q->where('users.id', $user->id)
                ->select('users.id', 'users.name');
            }]);
        } else {
            $group->load(['members' => function ($q) {
                $q->select('users.id', 'users.name');
            }]);
        }

        $member = $group->members->firstWhere('id', $user->id);

        $isMuted = $member ? $member->pivot->is_muted : false;

        MarkMessagesAsRead::dispatch($group->id, $user->id);
        
        $messages = Message::with('attachments', 'replyTo')
            ->where('group_id', $group->id)
            ->latest('created_at')
            ->take(10)
            ->get()
            ->reverse()
            ->values();
        
        $pins = Message::where('group_id', $group->id)->where('is_pinned', true)->latest('updated_at')->get();

        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages),
            'pins' => $pins ? MessageResource::collection($pins) : null,
            'muted' => $isMuted ? true : false,
        ]);
    }

    public function loadOlder(Message $message)
    {
        $perPage = 10;

        $column = $message->group_id ? 'group_id' : 'conversation_id';
        $value = $message->group_id ?? $message->conversation_id;

        $messages = Message::with('attachments')
            ->where($column, $value)
            ->where('created_at', '<', $message->created_at)
            ->orderBy('created_at', 'desc')
            ->take($perPage)
            ->get()
            ->reverse()
            ->values();

        return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request, CloudinaryUploadService $cloudinary){
        $data = $request->validated();
        $data['sender_id'] = Auth::id();
        $receiver_id = $data['receiver_id'] ?? null;
        $group_id = $data['group_id'] ?? null;
        $conversation_id = $data['conversation_id'] ?? null;

        $files = $data['attachments'] ?? null;

        $message = Message::create($data);
        $attachments = [];

        if ($files) {
            $uploaded = $cloudinary->uploadFiles($files, $message->id);
            foreach ($uploaded as $model) {
                $attachment = MessageAttachment::create($model);
                $attachments[] = $attachment;
            }
            $message->attachments = $attachments;
        }

        if($receiver_id){
            
            Conversation::where('id', $conversation_id)->update([
                'updated_at' => now()
            ]);

        }
        
        if($group_id){
            Group::where('id', $group_id)->update([
                'updated_at' => now()
            ]);
        }

        SocketMessage::dispatch($message);

        return new MessageResource($message);
        
    }

    public function destroy(Message $message){
        $user = Auth::user();

        $group = null;
        $conversation = null;

        if($message->group_id){
            $group = Group::find($message->group_id); 
            if (!in_array($user->role, ['admin']) && $group->admin_id !== $user->id && $message->sender_id !== $user->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
        }else{
            $conversation = Conversation::where('id', $message->conversation_id)->first();
        }

        $deletedMessage = $message;

        $message->delete();

        $lastMessage = null;
        if($group){
            $lastMessage = $group->last_message;
        }else{
            $lastMessage = $conversation->last_message;
        }

        SocketDeleteMessage::dispatch($deletedMessage, $lastMessage);

        return response()->json([
            'message' => new MessageResource($lastMessage)
        ], 200);
    }

    public function pin(Message $message)
    {
        if($message->is_pinned){
            return;
        }
        
        $user = Auth::user();

        if ($message->group_id) {
            $group = Group::find($message->group_id); 
            if (!in_array($user->role, ['admin']) && (int)$group->admin_id !== (int)$user->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

        } elseif ($message->conversation_id) {
            $conversation = $message->conversation; 
            if ((int)$conversation->user_id1 !== (int)$user->id && (int)$conversation->user_id2 !== (int)$user->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

        } else {
            return response()->json(['error' => 'Message not in a valid context'], 400);
        }

        $message->is_pinned = true;
        $message->updated_at = now();
        $message->save();

        SocketMessagePinned::dispatch($message);

        return response()->json(['status' => 'pinned']);
    }

    public function unpin(Message $message){

        $user = Auth::user();

        if ((int)$message->group_id) {
            $group = Group::find($message->group_id); 
            if (!in_array($user->role, ['admin']) && $group->admin_id !== $user->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

        } elseif ((int)$message->conversation_id) {
            $conversation = $message->conversation; 
            if ((int)$conversation->user_id1 !== (int)$user->id && (int)$conversation->user_id2 !== (int)$user->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

        } else {
            return response()->json(['error' => 'Message not in a valid context'], 400);
        }

        $message->is_pinned = false;
        $message->save();

        SocketMessagePinned::dispatch($message);

        return response()->json(['status' => 'pinned']);
    }

    public function show(Message $message){
        $message->load('attachments', 'replyTo');

        return new MessageResource($message);
    }

    public function startConversation(User $user){

        $authId = Auth::id();

        $existingConvo = Conversation::where(function($query) use ($authId, $user){
                $query->where('user_id1', $authId)
                    ->where('user_id2', $user->id);
        })->orWhere(function($query) use ($authId, $user){
            $query->where('user_id1', $user->id)
                ->where('user_id2', $authId);
        })->first();

        if($existingConvo){
            return redirect()->route('chat.user', $existingConvo->id);
        }

        $createdConvo = Conversation::create([
            'user_id1' => $authId,
            'user_id2' => $user->id
        ]);

        return redirect()->route('chat.user', $createdConvo->id);
    }

    public function search(Request $request){
        $query = $request->q;
        $conversationId = $request->conversation_id;

        $messages = Message::with('sender')
            ->where('conversation_id', $conversationId)
            ->where('message', 'like', '%' . $query . '%')
            ->latest()
            ->limit(20)
            ->get();

        return response()->json(['data' => $messages]);
    }

    public function update(Message $message, UpdateMessageRequest $request){
        $validated = $request->validated();
        $message->update([
            'message' => $validated['message']
        ]);

        return new MessageResource($message);
    }
}

