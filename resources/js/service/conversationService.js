import api from "@/utils/api";

export const fetchAllConversations = async () => {
    const { data } = await api.get("/conversations");
    return data?.data || null;
}