import api from "@/utils/api";

export const register = async (payload) => {
    const data = await api.post("/register", payload);
    return data.data || null;
}

export const login = async (payload) => {
    const { data } = await api.post("/login", payload);
    return data || null;
}

export const logout = async () => {
    const { data } = await api.post("/logout");
    return data || null;
}