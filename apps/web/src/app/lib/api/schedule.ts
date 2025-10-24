import { api } from "./base";
import type { ScheduledItem } from "../types";

export const ScheduleAPI = {
    list: () => api<ScheduledItem[]>(`/api/schedule`),

    create: (payload: Omit<ScheduledItem, "id"> & { description?: string; tags?: string; mediaId?: string }) =>
        api<ScheduledItem>(`/api/schedule`, { method: "POST", body: JSON.stringify(payload) }),

    remove: (id: string) => api<{ ok: boolean }>(`/api/schedule/${id}`, { method: "DELETE" }),

    listRange: (from: string, to: string) =>
        api<ScheduledItem[]>(`/api/schedule/range?from=${from}&to=${to}`),

    update: (id: string, payload: Partial<{
        title: string; description: string; tags: string;
        platform: ScheduledItem['platform']; date: string; mediaId: string;
    }>) => api<ScheduledItem>(`/api/schedule/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

};
