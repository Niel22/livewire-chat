import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useRef, useState } from "react";
import ChatLayout from "./ChatLayout";
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageItem from "@/Components/App/MessageItem";
import MessageInput from "@/Components/App/MessageInput";
import { useEventBus } from "@/EventBus";
import axios from "axios";
import { Head, usePage } from "@inertiajs/react";
import AttachmentPreviewModal from "@/Components/App/AttachmentPreviewModal";
import { fetchMessageById } from "@/helpers";
import useMessageEvents from "@/hooks/useMessageEvents";
import MessageSearchModal from "@/Components/App/MessageSearchModal";
import { useTranslation } from "react-i18next";
import useOnlineStore from "@/store/useOnlineStore";
import useOnline from "@/hooks/useOnline";

function Home({ selectedConversation = null, messages = null, pins }) {
    
    const { t } = useTranslation('convo');

    const { isUserOnline } = useOnlineStore();
    const {userIsOnline} = useOnline();
    
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [isLocked, setIsLocked] = useState(parseInt(selectedConversation?.is_locked) || false);
    const messageCtrRef = useRef(null);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});
    const [searchOpen, setSearchOpen] = useState(false);
    const loadMoreIntersect = useRef(null);
    const highlightTimerRef = useRef(null);
    const {on, emit} = useEventBus();
    const { auth } = usePage().props;


    const isAdmin = () => {
        if(selectedConversation.is_group){

            if(parseInt(selectedConversation.admin.id) === parseInt(auth.user.id) || auth.user.role === 'admin'){
                return true;
            }

            return false
        }

        if(auth.user.role === "member"){
            return false;
        }

        return true;
    }

    useMessageEvents({selectedConversation, auth, setLocalMessages, setPinnedMessages, setIsLocked, setScrollFromBottom, messageCtrRef});

    const onAttchmentClick = (attachments, index) => {
        setPreviewAttachment({
            attachments, index
        });

        setShowAttachmentPreview(true);
    }

    useEffect(() => {
        setIsLocked(parseInt(selectedConversation?.is_locked) || false);
    }, [selectedConversation]);

    useEffect(() => {
        setPinnedMessages(pins?.data);
    }, [pins]);
   
    useEffect(() => {
        setPinnedMessages([]);
    }, []);

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

        setScrollFromBottom(0);
        setNoMoreMessages(false);

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

    function scrollAndHighlight(messageId) {
        const el = document.getElementById(`message-${messageId}`);
        if (!el) return;

        el.scrollIntoView({ behavior: "smooth", block: "center" });

         el.classList.add("shadow-[0_0_10px_3px_rgba(16,185,129,0.7)]");

        if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);

        highlightTimerRef.current = setTimeout(() => {
            el.classList.remove("shadow-[0_0_10px_3px_rgba(16,185,129,0.7)]");
            highlightTimerRef.current = null;
        }, 3000);
    }

    async function handleViewOriginal(messageId) {
        
        const el = document.getElementById(`message-${messageId}`);
        if (el) {
            scrollAndHighlight(messageId);
            return;
        }
        emit('toast.show', 'Retrieving message...');

        const msg = await fetchMessageById(messageId);
        if (msg) {
            
            setLocalMessages(prev => {
                
                if (prev.find(m => m.id === msg.id)) return prev;
                return [msg, ...prev];
            });

            setTimeout(() => scrollAndHighlight(messageId), 100);
        } else {
            emit('toast.show', 'Unable to retrieve message');
        }
    }

    useEffect(() => {
        return () => {
            if (highlightTimerRef.current) {
                clearTimeout(highlightTimerRef.current);
                highlightTimerRef.current = null;
            }
        };
    }, []);

    return (
        <>
            <Head title={selectedConversation?.is_group ? selectedConversation?.name : selectedConversation?.name} />
            
            {!messages && (
                <div
                    className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-70 
                                bg-gradient-to-b from-blue-50 to-white 
                                dark:from-slate-800 dark:to-slate-900 
                                transition-colors"
                >
                    <div className="text-2xl md:text-4xl p-16 text-gray-700 dark:text-slate-200">
                        {t('pleaseSelectConversation')}
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block text-blue-400 dark:text-slate-400" />
                </div>
            )}

            {messages && (
                <div className="flex relative flex-col h-screen max-h-screen overflow-hidden">
                    
                    <ConversationHeader
                        handleViewOriginal={handleViewOriginal}
                        selectedConversation={selectedConversation}
                        pinnedMessages={pinnedMessages}
                        isLocked={isLocked}
                        isAdmin={isAdmin}
                        online={selectedConversation?.receiver_id ? isUserOnline(selectedConversation?.receiver_id) : false}
                        setSearchOpen={setSearchOpen}

                        className="flex-none bg-white/80 dark:bg-slate-800/80 
                                backdrop-blur-md border-b border-gray-200 dark:border-slate-700 
                                shadow-sm transition-colors"
                    />
                    
                    <div
                        className="flex-1 min-w-0 overflow-y-auto max-w-full overflow-x-hidden custom-scrollbar p-5 
                                bg-gradient-to-b from-blue-50/50 to-white 
                                dark:from-slate-900 dark:to-slate-950 
                                transition-colors"
                        ref={messageCtrRef}
                    >
                        {!localMessages?.length && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-gray-600 dark:text-slate-300">
                                    {t('noMessagesFound')}
                                </div>
                            </div>
                        )}

                        {localMessages?.length > 0 && (
                            <div className="flex-1 flex flex-col space-y-2">
                                <div className="
                                    w-max mx-auto 
                                    px-4 py-1.5 
                                    text-xs md:text-sm font-medium 
                                    text-blue-700 dark:text-blue-300 
                                    bg-blue-50 dark:bg-blue-900/30 
                                    border border-blue-200 dark:border-blue-800 
                                    rounded-full shadow-sm 
                                     select-none 
                                    hover:bg-blue-100 dark:hover:bg-blue-800/40 
                                    transition
                                ">
                                    {t('loadOldestMessages')}
                                </div>

                                <div ref={loadMoreIntersect}></div>
                                {localMessages.map((message, index) => (
                                    <MessageItem
                                        online={message?.sender_id ? userIsOnline(message?.sender) : false}
                                        handleViewOriginal={handleViewOriginal}
                                        key={`${message.id}-${index}`}
                                        message={message}
                                        attachmentClick={onAttchmentClick}
                                        setReplyingTo={setReplyingTo}
                                        setPinnedMessages={setPinnedMessages}
                                        isAdmin={isAdmin}
                                        
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <MessageInput isLocked={isLocked} conversation={selectedConversation} setReplyingTo={setReplyingTo} replyingTo={replyingTo} user={auth.user} />
                </div>
            )}

            {previewAttachment.attachments && (
                <AttachmentPreviewModal attachments={previewAttachment.attachments} index={previewAttachment.index} show={showAttachmentPreview} onClose={() => setShowAttachmentPreview(false)} />
            )}

            <MessageSearchModal handleViewOriginal={handleViewOriginal} conversation={selectedConversation} searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

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
