import api from "@/utils/api";

export const fetchAllGroups = async (params) => {
    const { data } = await api.get("/groups", {params});
    return data?.data || null;
}