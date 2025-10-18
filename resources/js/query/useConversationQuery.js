import { fetchAllConversations } from "@/service/conversationService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useFetchAllConversations = (searchParams = {}) => {
    return useInfiniteQuery({
        queryKey: ['conversations', searchParams],
        queryFn: ({ pageParam = 1 }) => fetchAllConversations({ page: pageParam, ...searchParams }),
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.meta.current_page;
            const lastPageNum = lastPage.meta.last_page;
            return currentPage < lastPageNum ? currentPage + 1 : undefined;
        },
        
    });
}
