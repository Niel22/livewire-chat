import { useEventBus } from "@/EventBus";
import { useEffect } from "react";

export default function useMessageEvents({selectedConversation, auth, setLocalMessages, setPinnedMessage, setIsLocked}){
    const { on } = useEventBus();

    const messageCreated = (message) => {
        if(selectedConversation?.is_group && selectedConversation?.id == message.group_id){
            setLocalMessages(prevMessages => {
                const exists = prevMessages.some(m => m.id === message.id);
                if (exists) return prevMessages;
                 if ("Notification" in window && Notification.permission === "granted" && message.sender_id !== auth.user.id) {
                        new Notification("New Message", {
                            body: message.message ?? "Sent an Attachment",
                        });
                        const audio = new Audio("/notify.wav");
                        audio.play().catch((err) => {
                            console.warn("Unable to play notification sound automatically:", err);
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
                        body: message.message ?? "Sent an attachment",
                    });
                    const audio = new Audio("/notify.wav");
                    audio.play().catch((err) => {
                        console.warn("Unable to play notification sound automatically:", err);
                    });
                }
                return [...prevMessages, message];
            });
        }
    }

    const messageDeleted = ({message}) => {
        if(selectedConversation?.is_group && selectedConversation?.id == message.group_id){
            setLocalMessages(prevMessages => {
                return prevMessages.filter((m) => m.id !== message.id)
            });
        }else if(!selectedConversation?.is_group && selectedConversation?.id == message.conversation_id){
            setLocalMessages(prevMessages => {
                return prevMessages.filter((m) => m.id !== message.id)
            });
        }
    }


    const messagePinned = (message) => {
        if(selectedConversation?.is_group && selectedConversation?.id == message.group_id){
            setPinnedMessage(message);
        }else if(!selectedConversation?.is_group && selectedConversation?.id == message.conversation_id){
            setPinnedMessage(message);
        }
    }

    const groupLocked = (group) => {
        setIsLocked(group.is_locked);
    }

    useEffect(() => {
        const offCreated = on('message.created', messageCreated);
        const offDeleted = on('message.deleted', messageDeleted);
        const offPinned = on('message.pinned', messagePinned);
        const offGroupLocked = on('group.locked', groupLocked);

        return () => {
            offCreated();
            offDeleted();
            offPinned();
            offGroupLocked();
        };
    }, [selectedConversation, auth]);
}