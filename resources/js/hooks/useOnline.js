import useOnlineStore from "@/store/useOnlineStore";

export default function useOnline(){
    const { isUserOnline } = useOnlineStore();

    const userIsOnline = (user) => {
        if(user.staff_id || user.role === "staff" || user.role === "admin"){
            return true;
        }

        return isUserOnline(user.id);
    }
    
    return { userIsOnline }
}