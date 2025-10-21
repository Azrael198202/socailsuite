import type { Account, PlatformAccount, PlatformKey, ScheduledItem } from "./types";

export const API_BASE =
    (typeof window !== "undefined" && (window as any).__API_BASE__) ||
    process.env.NEXT_PUBLIC_API_BASE ||
    "http://localhost:8080";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const r = await fetch(`${API_BASE}${path}`, {
        method: init?.method || "GET",
        headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
        ...(init || {}),
        cache: "no-store",
    });
    if (!r.ok) {
        throw new Error(`${r.status} ${r.statusText}: ${await r.text().catch(() => "")}`);
    }
    return (await r.json()) as T;
}

export const AccountsAPI = {
    list: () => api<Account[]>(`/api/accounts`),

    authorize: async (platform: PlatformKey) => {
        const { url } = await api<{ url: string }>(`/api/oauth/${platform}/authorize`, { method: "POST" });
        window.location.href = url;
    },
    revoke: (platform: PlatformKey) => api<{ ok: boolean }>(`/api/oauth/${platform}/revoke`, { method: "POST" }),

    listPlatformAccounts: (platform: PlatformKey) =>
        api<PlatformAccount[]>(`/api/accounts/${platform}`),

    revokeAccount: (accountId: string) =>
        api<{ ok: boolean }>(`/api/accounts/bindings/${accountId}`, { method: "DELETE" }),

    setDefault: (accountId: string) =>
        api<{ ok: boolean }>(`/api/accounts/bindings/${accountId}/default`, { method: "POST" }),

    refreshToken: (accountId: string) =>
        api<{ ok: boolean }>(`/api/accounts/bindings/${accountId}/refresh`, { method: "POST" }),

    beginBind: async (platform: PlatformKey) => {
        const { url } = await api<{ url: string }>(`/api/accounts/${platform}/authorize`, { method: "POST" });
        window.location.href = url; 
    },
};

export const ScheduleAPI = {
    list: () => api<ScheduledItem[]>(`/api/schedule`),
    create: (payload: Omit<ScheduledItem, "id"> & { description?: string; tags?: string }) =>
        api<ScheduledItem>(`/api/schedule`, { method: "POST", body: JSON.stringify(payload) }),
    remove: (id: string) => api<{ ok: boolean }>(`/api/schedule/${id}`, { method: "DELETE" }),
};
