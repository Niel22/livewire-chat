import React from 'react'

const MessageReply = ({message, handleViewOriginal}) => {
  return (
    <div onClick={() => handleViewOriginal(message.id)} className="cursor-pointer mb-1 px-3 py-2 rounded-lg bg-gray-600/40 border-l-4 border-blue-400 text-sm">
        <p className="font-medium text-gray-100 truncate">
            {message.sender.name}
        </p>
        <p className="text-gray-300 line-clamp-1">
            {message.message || "Attachment"}
        </p>
    </div>
  )
}

export default MessageReply;
