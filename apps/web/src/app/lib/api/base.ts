export const API_BASE =
    (typeof window !== "undefined" && (window as any).__API_BASE__) ||
    process.env.NEXT_PUBLIC_API_BASE ||
    "http://localhost:8080";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const r = await fetch(`${API_BASE}${path}`, {
        method: init?.method || "GET",
        headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
        cache: "no-store",
        ...init,
    });
    if (!r.ok) {
        const text = await r.text().catch(() => "");
        throw new Error(`${r.status} ${r.statusText}: ${text}`);
    }
    return (await r.json()) as T;
}