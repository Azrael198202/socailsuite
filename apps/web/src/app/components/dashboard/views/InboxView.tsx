'use client';
import React from 'react';
import { useI18n } from '@/app/lib/i18n';
import SectionCard from '@/app/ui/SectionCard';

export default function InboxView() {
    const { t } = useI18n();
    const inboxSamples = [
        { id: 1, user: '@hana', platform: 'Instagram', text: '素敵な動画でした！', ts: '10:12' },
        { id: 2, user: '@techguy', platform: 'YouTube', text: '字幕つけてもらえると助かります', ts: '09:55' },
        { id: 3, user: '@mika', platform: 'TikTok', text: '次は福岡のグルメ紹介して！', ts: '昨日' },
    ];
    return (
        <SectionCard title={t('inbox')}>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-5">
                    <div className="rounded-2xl border bg-white">
                        {inboxSamples.map(m => (
                            <div key={m.id} className="px-4 py-3 border-b last:border-b-0">
                                <div className="text-sm font-medium">{m.user} <span className="text-xs text-gray-500">({m.platform})</span></div>
                                <div className="text-sm text-gray-700">{m.text}</div>
                                <div className="text-xs text-gray-400 mt-1">{m.ts}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-12 md:col-span-7">
                    <div className="rounded-2xl border bg-white p-4 h-full">
                        <div className="text-sm text-gray-500 mb-2">{t('reply')}</div>
                        <textarea className="w-full h-40 rounded-xl border p-3 focus:outline-none" placeholder="..." />
                        <div className="mt-2 flex gap-2 justify-end">
                            <button className="px-3 py-2 rounded-xl bg-gray-100">{t('draft')}</button>
                            <button className="px-3 py-2 rounded-xl bg-gray-900 text-white">{t('send')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
