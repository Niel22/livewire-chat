
import { Link, usePage } from '@inertiajs/react';
import React from 'react'
import UserAvatar from './UserAvatar';
import GroupAvatar from './GroupAvatar';
import UserOptionsDropdown from './UserOptionsDropdown';
import { formatMessageDateShort } from '@/helpers';
import { PaperClipIcon } from '@heroicons/react/24/solid';

const ConversationItem = ({conversation, selectedConversation = null, online = null}) => {
  const page = usePage();
  const currentUser = page.props.auth.user;
  let classes = " border-transparent";
  if (selectedConversation) {
    if (
      selectedConversation.id === conversation.id &&
      selectedConversation.is_group === conversation.is_group
    ) {
      classes = "border-blue-500 bg-blue-50 dark:bg-gray-700/50 shadow-sm";
    }
  }

  return (
    <Link
      href={
        conversation.is_group
          ? route('chat.group', conversation)
          : route('chat.user', conversation)
      }
      preserveState
      className={
        "conversation-item flex items-center justify-between gap-3 rounded-md p-3 transition-all cursor-pointer border  " +
        "text-gray-800 hover:hover:bg-blue-50 " + 
        "dark:text-gray-200 dark:hover:bg-gray-700 " + 
        classes +
        (!conversation.is_group && currentUser.role === 'admin' ? " pr-2" : " pr-4")
      }
    >
      {!conversation.is_group && (
        <UserAvatar user={conversation} online={online} />
      )}

      {conversation.is_group && <GroupAvatar />}

      <div className="flex-1 text-xs max-w-full overflow-hidden">
        <div className="flex gap-1 justify-between items-center">
          <h3 className="text-sm font-semibold truncate">
            {conversation.name}
          </h3>
          {conversation.last_message_date && (
            <span className="text-nowrap text-gray-500 dark:text-gray-400">
              {formatMessageDateShort(conversation.last_message_date)}
            </span>
          )}
        </div>
        {conversation.last_message_date && (
          conversation.last_message ? (
            <p className="text-xs text-gray-600 dark:text-gray-400 text-nowrap truncate">
              {conversation.last_message}
            </p>
          ) : (
            <p className="text-xs text-gray-600 flex items-center justify-start gap-1 dark:text-gray-400 text-nowrap truncate">
              <PaperClipIcon className='w-3' /> Sent an attachment
            </p>
          )
        )}
      </div>

      {/* {currentUser.role === "admin" && (
        <UserOptionsDropdown conversation={conversation} />
      )} */}
    </Link>


  );
}

export default ConversationItem
