import { usePage } from '@inertiajs/react'
import React from 'react'
import UserAvatar from './UserAvatar';
import ReactMarkdown from 'react-markdown';
import { formatMessageDateLong } from '@/helpers';
import MessageAttachments from './MessageAttachments';
import MessageOptionsDropdown from './MessageOptionsDropdown';
import MessageReply from './MessageReply';
import remarkGfm from 'remark-gfm';

const MessageItem = ({message, attachmentClick, setReplyingTo, setPinnedMessage, handleViewOriginal, isAdmin}) => {
    const currentUser = usePage().props.auth.user;

    const isSender = () => {
        return parseInt(message.sender_id) === parseInt(currentUser.id);
    }
    
  return (
    <div  className={"chat " + 
        (isSender() ? "chat-end" : "chat-start")
    }>
        {parseInt(message.sender_id) !== parseInt(currentUser.id) && (<UserAvatar user={message.sender} />)}
        <div className='chat-header'>
            <span className=' font-medium'>{parseInt(message.sender_id) !== parseInt(currentUser.id) ? message.sender.name : ""}</span>
            <time className='text-xs opacity-50 ml-2'>
                {formatMessageDateLong(message.created_at)}
            </time>
        </div>

        <div id={`message-${message.id}`} className={
            "chat-bubble relative rounded-xl break-all whitespace-pre-wrap overflow-hidden" + (
                isSender() ? " chat-bubble-info" : "bg-gray-700"
            ) + ( message.attachments.length > 0 ? " max-w-[70%] sm:max-w-[55%] md:max-w-[45%] lg:max-w-[40%] " : " max-w-[85%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[55%]" )
        }>
            <MessageOptionsDropdown isAdmin={isAdmin} isSender={isSender} setPinnedMessage={setPinnedMessage} setReplyingTo={setReplyingTo} message={message} currentUser={currentUser} />
            {message.replyTo && (<MessageReply handleViewOriginal={handleViewOriginal} message={message.replyTo} />)}
            {message.attachments.length > 0 && (<MessageAttachments attachments={message.attachments} attachmentClick={attachmentClick} />)}
            <div className='chat-message'>
                <div className='chat-message-content'>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({node, ...props}) => (
                                <a 
                                {...props} 
                                className="text-blue-500 underline hover:text-blue-700"
                                target="_blank"
                                rel="noopener noreferrer"
                                />
                            ),
                        }}
                    >{message.message}</ReactMarkdown>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MessageItem
