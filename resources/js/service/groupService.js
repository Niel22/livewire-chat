import api from "@/utils/api";

export const fetchAllGroups = async (params) => {
    const { data } = await api.get("/groups", {params});
    return data?.data || null;
}

export const createGroup = async (payload) => {
    const { data } = await api.post("/groups", payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data || null;
}

export const updateGroup = async ({id, payload}) => {
    const { data } = await api.post(`/groups/${id}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data || null;
}

export const muteMember = async ({groupId, memberId}) => {
    const { data } = await api.patch(`/groups/${groupId}/members/${memberId}/mute`);
    return data || null;
}

export const deleteGroup = async ({id}) => {
    const { data } = await api.delete(`/groups/${id}`);
    return data || null;
}