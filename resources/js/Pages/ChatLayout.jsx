
import ConversationItem from "@/Components/App/ConversationItem";
import TextInput from "@/Components/TextInput";
import { useEventBus } from "@/EventBus";
import { ChatBubbleLeftRightIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

const ChatLayout = ({ children }) => {
    const page = usePage();

    const auth = page.props.auth;
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const {on} = useEventBus();

    const [onlineUsers, setOnlineUsers] = useState({});

    const isUserOnline = (userId) => onlineUsers[userId];

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    const messageCreated = (message) => {
        setLocalConversations((oldUsers) => {
            return oldUsers.map((u) => {
                if (message.conversation_id && !u.is_group &&
                     u.id === parseInt(message.conversation_id)
                ) {
                    if ("Notification" in window && Notification.permission === "granted" && message.sender_id !== auth.user.id) {
                        new Notification("New Message", {
                            body: message.message ?? "Sent an Attachment",
                        });
                        const audio = new Audio("/notify.wav");
                        audio.play().catch((err) => {
                            console.warn("Unable to play notification sound automatically:", err);
                        });
                    }
                    return {
                        ...u,
                        last_message: message.message,
                        last_message_date: message.created_at,
                    };
                }
                if (message.group_id && u.is_group && u.id === parseInt(message.group_id)) {
                    if ("Notification" in window && Notification.permission === "granted" && message.sender_id !== auth.user.id) {
                        new Notification("New Message", {
                            body: message.message ?? "Sent an Attachment",
                        });
                        const audio = new Audio("/notify.wav");
                        audio.play().catch((err) => {
                            console.warn("Unable to play notification sound automatically:", err);
                        });
                    }
                    return {
                        ...u,
                        last_message: message.message,
                        last_message_date: message.created_at,
                    };
                }
                return u;
            });
        });
    };

    const messageDeleted = ({prevMessage}) => {
        setLocalConversations((oldUsers) => {
            return oldUsers.map((u) => {
                if (prevMessage.conversation_id && !u.is_group &&
                     u.id === parseInt(prevMessage.conversation_id)
                ) {
                    return {
                        ...u,
                        last_message: prevMessage.message,
                        last_message_date: prevMessage.created_at,
                    };
                }
                if (prevMessage.group_id && u.is_group && u.id === parseInt(prevMessage.group_id)) {
                    return {
                        ...u,
                        last_message: prevMessage.message,
                        last_message_date: prevMessage.created_at,
                    };
                }
                return u;
            });
        });
    }


    useEffect(() => {
        const offCreated = on('message.created', messageCreated);
        const offDeleted = on('message.deleted', messageDeleted);

        return () => {
            offCreated();
            offDeleted();
        }
    }, [on])

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.last_message_date && b.last_message_date) {
                    return new Date(b.last_message_date) - new Date(a.last_message_date);
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1; 
                } else {
                    return 0; 
                }
            })
        );
    }, [localConversations]);

    useEffect(() => {
        Echo.join("online")
            .here((users) => {
                const onlineUsersObject = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );

                setOnlineUsers((prevOnlineUsers) => {
                    return { ...prevOnlineUsers, ...onlineUsersObject };
                });
            })
            .joining((users) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    updatedUsers[users.id] = users;
                    return updatedUsers;
                });
            })
            .leaving((users) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    delete updatedUsers[users.id];
                    return updatedUsers;
                });
            })
            .error((error) => {
                console.log("errors", error);
            });

        return () => {
            Echo.leave("online");
        };
    }, []);

    const onSearch = (e) => {
        const search = e.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return (
                    conversation.name.toLowerCase().includes(search)
                )
            })
        );
    }

    return (
        <>
            <Head title="All Chats" />

            <div className="flex-1 w-full flex overflow-hidden">
                {/* Sidebar */}
                <div
                    className={`transition-all 
                                    w-full sm:w-[220px] md:w-[300px] 
                                    bg-gradient-to-b from-blue-50 to-white 
                                    dark:from-slate-800 dark:to-slate-900 
                                    flex flex-col overflow-hidden 
                                    border-r border-gray-200 dark:border-slate-700 shadow-sm
                                    ${
                                        selectedConversation
                                        ? "-ml-[100%] sm:ml-0 lg:ml-0" 
                                        : "ml-0"
                                }`}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between py-3 px-4 text-lg font-semibold 
                                    text-gray-700 dark:text-gray-100 border-b border-gray-200 dark:border-slate-700"
                    >
                        My Conversations
                        {auth.user.role === "admin" && (<div
                            className="tooltip tooltip-left"
                            data-tip="Create New Group"
                        >
                            <Link href={route('group.create')} className="text-blue-500 hover:text-blue-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                                <PlusCircleIcon className="w-7 h-7 inline-block ml-2" />
                            </Link>
                        </div>)}
                    </div>

                    {/* Search */}
                    <div className="p-3 border-b border-gray-200 dark:border-slate-700">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="Filter users and groups"
                            className="w-full bg-white/70 dark:bg-slate-700 
                                text-gray-800 dark:text-gray-100 
                                placeholder-gray-400 dark:placeholder-gray-300 
                                border border-gray-300 dark:border-slate-600 
                                focus:ring focus:ring-blue-400 focus:border-blue-400 rounded-lg "
                        />
                    </div>

                    {/* Conversations */}
                    <div className="hide-scrollbar flex-1 overflow-auto px-2 pt-1 pb-5 space-y-1">
                        {sortedConversations &&
                            sortedConversations.map((conversation) => (
                                <ConversationItem
                                    key={`${conversation.is_group ? "group_" : "chat_"}${conversation.id}`}
                                    conversation={conversation}
                                    selectedConversation={selectedConversation}
                                    online={!!isUserOnline(conversation.id)}
                                />
                            ))}
                        {sortedConversations.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                No Conversations
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                                You are not in any group yet or haven’t started a chat. Join a group or
                                create a new one to begin chatting.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main chat area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100">
                    {children}
                </div>
            </div>

        </>
    );
};

export default ChatLayout;
