import { usePage } from '@inertiajs/react'
import React from 'react'
import UserAvatar from './UserAvatar';
import ReactMarkdown from 'react-markdown';
import { formatMessageDateLong } from '@/helpers';
import MessageAttachments from './MessageAttachments';
import MessageOptionsDropdown from './MessageOptionsDropdown';
import MessageReply from './MessageReply';
import remarkGfm from 'remark-gfm';

const MessageItem = ({message, attachmentClick, setReplyingTo, setPinnedMessages, handleViewOriginal, isAdmin, online}) => {
    const currentUser = usePage().props.auth.user;

    const isSender = () => {
        return parseInt(message.sender_id) === parseInt(currentUser.id);
    }

    const isSubAccount = () => {

        if(message.group_id === null){
            return false;
        }

        if(parseInt(message.sender_id) === parseInt(currentUser.id)){
            return false;
        }

        if(message.sender.staff_id){
            return true;
        }

        return false;
    }

    const isStaff = () => {
        
        if(currentUser.staff_id || currentUser.sub_account?.length > 0){
            return true;
        }

        return false;
    }
    
  return (
    <div  className={"chat " + 
        (isSender() ? "chat-end" : "chat-start")
    }>
        {parseInt(message.sender_id) !== parseInt(currentUser.id) && (<UserAvatar online={online} user={message.sender} />)}
        <div className='chat-header'>
            <span className=' font-medium'>{parseInt(message.sender_id) !== parseInt(currentUser.id) ? message.sender.name : ""}</span>
            <time className='text-xs opacity-50 ml-2'>
                {formatMessageDateLong(message.created_at)}
            </time>
        </div>

        <div id={`message-${message.id}`} className={
            "chat-bubble px-1 relative rounded-xl break-all whitespace-pre-wrap text-white" + (
                isSender() ? " chat-bubble-info" : " bg-gray-700 "
            ) + ( message.attachments.length > 0 ? " max-w-[90%] sm:max-w-[55%] md:max-w-[45%] lg:max-w-[40%] " : " max-w-[95%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[55%]" )
        }>
            <MessageOptionsDropdown isStaff={isStaff} isSubAccount={isSubAccount} isAdmin={isAdmin} isSender={isSender} setPinnedMessages={setPinnedMessages} setReplyingTo={setReplyingTo} message={message} currentUser={currentUser} />
            {message.replyTo && (<MessageReply handleViewOriginal={handleViewOriginal} message={message.replyTo} />)}
            {message.attachments.length > 0 && (<MessageAttachments attachments={message.attachments} attachmentClick={attachmentClick} />)}
            {message.message && (<div className='chat-message px-3 py-1'>
                <div className='chat-message-content space-y-0 text-xs md:text-base text-white'>
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
            </div>)}
        </div>
    </div>
  )
}

export default MessageItem
