import { api } from "./base";
import type { PlatformKey, PlatformAccount, Account } from "../types";

export const AccountsAPI = {
    /**
     * Get all accounts
     * @returns {Promise<Account[]>}
     */
    list: () => api<Account[]>(`/api/accounts`),

    /**
     * Get all accounts with params
     * @returns {Promise<Array<{ platform: PlatformKey; name: string; connected: boolean }>>}
     */
    listWithParams: () =>
        api<Array<{ platform: PlatformKey; name: string; connected: boolean }>>(`/api/accounts`),

    /**
     *  Get all accounts for a platform
     * @param platform PlatformKey
     * @returns {Promise<PlatformAccount[]>}
     */
    listPlatformAccounts: (platform: PlatformKey) =>
        api<PlatformAccount[]>(`/api/accounts/${platform}`),

    /**
     * Start OAuth flow
     * @param platform PlatformKey
     * @param redirectUrl Redirect URL after OAuth
     */
    startOAuth: async (platform: PlatformKey, redirectUrl: string) => {
        return await api<{ authUrl: string }>(
            `/api/accounts/${platform}/oauth/start`,
            {
                method: "POST",
                body: JSON.stringify({ redirectUrl }),
            }
        );
    },

    /**
     * Set default account
     * @param platform PlatformKey
     * @param id Account ID
     * @returns {Promise<PlatformAccount>}
     */
    setDefault: (platform: PlatformKey, id: string) =>
        api<PlatformAccount>(`/api/accounts/${platform}/${id}/default`, { method: "PUT" }),

    getAccount: (platform: PlatformKey, id: string) =>
        api<PlatformAccount>(`/api/accounts/${platform}/${id}`),

    /**
     * Refresh token
     * @param platform PlatformKey 
     * @param id Account ID
     * @returns {Promise<PlatformAccount>}
     */
    refreshToken: (platform: PlatformKey, id: string) =>
        api<PlatformAccount>(`/api/accounts/${platform}/${id}/refresh`, { method: "POST" }),

    /**
     * Delete account
     * @param platform PlatformKey
     * @param id Account ID
     * @returns {Promise<{ status: "ok" }>} 
     */
    deleteAccount: (platform: PlatformKey, id: string) =>
        api<{ status: "ok" }>(`/api/accounts/${platform}/${id}`, { method: "DELETE" }),

    /**
     * Create manual account (for development)
     * @param platform PlatformKey
     * @param body Account details
     * @returns {Promise<PlatformAccount>}
     */
    createManual: (
        platform: PlatformKey,
        body: { name: string; handle?: string; externalId?: string; avatarUrl?: string, scopes?: string }
    ) =>
        api<PlatformAccount>(`/api/accounts/${platform}/manual`, {
            method: "POST",
            body: JSON.stringify(body),
        }),

    /**
     * Get token status
     * @param platform PlatformKey
     * @returns {Promise<{ valid: number; expired: number }>}
     */
    tokenStatus: (platform: PlatformKey) =>
        api<{ valid: number; expired: number }>(`/api/accounts/${platform}/tokens/status`),

    /**
     * Begin binding process
     * @param platform PlatformKey
     */
    beginBind: async (platform: PlatformKey) => {
        const redirectUrl = `${window.location.origin}/accounts/${platform}`;
        await AccountsAPI.startOAuth(platform, redirectUrl);
    },

    beginPlatform: async (platform: PlatformKey) => {
        // const redirectUrl = `${window.location.origin}/accounts/${platform}`;
        // const { authUrl } = await api<{ authUrl: string }>(
        //     `/api/accounts/${platform}/start`,
        //     { method: "POST", body: JSON.stringify({ redirectUrl }) }
        // );
        // window.location.href = authUrl;
        api<{ status: "ok" }>(`/api/accounts/${platform}/start`, { method: "POST" })
    },

    existsPlatform: async (platform: PlatformKey) => {
        return api<boolean>(`/api/accounts/${platform}/exists`, { method: "POST" })
    },

    revokePlatform: (platform: PlatformKey) =>
        api<{ status: "ok" }>(`/api/accounts/${platform}/revoke`, { method: "POST" }),

    getPrefill: (platform: PlatformKey, id: string) =>
        api<{ name: string; handle: string; externalId: string; avatarUrl: string; scopes: string[] }>(
            `/api/accounts/${platform}/prefill/${id}`
        ),
};
