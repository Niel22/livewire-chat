import { createStaff, createSubAccount, deleteUser, fetchAllUsers, updateUser, updateUserDetails, updateUserPassword } from "@/service/userService";
import { toastStore } from "@/store/toastStore";
import { router } from "@inertiajs/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useFetchAllUsers = (queryParams) => {
    return useQuery({
        queryKey: ['users', queryParams],
        queryFn: () => fetchAllUsers(queryParams),
        enabled: true,
        staleTime: 5 * 60 * 1000
    });
}

export const useCreateSubAccount = () => {
    
    const { setToast } = toastStore.getState();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSubAccount,
        onSuccess: (data) => {
            setToast(data.message, "success");
            queryClient.invalidateQueries(['users']);
            router.visit('/users');
        },
        onError: (error) => {
            setToast(error?.response?.data?.message ?? "A Problem Occured, Please try again", "error");
        }
    })
}

export const useCreateStaff = () => {
    
    const { setToast } = toastStore.getState();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStaff,
        onSuccess: (data) => {
            setToast(data.message, "success");
            queryClient.invalidateQueries(['users']);
            router.visit('/users');
        },
        onError: (error) => {
            setToast(error?.response?.data?.message ?? "A Problem Occured, Please try again", "error");
        }
    })
}

export const useUpdateUser = () => {
    
    const { setToast } = toastStore.getState();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUser,
        onSuccess: (data) => {
            setToast(data.message, "success");
            queryClient.invalidateQueries(['users']);
        },
        onError: (error) => {
            setToast(error?.response?.data?.message ?? "A Problem Occured, Please try again", "error");
        }
    })
}

export const useUpdateUserDetails = () => {
    
    const { setToast } = toastStore.getState();

    return useMutation({
        mutationFn: updateUserDetails,
        onSuccess: (data) => {
            setToast(data.message, "success");
        },
        onError: (error) => {
            setToast(error?.response?.data?.message ?? "A Problem Occured, Please try again", "error");
        }
    })
}

export const useUpdateUserPassword = (reset) => {
    
    const { setToast } = toastStore.getState();

    return useMutation({
        mutationFn: updateUserPassword,
        onSuccess: (data) => {
            setToast(data.message, "success");
            reset();
        },
        onError: (error) => {
            setToast(error?.response?.data?.message ?? "A Problem Occured, Please try again", "error");
        }
    })
}

export const useDeleteUser = (refetch, closeDeleteModal) => {
    
    const { setToast } = toastStore.getState();

    return useMutation({
        mutationFn: deleteUser,
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