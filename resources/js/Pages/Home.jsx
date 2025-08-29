import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useRef, useState } from "react";
import ChatLayout from "./ChatLayout";
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageItem from "@/Components/App/MessageItem";
import MessageInput from "@/Components/App/MessageInput";
import { useEventBus } from "@/EventBus";
import axios from "axios";
import { usePage } from "@inertiajs/react";

function Home({ selectedConversation = null, messages = null, online = null }) {
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(null);
    const messageCtrRef = useRef(null);
    const loadMoreIntersect = useRef(null);
    const {on} = useEventBus();
    const { auth } = usePage().props;

    const messageCreated = (message) => {
        if(selectedConversation?.is_group && selectedConversation?.id == message.group_id){
            setLocalMessages(prevMessages => {
                const exists = prevMessages.some(m => m.id === message.id);
                if (exists) return prevMessages;
                 if ("Notification" in window && Notification.permission === "granted" && message.sender_id !== auth.user.id) {
                        new Notification("New Message", {
                            body: message.message,
                        });
                    }
                return [...prevMessages, message];
            });
        }else if(!selectedConversation?.is_group && selectedConversation?.id == message.conversation_id){
            setLocalMessages(prevMessages => {
                const exists = prevMessages.some(m => m.id === message.id);
                if (exists) return prevMessages;
                 if ("Notification" in window && Notification.permission === "granted" && message.sender_id !== auth.user.id) {
                    new Notification("New Message", {
                        body: message.message,
                    });
                }
                return [...prevMessages, message];
            });
        }
    }

    const loadMoreMessages = useCallback(() => {
        if(noMoreMessages){
            return;
        }

        const firstMessage = localMessages[0];
        axios.get(route('message.loadOlder', firstMessage.id))
            .then(({data}) => {
                if(data.data.length === 0){
                    setNoMoreMessages(true);
                    return;
                }

                const scrollHeight = messageCtrRef.current.scrollHeight;
                const scrollTop = messageCtrRef.current.scrollTop;
                const clientHeight = messageCtrRef.current.clientHeight;
                const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight;
                setScrollFromBottom(scrollHeight - scrollTop - clientHeight);

                setLocalMessages((prev) => {
                    return [...data.data, ...prev];
                })
            })
            .catch((error) => {

            });
    }, [localMessages, noMoreMessages])

    useEffect(() => {
        setTimeout(() => {
            if (messageCtrRef.current) {
                messageCtrRef.current.scrollTop = messageCtrRef.current.scrollHeight;
            }
        }, 10);

        const offCreated = on('message.created', messageCreated);

        setScrollFromBottom(0);
        setNoMoreMessages(false);

        return () => {
            offCreated();
        }
    }, [selectedConversation]);

    useEffect(() => {
        setLocalMessages(messages?.data);
    }, [messages]);

    useEffect(() => {
        if(messageCtrRef.current && scrollFromBottom !== null){
            messageCtrRef.current.scrollTop = messageCtrRef.current.scrollHeight - messageCtrRef.current.offsetHeight - scrollFromBottom;
        }

        if(noMoreMessages){
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => 
                entries.forEach(
                    (entry) => entry.isIntersecting && loadMoreMessages()
                ),
            {
                rootMargin: "0px 0px 250px 0px",
            }
        );

        if(loadMoreIntersect.current){
            setTimeout(() => {
                observer.observe(loadMoreIntersect.current);
            }, 100)
        }

        return () => {
            observer.disconnect();
        }
    }, [localMessages])


    return (
        <>
            {!messages && (
                <div
                    className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-70 
                                bg-gradient-to-b from-blue-50 to-white 
                                dark:from-slate-800 dark:to-slate-900 
                                transition-colors"
                >
                    <div className="text-2xl md:text-4xl p-16 text-gray-700 dark:text-slate-200">
                        Please select a conversation
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block text-blue-400 dark:text-slate-400" />
                </div>
            )}

            {messages && (
                <>
                    {/* Header with subtle border */}
                    <ConversationHeader
                        selectedConversation={selectedConversation} 
                        online={online}
                        className="bg-white/80 dark:bg-slate-800/80 
                                backdrop-blur-md border-b border-gray-200 dark:border-slate-700 
                                shadow-sm transition-colors"
                    />

                    {/* Messages section with gradient */}
                    <div
                        className="flex-1 overflow-y-auto custom-scrollbar p-5 
                                bg-gradient-to-b from-blue-50/50 to-white 
                                dark:from-slate-900 dark:to-slate-950 
                                transition-colors"
                        ref={messageCtrRef}
                    >
                        {!localMessages?.length && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-gray-600 dark:text-slate-300">
                                    No messages found
                                </div>
                            </div>
                        )}

                        {localMessages?.length > 0 && (
                            <div className="flex-1 flex flex-col space-y-3">
                                <div ref={loadMoreIntersect}></div>
                                {localMessages.map((message, index) => (
                                    <MessageItem
                                        key={`${message.id}-${index}`}
                                        message={message}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input bar with soft top border */}
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm 
                                    border-t border-gray-200 dark:border-slate-700 shadow-inner">
                        <MessageInput conversation={selectedConversation} />
                    </div>
                </>
            )}

        </>
    );
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout>
            <ChatLayout children={page}></ChatLayout>
        </AuthenticatedLayout>
    );
};

export default Home;
