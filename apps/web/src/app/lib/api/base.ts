export const API_BASE =
    (typeof window !== "undefined" && (window as any).__API_BASE__) ||
    process.env.NEXT_PUBLIC_API_BASE ||
    "http://localhost:8080";

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const method = init.method ?? "GET";
    const headers = { ...(init.headers || {}) } as Record<string, string>;
    if (init.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    console.log('API_BASE=', API_BASE);
    const r = await fetch(`${API_BASE}${path}`, {
        ...init,
        method,
        headers,
        cache: "no-store",
        // TODO: enable when using cookies for auth
        // credentials: "include",
    });    

    if (!r.ok) {
        const txt = await r.text().catch(() => "");
        throw new Error(`${r.status} ${r.statusText}: ${txt}`);
    }

    return (await r.json()) as T;
}