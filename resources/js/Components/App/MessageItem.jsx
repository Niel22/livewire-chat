import { usePage } from '@inertiajs/react'
import React from 'react'
import UserAvatar from './UserAvatar';
import ReactMarkdown from 'react-markdown';
import { formatMessageDateLong } from '@/helpers';
import MessageAttachments from './MessageAttachments';
import MessageOptionsDropdown from './MessageOptionsDropdown';

const MessageItem = ({message, attachmentClick}) => {
    const currentUser = usePage().props.auth.user;
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
            <MessageOptionsDropdown message={message} currentUser={currentUser} />
            <div className='chat-message'>
                {message.attachments.length > 0 && (<MessageAttachments attachments={message.attachments} attachmentClick={attachmentClick} />)}
                <div className='chat-message-content'>
                    <ReactMarkdown>{message.message}</ReactMarkdown>
                </div>
            </div>

        </div>
    </div>
  )
}

export default MessageItem
