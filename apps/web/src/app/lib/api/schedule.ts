import { api } from "./base";
import type { ScheduledItem } from "../types";

export const ScheduleAPI = {
    list: () => api<ScheduledItem[]>(`/api/schedule`),

    create: (payload: Omit<ScheduledItem, "id"> & { description?: string; tags?: string; mediaId?:string }) =>
        api<ScheduledItem>(`/api/schedule`, { method: "POST", body: JSON.stringify(payload) }),
    
    remove: (id: string) => api<{ ok: boolean }>(`/api/schedule/${id}`, { method: "DELETE" }),
};
