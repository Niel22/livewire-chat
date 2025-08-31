import { ArrowLeftIcon, InformationCircleIcon, UserGroupIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Link } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import UserAvatar from './UserAvatar'
import GroupAvatar from './GroupAvatar'
import GroupInfoSidebar from './GroupInfoSidebar'

const ConversationHeader = ({selectedConversation, online}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setSidebarOpen(false);
    }, [])

  return (
    <>
        {selectedConversation && (
            <div className="p-3 flex justify-between items-center 
                            bg-gray-50 dark:bg-slate-800 
                            border-b border-gray-200 dark:border-slate-700 
                            shadow-sm transition-colors">
                <div className="flex items-center gap-3">
                    
                    
                    <Link
                        href={route('dashboard')}
                        className="inline-block sm:hidden text-gray-600 dark:text-gray-300 hover:text-blue-500"
                    >
                        <ArrowLeftIcon className="w-6 h-6 transition" />
                    </Link>

                    {/* Avatar */}
                    {!selectedConversation.is_group && (
                        <UserAvatar 
                            user={selectedConversation} 
                            online={online} 
                            className="ring-1 ring-blue-400/40 rounded-full"
                        />
                    )}
                    {selectedConversation.is_group && (
                        <GroupAvatar className="ring-1 ring-blue-400/40 rounded-full" />
                    )}

                    {/* Conversation details */}
                    <div>
                        <h3 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-100">
                            {selectedConversation.name}
                        </h3>
                        {selectedConversation.is_group && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {selectedConversation.members + 1} members
                            </p>
                        )}
                        {!selectedConversation.is_group && online && (
                            <p className="text-xs text-blue-500">Online</p>
                        )}
                    </div>
                </div>
                
                {selectedConversation.is_group && (
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
                    >
                        <InformationCircleIcon className="w-6 h-6" />
                    </button>
                )}
            </div>
        )}
        {selectedConversation.is_group && sidebarOpen && (
            <GroupInfoSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} group={selectedConversation} />
        )}

    </>
  )
}

export default ConversationHeader
