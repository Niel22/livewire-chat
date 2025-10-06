import { fetchAllConversations } from "@/service/conversationService";
import { useQuery } from "@tanstack/react-query";

export const useFetchAllConversations = () => {
    return useQuery({
        queryKey: ['conversations'],
        queryFn: () => fetchAllConversations(),
        enabled: true,
        staleTime: 5 * 60 * 1000
    });
}
