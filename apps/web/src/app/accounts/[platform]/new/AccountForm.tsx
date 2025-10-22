"use client";

import { use, useState, useEffect } from "react";
import { AccountsAPI } from "@/app/lib/api/accounts";
import { useRouter, useSearchParams } from "next/navigation";
import { PlatformKey } from "@/app/lib/types";

export default function AccountForm({ platform }: { platform: PlatformKey }) {
    const router = useRouter();
    const sp = useSearchParams();
    const [name, setName] = useState("");
    const [handle, setHandle] = useState("");
    const [externalId, setExternalId] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [scopes, setScopes] = useState("");

    useEffect(() => {
        const id = sp.get("prefill");
        if (!id) return;
        (async () => {
            setLoading(true);
            try {
                const d = await AccountsAPI.getPrefill(platform, id);
                setName(d.name ?? "");
                setHandle(d.handle ?? "");
                setExternalId(d.externalId ?? "");
                setAvatarUrl(d.avatarUrl ?? "");
                setScopes(Array.isArray(d.scopes) ? d.scopes.join(',') : '');
            } finally {
                setLoading(false);
            }
        })();
    }, [platform, sp]);

    useEffect(() => {
        const id = sp.get("view");
        if (!id) return;
        (async () => {
            setLoading(true);
            try {
                const a = await AccountsAPI.getAccount(platform, id);
                setName(a.name ?? "");
                setHandle(a.handle ?? "");
                setExternalId(a.externalId ?? "");
                setAvatarUrl(a.avatarUrl ?? "");
                setScopes(Array.isArray(a.scopes) ? a.scopes.join(',') : '');
            } finally {
                setLoading(false);
            }
        })();
    }, [platform, sp]);

    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 左：フォーム */}
            <div className="md:col-span-8">
                <div className="rounded-2xl border bg-white shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold">YOUTUBE アカウント確認</h2>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">（表示用）</span>
                    </div>

                    {/* 基本情報 */}
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-800">基本情報</h3>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs text-gray-500">表示名</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="例）Megumi Studio"
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10" readOnly
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-gray-500">ハンドル（@xxx）</label>
                                <input
                                    value={handle}
                                    onChange={(e) => setHandle(e.target.value)}
                                    placeholder="@megumi"
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10" readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* 連携情報 */}
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-800">連携情報</h3>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs text-gray-500">
                                    External ID <span className="text-[10px] text-gray-400">(channelId 等)</span>
                                </label>
                                <input
                                    value={externalId}
                                    onChange={(e) => setExternalId(e.target.value)}
                                    placeholder="UC_xxx..."
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10" readOnly
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-gray-500">Scopes <span className="text-[10px] text-gray-400">(カンマ区切り)</span></label>
                                <input
                                    value={scopes}
                                    onChange={(e) => setScopes(e.target.value)}
                                    placeholder="youtube.upload, yt-analytics.readonly"
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10" readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* 画像 */}
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-800">アバター</h3>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
                            <input
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10" readOnly
                            />
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full overflow-hidden ring-1 ring-gray-200 bg-gray-50">
                                    {avatarUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={avatarUrl} alt="avatar preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full grid place-items-center text-gray-300 text-xs">No Img</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                            画像 URL を貼り付けると右側にプレビューが表示されます。
                        </p>
                    </div>
                </div>
            </div>

            {/* 右：プレビュー */}
            <div className="md:col-span-4">
                <div className="rounded-2xl border bg-white shadow-sm p-6 sticky top-6">
                    <h3 className="text-sm font-medium text-gray-800">プレビュー</h3>

                    <div className="mt-4 flex items-center gap-3">
                        <div className="h-14 w-14 rounded-full overflow-hidden ring-1 ring-gray-200 bg-gray-50">
                            {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={avatarUrl} alt="avatar preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full grid place-items-center text-gray-300 text-xs">No Img</div>
                            )}
                        </div>
                        <div>
                            <div className="font-medium leading-5">{name || "未設定の表示名"}</div>
                            <div className="text-xs text-gray-500">{handle || "@handle"}</div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="text-xs text-gray-500">External ID</div>
                        <div className="mt-1 text-sm font-mono break-all bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                            {externalId || "—"}
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="text-xs text-gray-500">Scopes</div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {(scopes || "")
                                .split(",")
                                .map(s => s.trim())
                                .filter(Boolean)
                                .map(s => (
                                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                                        {s}
                                    </span>
                                ))}
                            {!scopes && <span className="text-xs text-gray-400">—</span>}
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-2">
                        <button className="px-3 py-2 rounded-xl border">キャンセル</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
