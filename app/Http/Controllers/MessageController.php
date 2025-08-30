<?php

namespace App\Http\Controllers;

use App\Events\SocketMessage;
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
use App\Models\MessageAttachment;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    public function byUser(Conversation $conversation){
        $total = Message::where('conversation_id', $conversation->id)->count();
        $perPage = 10;

        $messages = Message::with('attachments')
            ->where('conversation_id', $conversation->id)
            ->skip(max(0, $total - $perPage))
            ->take($perPage)
            ->get();
        
            // dd($messages);

        return inertia('Home', [
            'selectedConversation' => $conversation->toConversationArray(),
            'messages' => MessageResource::collection($messages)
        ]);
    }

    public function byGroup(Group $group){
        $group->load('members');

        $total = Message::where('group_id', $group->id)->count();
        $perPage = 10;

        $messages = Message::with('attachments')
            ->where('group_id', $group->id)
            ->skip(max(0, $total - $perPage))
            ->take($perPage)
            ->get();

        // dd($messages);

        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages)
        ]);
    }

    public function loadOlder(Message $message){
        
        $perPage = 10;

        if ($message->group_id) {
            $total = Message::where('group_id', $message->group_id)
                ->where('created_at', '<', $message->created_at)
                ->count();

            $messages = Message::with('attachments')
                ->where('group_id', $message->group_id)
                ->where('created_at', '<', $message->created_at)
                ->skip(max(0, $total - $perPage))
                ->take($perPage)
                ->get();
        } else {
            $total = Message::where('conversation_id', $message->conversation_id)
                ->where('created_at', '<', $message->created_at)
                ->count();

            $messages = Message::with('attachments')
                ->where('conversation_id', $message->conversation_id)
                ->where('created_at', '<', $message->created_at)
                ->skip(max(0, $total - $perPage))
                ->take($perPage)
                ->get();
        }

        return MessageResource::collection($messages);

    }

    public function store(StoreMessageRequest $request){
        $data = $request->validated();
        $data['sender_id'] = Auth::id();
        $receiver_id = $data['receiver_id'] ?? null;
        $group_id = $data['group_id'] ?? null;
        $conversation_id = $data['conversation_id'] ?? null;

        $files = $data['attachments'] ?? null;

        $message = Message::create($data);
        $attachments = [];

        if($files){
            foreach($files as $file){
                $directory = 'attachments/'. Str::random(32);
                Storage::makeDirectory($directory);

                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public')
                ];
                
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
        if($message->sender_id !== Auth::id()){
            return response()->json([
                'message' => 'Forbidden'
            ], 403);
        }

        $message->delete();
        return response()->json([], 200);
    }
}
