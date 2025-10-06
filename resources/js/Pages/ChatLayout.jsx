
import ConversationItem from "@/Components/App/ConversationItem";
import TextInput from "@/Components/TextInput";
import useConversation from "@/hooks/useConversation";
import { ChatBubbleLeftRightIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { Head, Link } from "@inertiajs/react";

const ChatLayout = ({ children }) => {
    const { t, isUserOnline, selectedConversation, sortedConversations, onSearch, auth, isLoading } = useConversation();

    return (
        <>
            <Head title="All Chats" />

            <div className="flex-1 flex overflow-hidden">
                
                <div
                    className={`transition-all 
                                    w-full sm:w-[300px] 
                                    bg-gradient-to-b from-blue-50 to-white 
                                    dark:from-slate-800 dark:to-slate-900 
                                     flex-col overflow-hidden 
                                    border-r border-gray-200 dark:border-slate-700 shadow-sm
                                    ${selectedConversation
                            ? "-ml-[100%] md:ml-0 lg:ml-0"
                            : "ml-0"
                        }`}
                >
                    
                    <div
                        className="flex items-center justify-between py-3 px-4 text-lg font-semibold 
                                    text-gray-700 dark:text-gray-100 border-b border-gray-200 dark:border-slate-700"
                    >
                        {t("title")}
                        {auth.user.role === "admin" && (
                            <div
                                className="tooltip tooltip-left"
                                data-tip={t("tooltip.createGroup")}
                            >
                                <Link href={route('group.create')} className="text-blue-500 hover:text-blue-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                                    <PlusCircleIcon className="w-7 h-7 inline-block ml-2" />
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-b border-gray-200 dark:border-slate-700">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder={t("searchPlaceholder")}
                            className="w-full bg-white/70 dark:bg-slate-700 
                                text-gray-800 dark:text-gray-100 
                                placeholder-gray-400 dark:placeholder-gray-300 
                                border border-gray-300 dark:border-slate-600 
                                focus:ring focus:ring-blue-400 focus:border-blue-400 rounded-lg "
                        />
                    </div>

                    {isLoading ? (
                        [1, 2, 3, 4].map((i) => (<ConversationItemSkeleton key={i} />))
                    ) : (
                        <ConversationList sortedConversations={sortedConversations} t={t} selectedConversation={selectedConversation} isUserOnline={isUserOnline} />
                    )}
                </div>

                {/* Main chat area */}
                <div className="w-full flex-1 mx-auto flex flex-col overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100">
                    {children}
                </div>
            </div>

        </>
    );
};

export default ChatLayout;

const ConversationList = ({ sortedConversations, t, selectedConversation, isUserOnline }) => {
    return (
        <div className="hide-scrollbar flex-1 overflow-y-auto px-2 pt-1 pb-5 space-y-1">
            {sortedConversations &&
                sortedConversations.map((conversation) => (
                    <ConversationItem
                        key={`${conversation.is_group ? "group_" : "chat_"}${conversation.id}`}
                        conversation={conversation}
                        selectedConversation={selectedConversation}
                        online={isUserOnline(conversation.receiver_id)}
                    />
                ))
            }

            {sortedConversations.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                        <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {t("noConversations.title")}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                        {t("noConversations.message")}
                    </p>
                </div>
            )}
        </div>
    )
}

const ConversationItemSkeleton = () => {
    return (
        <div className="conversation-item flex items-center justify-between gap-3 rounded-md p-3 border border-transparent text-gray-800 dark:text-gray-200 animate-pulse">
            
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

            <div className="flex-1 text-xs max-w-full overflow-hidden">
                <div className="flex gap-1 justify-between items-center">
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>

                <div className="mt-2 h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        </div>
    )
}