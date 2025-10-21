import { createGroup, deleteGroup, fetchAllGroups, muteMember, updateGroup } from "@/service/groupService";
import { toastStore } from "@/store/toastStore";
import { router } from "@inertiajs/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchAllGroups = (queryParams) => {
    return useQuery({
        queryKey: ['groups', queryParams],
        queryFn: () => fetchAllGroups(queryParams),
        enabled: true,
        staleTime: 5 * 60 * 1000
    });
}

export const useCreateGroup = () => {
    
    const { setToast } = toastStore.getState();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createGroup,
        onSuccess: (data) => {
            setToast(data.message, "success");
            queryClient.invalidateQueries(['groups']);
            router.visit('/groups');
        },
        onError: (error) => {
            setToast(error?.response?.data?.message ?? "A Problem Occured, Please try again", "error");
        }
    })
}

export const useUpdateGroup = () => {
    
    const { setToast } = toastStore.getState();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateGroup,
        onSuccess: (data) => {
            setToast(data.message, "success");
            queryClient.invalidateQueries(['groups']);
            router.visit('/groups');
        },
        onError: (error) => {
            setToast(error?.response?.data?.message ?? "A Problem Occured, Please try again", "error");
        }
    })
}

export const useMuteMember = () => {
    
    const { setToast } = toastStore.getState();

    return useMutation({
        mutationFn: muteMember,
        onSuccess: (data) => {
            setToast(data.message, "success");
        },
        onError: (error) => {
            setToast(error?.response?.data?.message ?? "A Problem Occured, Please try again", "error");
        }
    })
}

export const useDeleteGroup = (refetch, closeDeleteModal) => {
    
    const { setToast } = toastStore.getState();

    return useMutation({
        mutationFn: deleteGroup,
        onSuccess: (data) => {
            setToast(data.message, "success");
            refetch();
            closeDeleteModal();
        },
        onError: (error) => {
            setToast(error?.response?.data?.message ?? "A Problem Occured, Please try again", "error");
            closeDeleteModal();
        }
    })
}