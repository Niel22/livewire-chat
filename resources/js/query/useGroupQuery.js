import { fetchAllGroups } from "@/service/groupService";
import { useQuery } from "@tanstack/react-query";

export const useFetchAllGroups = (queryParams) => {
    return useQuery({
        queryKey: ['groups', queryParams],
        queryFn: () => fetchAllGroups(queryParams),
        enabled: true,
        staleTime: 5 * 60 * 1000
    });
}