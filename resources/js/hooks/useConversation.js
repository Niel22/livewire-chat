import { useEventBus } from "@/EventBus";
import { useFetchAllConversations } from "@/query/useConversationQuery";
import { useChatStore } from "@/store/chatStore";
import useOnlineStore from "@/store/useOnlineStore";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function useConversation(){

    const { t } = useTranslation("sidebar");
    const page = usePage();
    const {data: conversations, isLoading} = useFetchAllConversations();
    const setConversations = useChatStore((state) => state.setConversations);

    const auth = page.props.auth;
    const { setOnlineUsers, addOnlineUser, removeOnlineUser, isUserOnline } = useOnlineStore();
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);

    const {on} = useEventBus();
    
    useEffect(() => {
        if(!isLoading) {
            setLocalConversations(conversations);
            setConversations(conversations);
        }
    }, [conversations, isLoading]);

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
            localConversations
            .filter(convo => convo.is_group || convo.last_message_date !== null)
            .sort((a, b) => {
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

                setOnlineUsers(onlineUsersObject);
            })
            .joining((user) => {
                addOnlineUser(user);
            })
            .leaving((user) => {
                removeOnlineUser(user.id);
            })
            .error((error) => {
                // console.log("errors", error);
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

    return {
        t, isUserOnline, selectedConversation, sortedConversations, onSearch, auth, isLoading
    }

}