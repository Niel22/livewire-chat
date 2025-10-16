import api from "@/utils/api";

export const fetchAllUsers = async (params) => {
    const { data } = await api.get("/users", {params});
    return data?.data || null;
}

export const createStaff = async (payload) => {
    const { data } = await api.post(`/users`, payload);
    return data || null;
}

export const createSubAccount = async (payload) => {
    const { data } = await api.post(`/users/create-sub`, payload);
    return data || null;
}

export const updateUser = async ({id, payload}) => {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data || null;
}

export const updateUserDetails = async ({id, payload}) => {
    const { data } = await api.patch(`/users/${id}/user-details`, payload);
    return data || null;
}

export const updateUserPassword = async ({id, payload}) => {
    const { data } = await api.patch(`/users/${id}/change-password`, payload);
    return data || null;
}

export const deleteUser = async ({id}) => {
    const { data } = await api.delete(`/users/${id}`);
    return data || null;
}