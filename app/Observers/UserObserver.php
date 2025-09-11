<?php

namespace App\Observers;

use App\Events\SocketMessage;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        $systemEmails = [
            'sysadmin@taskwin.com',
            'general@taskwin.com',
            'finance@taskwin.com',
            'coordinator@taskwin.com',
        ];

        
        if($user->staff_id !== null) return;
        
        if($user->role !== "member") return;

        if (in_array($user->email, $systemEmails)) {
            return;
        }
        
        $supportAccounts = [
                'general@taskwin.com' => <<<MD
            **Welcome to Task-Win General Support!**
            This channel is dedicated to handling all customer inquiries, account assistance, and service guidance.
            **Our team is here to:**
            - Help you understand how the platform works
            - Assist with task submissions and proof verification
            - Answer any general questions about earning and participation
            For quick help, please share clear details of your issue.
            ✨ Your satisfaction is our priority — thank you for being part of our community!
            MD,

                'finance@taskwin.com' => <<<MD
            **Welcome to Task-Win Finance Support!**
            This channel handles all financial matters, including:
            - Payouts & reward inquiries
            - Payouts / Withdrawals
            - Transaction Support
            - Reward & Bonus Issues
            - Security & Verification of Payments
            ⚠️ Please ensure your payment details are accurate and up to date to avoid delays.
            All financial discussions are handled with strict confidentiality and security.
            MD,

                'coordinator@taskwin.com' => <<<MD
            **Welcome to Task-Win Coordinator Desk!**
            The Coordinator team is responsible for:
            - Guiding new members through the setup process
            - Assigning daily tasks and ensuring smooth participation
            - Monitoring group activities and resolving escalated issues
            📌 Please follow coordinator instructions carefully to ensure your tasks are approved and your commissions are paid on time.
            🚀 We are here to help you stay on track and succeed!
            MD,
        ];




        foreach ($supportAccounts as $email => $autoMessage) {
            $support = User::where('email', $email)->first();

            if (! $support) {
                Log::warning("Support account {$email} not found — skipping auto conversation.");
                continue;
            }

            $existing = Conversation::where(function ($q) use ($user, $support) {
                    $q->where('user_id1', $user->id)
                    ->where('user_id2', $support->id);
                })->orWhere(function ($q) use ($user, $support) {
                    $q->where('user_id1', $support->id)
                    ->where('user_id2', $user->id);
                })->first();

            if ($existing) {
                if ($existing->messages()->count() === 0) {
                    Message::create([
                        'conversation_id' => $existing->id,
                        'sender_id'       => $support->id,
                        'message'         => $autoMessage,
                        'is_automated'    => true,
                    ]);
                }
                continue;
            }

            DB::transaction(function () use ($user, $support, $autoMessage) {
                $conversation = Conversation::create([
                    'user_id1' => $user->id,
                    'user_id2' => $support->id,
                ]);
                
                $message = Message::create([
                    'conversation_id' => $conversation->id,
                    'sender_id'       => $support->id,
                    'message'         => $autoMessage,
                ]);

                SocketMessage::dispatch($message);
            });
        }
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        //
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        //
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}
