import api from "@/utils/api";

export const fetchAllConversations = async ({page = 1, search = ""}) => {
    const { data } = await api.get("/conversations", {params: {page, search}});
    return data?.data || null;
}   