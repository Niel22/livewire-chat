import { login, logout, register } from "@/service/authService";
import { toastStore } from "@/store/toastStore";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
    
    const { setToast } = toastStore.getState();

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setToast("Logged In Succesfully, wait while you are being redirected to your dashboard", "success");
            window.location.href = `/`;
        },
        onError: (error) => {
            setToast(error?.response?.data?.message ?? "A Problem Occured, Please try again", "error");
        }
    })
}

export const useRegister = () => {
    const { setToast } = toastStore.getState();
    return useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            setToast("Registered Succesfully, wait while you are being redirected to your dashboard", "success");
            if(data?.data){
                window.location.href = `conversation/${data.data.id}`;
                return;
            }
            window.location.href = `/`;
        },
        onError: (error) => {
            setToast(error?.response?.data?.message ?? "A Problem Occured, Please try again", "error");
        }
    })
}

export const useLogout = () => {
  const { setToast } = toastStore.getState();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setToast("Logged out successfully", "success");
      window.location.href = "/login";
    },
    onError: () => {
      setToast("Something went wrong while logging out", "error");
    },
  });
};