
import ConversationItem from "@/Components/App/ConversationItem";
import TextInput from "@/Components/TextInput";
import { useEventBus } from "@/EventBus";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { usePage } from "@inertiajs/react";
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


    useEffect(() => {
        const offCreated = on('message.created', messageCreated);

        return () => {
            offCreated();
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
            <div className="flex-1 w-full flex overflow-hidden">
                {/* Sidebar */}
                <div
                    className={`transition-all w-full sm:w-[220px] md:w-[300px] 
                                bg-gradient-to-b from-blue-50 to-white 
                                dark:from-slate-800 dark:to-slate-900 
                                flex flex-col overflow-hidden 
                                border-r border-gray-200 dark:border-slate-700 shadow-sm
                                ${
                                    selectedConversation
                                        ? "-ml-[100%] sm:ml-0"
                                        : ""
                                }`}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between py-3 px-4 text-lg font-semibold 
                                    text-gray-700 dark:text-gray-100 border-b border-gray-200 dark:border-slate-700"
                    >
                        My Conversations
                        <div
                            className="tooltip tooltip-left"
                            data-tip="Create New Group"
                        >
                            <button className="text-blue-500 hover:text-blue-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                                <PlusCircleIcon className="w-7 h-7 inline-block ml-2" />
                            </button>
                        </div>
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
                                    key={`${
                                        conversation.is_group
                                            ? "group_"
                                            : "chat_"
                                    }${conversation.id}`}
                                    conversation={conversation}
                                    selectedConversation={selectedConversation}
                                    online={!!isUserOnline(conversation.id)}
                                />
                            ))}
                    </div>
                </div>

                {/* Main chat area */}
                <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100">
                    {children}
                </div>
            </div>

        </>
    );
};

export default ChatLayout;
