import { usePage } from '@inertiajs/react'
import React from 'react'
import UserAvatar from './UserAvatar';
import ReactMarkdown from 'react-markdown';
import { formatMessageDateLong } from '@/helpers';

const MessageItem = ({message, attachmentClick}) => {
    const currentUser = usePage().props.auth.user;
    console.log(message);
    console.log(currentUser);
  return (
    <div className={"chat " + 
        (parseInt(message.sender_id) === parseInt(currentUser.id) ? "chat-end" : "chat-start")
    }>
        {parseInt(message.sender_id) !== parseInt(currentUser.id) && (<UserAvatar user={message.sender} />)}
        <div className='chat-header'>
            <span className=' font-medium'>{parseInt(message.sender_id) !== parseInt(currentUser.id) ? message.sender.name : ""}</span>
            <time className='text-xs opacity-50 ml-2'>
                {formatMessageDateLong(message.created_at)}
            </time>
        </div>

        <div className={
            "chat-bubble relative rounded-xl break-all whitespace-pre-wrap " + (
                parseInt(message.sender_id) === parseInt(currentUser.id) ? " chat-bubble-info" : "bg-gray-700"
            )
        }>
            <div className='chat-message'>
                <div className='chat-message-content'>
                    <ReactMarkdown>{message.message}</ReactMarkdown>
                </div>
            </div>

        </div>
    </div>
  )
}

export default MessageItem
