import { fetchAllUsers } from "@/service/userService";
import { useQuery } from "@tanstack/react-query";

export const useFetchAllUsers = (queryParams) => {
    return useQuery({
        queryKey: ['users', queryParams],
        queryFn: () => fetchAllUsers(queryParams),
        enabled: true,
        staleTime: 5 * 60 * 1000
    });
}