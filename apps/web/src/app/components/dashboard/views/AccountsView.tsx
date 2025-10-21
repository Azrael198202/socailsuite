'use client';
import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/app/lib/i18n';
import SectionCard from '@/app/ui/SectionCard';
import { platforms, cx } from '@/app/lib/platforms';
import type { Account, PlatformKey } from '@/app/lib/types';

export default function AccountsView({ accounts, refresh }: { accounts: Account[]; refresh: () => Promise<void> }) {
    const { t } = useI18n();
    return (
        <SectionCard title={t('accounts')}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {platforms.map(p => {
                    const acc = accounts.find(a => a.platform === (p.key as PlatformKey));
                    const connected = acc?.connected ?? false;
                    return (
                        <div key={p.key} className="rounded-2xl border p-4 bg-white">
                            <div className="flex items-center gap-2">
                                <span className={cx('w-2 h-2 rounded-full', connected ? 'bg-emerald-500' : 'bg-gray-300')}></span>
                                <p.icon className="w-4 h-4" />
                                <div className="font-medium">{p.name}</div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{t('status')}: {connected ? t('connected') : t('disconnected')}</div>
                            <div className="mt-3 flex gap-2">
                                <Link
                                    href={`/accounts/${p.key}`}
                                    className="px-3 py-2 rounded-xl bg-gray-100 text-sm inline-flex items-center justify-center"
                                >
                                    {t('detail')}
                                </Link>

                                {connected ? (
                                    <button
                                        className="px-3 py-2 rounded-xl bg-white border text-sm"
                                        onClick={async () => {
                                            try {
                                                const { AccountsAPI } = await import('@/app/lib/api');
                                                await AccountsAPI.revoke(p.key as PlatformKey);
                                                await refresh();
                                            } catch (e) {
                                                alert(String(e));
                                            }
                                        }}
                                    >
                                        {t('disconnect')}
                                    </button>
                                ) : (
                                    <button
                                        className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm"
                                        onClick={async () => {
                                            try {
                                                const { AccountsAPI } = await import('@/app/lib/api');
                                                await AccountsAPI.authorize(p.key as PlatformKey);
                                            } catch (e) {
                                                alert(String(e));
                                            }
                                        }}
                                    >
                                        {t('connect')}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </SectionCard>
    );
}
