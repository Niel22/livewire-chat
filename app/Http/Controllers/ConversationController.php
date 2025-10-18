<?php

namespace App\Http\Controllers;

use App\Action\Conversation\FetchAllConversation;
use App\Http\Resources\ConversationCollection;
use App\Models\Conversation;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConversationController extends Controller
{
    use ApiResponse;

    public function index(FetchAllConversation $action){

        if($conversation = $action->execute()){

            return $this->success(new ConversationCollection($conversation), "All Conversation");
        }

        return $this->success([], 'No Conversation Found');
    }
}
