import api from "@/utils/api";

export const fetchAllUsers = async (params) => {
    const { data } = await api.get("/users", {params});
    return data?.data || null;
}