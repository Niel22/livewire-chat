import { ArrowLeftIcon, BookmarkIcon, InformationCircleIcon, MagnifyingGlassIcon, UserGroupIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Link } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import UserAvatar from './UserAvatar'
import GroupAvatar from './GroupAvatar'
import GroupInfoSidebar from './GroupInfoSidebar'
import GroupOptionsDropdown from './GroupOptionsDropdown'
import MessageSearchModal from './MessageSearchModal'

const ConversationHeader = ({selectedConversation, online, pinnedMessage, handleViewOriginal, isLocked, setSearchOpen, isAdmin}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    

    useEffect(() => {
        setSidebarOpen(false);
    }, [])

  return (
    <>
        {selectedConversation && (
            <>
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
                        <div className='flex items-center gap-1'>
                            <button 
                                onClick={() => setSearchOpen(true)}
                                className="text-gray-600 mr-2 dark:text-gray-300 hover:text-blue-500"
                            >
                                <MagnifyingGlassIcon className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={() => setSidebarOpen(true)}
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
                            >
                                <InformationCircleIcon className="w-6 h-6" />
                            </button>
                            <GroupOptionsDropdown isAdmin={isAdmin} selectedConversation={selectedConversation} isLocked={isLocked} />
                        </div>
                    )}
                </div>
                {pinnedMessage && (
                    <div 
                        onClick={() => handleViewOriginal(pinnedMessage.id)}
                        className="
                            w-full px-3 py-2 flex items-center justify-between gap-3 
                            bg-emerald-50 dark:bg-emerald-900/30 
                            border-t border-b border-emerald-200 dark:border-emerald-800 
                            shadow-sm text-sm cursor-pointer
                        "
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="font-medium text-emerald-800 dark:text-emerald-300">
                                <BookmarkIcon className='w-4 h-4' />
                            </span>
                            <p className="truncate text-gray-800 dark:text-gray-200 max-w-[200px] sm:max-w-[400px]">
                                {pinnedMessage.message}
                            </p>
                        </div>
                        <button 
                            className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100"
                            title="Unpin message"
                        >
                            ✕
                        </button>
                    </div>
                )}

                

            </>
        )}

        <GroupInfoSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} group={selectedConversation} />

    </>
  )
}

export default ConversationHeader
