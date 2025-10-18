import { useEventBus } from "@/EventBus";
import { useFetchAllConversations } from "@/query/useConversationQuery";
import { useChatStore } from "@/store/chatStore";
import useOnlineStore from "@/store/useOnlineStore";
import { usePage } from "@inertiajs/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function useConversation(){

    const { t } = useTranslation("sidebar");
    const page = usePage();
    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status, isLoading} = useFetchAllConversations();

    const conversationsData = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) || [];
    }, [data]);

    const setConversations = useChatStore((state) => state.setConversations);
    const updateConversation = useChatStore((state) => state.updateConversation);
    const searchConversations = useChatStore((state) => state.searchConversations);
    const updateConversationOnDelete = useChatStore((state) => state.updateConversationOnDelete);
    const conversations = useChatStore((state) => state.conversations);

    const auth = page.props.auth;
    const { setOnlineUsers, addOnlineUser, removeOnlineUser, isUserOnline } = useOnlineStore();
    const selectedConversation = page.props.selectedConversation;

    const {on} = useEventBus();

    const prevCount = useRef(0);
    
    useEffect(() => {
        if (isLoading) return;
        if (conversationsData.length === 0) return;
        if (conversationsData.length === prevCount.current) return;

        prevCount.current = conversationsData.length;
         
        setConversations(conversationsData);
    }, [conversationsData, isLoading]);

    const loadMoreRef = useRef(null);

    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
        entries => {
            if (entries[0].isIntersecting) fetchNextPage();
        },
        { threshold: 1 }
        );

        const current = loadMoreRef.current;
        if (current) observer.observe(current);

        return () => current && observer.unobserve(current);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const messageCreated = (message) => {
        updateConversation(message, auth.user.id);
    }

    const messageDeleted = ({prevMessage}) => {
        updateConversationOnDelete(prevMessage);
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
        searchConversations(e.target.value.toLowerCase())
    }

    return {
        t, isUserOnline, selectedConversation, conversations, onSearch, auth, isLoading, loadMoreRef, isFetchingNextPage, hasNextPage
    }

}