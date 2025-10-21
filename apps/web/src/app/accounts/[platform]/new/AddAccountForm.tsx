"use client";

import { use, useState } from "react";
import { AccountsAPI } from "@/app/lib/api/accounts";
import { useRouter } from "next/navigation";
import { PlatformKey } from "@/app/lib/types";

export default function AddAccountForm({ platform }: { platform: PlatformKey }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [handle, setHandle] = useState("");
    const [externalId, setExternalId] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const startOAuth = async () => {
        setLoading(true);
        try {
            const redirectUrl = `${window.location.origin}/api/oauth/${platform}/callback`;
            const { authUrl } = await AccountsAPI.startOAuth(platform, redirectUrl);
            window.location.href = authUrl;
        } catch (e: any) {
            alert(e.message || "OAuth start failed");
            setLoading(false);
        }
    };

    const createManual = async () => {
        setLoading(true);
        try {
            await AccountsAPI.createManual(platform, { name, handle, externalId, avatarUrl });
            router.push(`/accounts/${platform}`);
            router.refresh();
        } catch (e: any) {
            alert(e.message || "Create failed");
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 rounded-2xl border bg-white p-5">
                <h2 className="font-medium">手動で追加（開発用）</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-500">表示名</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-500">ハンドル（@xxx）</label>
                        <input value={handle} onChange={e => setHandle(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-500">External ID（channelId等）</label>
                        <input value={externalId} onChange={e => setExternalId(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-500">Avatar URL</label>
                        <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button onClick={createManual} disabled={loading}
                        className="rounded-xl bg-gray-900 text-white px-4 py-2 disabled:opacity-50">
                        保存
                    </button>
                    <button onClick={() => router.push(`/accounts/${platform}`)}
                        className="rounded-xl border px-4 py-2">キャンセル</button>
                </div>
            </div>

            <div className="rounded-2xl border bg-white p-5">
                <h2 className="font-medium">アクション</h2>
                <button onClick={startOAuth} disabled={loading}
                    className="mt-4 w-full rounded-xl bg-black text-white py-2 disabled:opacity-50">
                    OAuth 認可へ
                </button>
                <p className="text-xs text-gray-500 mt-3">
                    認可後は自動で{platform}ページへ戻ります。
                </p>
            </div>
        </div>
    );
}
