<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConversationController extends Controller
{
    use ApiResponse;

    public function index(){
        if($conversation = Conversation::getConversationForSidebar(Auth::user())){
            return $this->success($conversation, "All Conversation");
        }

        return $this->success([], 'No Conversation Found');
    }
}
