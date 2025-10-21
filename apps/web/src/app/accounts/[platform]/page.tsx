'use client';
import React, { useEffect, useState } from 'react';
import SectionCard from "@/app/ui/SectionCard";
import { platforms } from "@/app/lib/platforms";
import { AccountsAPI } from "@/app/lib/api";
import type { PlatformKey, PlatformAccount } from "@/app/lib/types";
import AccountChip from "@/app/ui/AccountChip";
import ConnectModal from "@/app/ui/ConnectModal";
import Link from "next/link";

export default function PlatformDetail({ params }: { params: { platform: PlatformKey } }) {
    const p = platforms.find(pp => pp.key === params.platform);
    const [items, setItems] = useState<PlatformAccount[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setItems(await AccountsAPI.listPlatformAccounts(params.platform));
            } catch {
                // 🔧 local demo data
                setItems([
                    { id: '1', platform: params.platform, handle: '@megumi', displayName: 'Megumi Studio', scopes: ['upload', 'analytics'], createdAt: new Date().toISOString(), status: 'active', isDefault: true },
                    { id: '2', platform: params.platform, handle: '@teamdev', displayName: 'Team Dev', scopes: ['upload'], createdAt: new Date().toISOString(), status: 'active' },
                ]);
            }
        })();
    }, [params.platform]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <Link href="/accounts" className="text-sm text-gray-500">← アカウント一覧へ</Link>
            <h1 className="text-2xl font-semibold mt-2 flex items-center gap-2">
                {p && <p.icon className="w-5 h-5" />} {p?.name} アカウント管理
            </h1>

            <div className="grid grid-cols-12 gap-5 mt-4">
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
                    <SectionCard title="連携済みアカウント">
                        <div className="space-y-2">
                            {items.map(acc => (
                                <AccountChip key={acc.id}
                                    label={`${acc.displayName} (${acc.handle})`}
                                    hint={acc.scopes.join(', ')}
                                    status={acc.status}
                                    isDefault={acc.isDefault}
                                    onDefault={acc.isDefault ? undefined : async () => {
                                        await AccountsAPI.setDefault(acc.id);
                                        setItems(s => s.map(x => ({ ...x, isDefault: x.id === acc.id })));
                                    }}
                                    onRefresh={async () => { await AccountsAPI.refreshToken(acc.id); alert('トークンを再取得しました'); }}
                                    onRemove={async () => {
                                        try { await AccountsAPI.revokeAccount(acc.id); } catch { }
                                        setItems(s => s.filter(x => x.id !== acc.id));
                                    }}
                                />
                            ))}
                            {items.length === 0 && <div className="text-sm text-gray-500">まだ連携されたアカウントがありません。</div>}
                        </div>
                    </SectionCard>

                    <SectionCard title="既定アカウントの説明">
                        <p className="text-sm text-gray-600">
                            既定に設定したアカウントは、投稿作成時に自動で選択されます。必要に応じて各投稿で上書きできます。
                        </p>
                    </SectionCard>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
                    <SectionCard title="アクション">
                        <div className="space-y-2">
                            <button className="w-full px-3 py-2 rounded-xl bg-gray-900 text-white" onClick={() => setOpen(true)}>新しいアカウントを連携</button>
                            <button className="w-full px-3 py-2 rounded-xl border" onClick={async () => { await AccountsAPI.beginBind(params.platform); }}>OAuth 認可へ</button>
                        </div>
                    </SectionCard>
                    <SectionCard title="トークン状態">
                        <ul className="text-sm text-gray-600 list-disc pl-5">
                            <li>有効: {items.filter(i => i.status === 'active').length}</li>
                            <li>期限切れ: {items.filter(i => i.status === 'expired').length}</li>
                        </ul>
                    </SectionCard>
                </div>
            </div>

            <ConnectModal
                open={open}
                onClose={() => setOpen(false)}
                onConnect={async () => { setOpen(false); await AccountsAPI.beginBind(params.platform); }}
            />
        </div>
    );
}
