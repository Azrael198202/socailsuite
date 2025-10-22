'use client';
import React, { useState } from 'react';
import { useI18n } from '@/app/lib/i18n';
import SectionCard from '@/app/ui/SectionCard';
import { platforms, cx } from '@/app/lib/platforms';
import { ScheduleAPI } from '@/app/lib/api';
import type { PlatformKey, ScheduledItem } from '@/app/lib/types';
import PlatformChip from '@/app/ui/PlatformChip';

export default function UploadPanel({ onCreated }: { onCreated: (item: ScheduledItem) => void }) {
    const { t } = useI18n();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [tags, setTags] = useState('');
    const [date, setDate] = useState<string>(new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16));

    const [platState, setPlatState] = useState<Record<PlatformKey, boolean>>({ youtube: true, tiktok: false, instagram: false, x: false, facebook: false, linkedin: false });
    
    const canSchedule = title.trim().length > 0 && Object.values(platState).some(Boolean);

    return (
        <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 xl:col-span-8 flex flex-col gap-5">
                <SectionCard title={t('file')}>
                    <div className="rounded-2xl border-2 border-dashed grid place-content-center h-48 bg-white/50">
                        <div className="text-center">
                            <div className="text-sm text-gray-600">Drag & drop or click to select</div>
                            <div className="text-xs text-gray-400 mt-1">MP4 / MOV / WEBM (≤ 1GB)</div>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title={t('meta')}>
                    <div className="space-y-3">
                        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-xl border p-3 text-sm" placeholder={t('titlePh')} />
                        <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full rounded-xl border p-3 text-sm h-28" placeholder={t('descPh')} />
                        <input value={tags} onChange={e => setTags(e.target.value)} className="w-full rounded-xl border p-3 text-sm" placeholder={t('tagsPh')} />
                    </div>
                </SectionCard>
            </div>

            <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
                <SectionCard title={t('targets')}>
                    <div className="grid grid-cols-2 gap-2">
                        {platforms.map(p => (
                            <PlatformChip
                                key={p.key}
                                asButton
                                active={platState[p.key as PlatformKey]}
                                onClick={() => setPlatState(s => ({ ...s, [p.key]: !s[p.key as PlatformKey] }))}
                                name={p.name}
                                Icon={p.icon}
                                colorClass={p.color}
                            />
                        ))}
                    </div>
                </SectionCard>

                <SectionCard title={t('schedule')}>
                    <div className="space-y-3">
                        <label className="text-sm text-gray-600">{t('publishAt')}</label>
                        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border p-2 text-sm" />
                        <button
                            disabled={!canSchedule}
                            onClick={async () => {
                                try {
                                    const first = (Object.entries(platState).find(([_, v]) => v)![0]) as PlatformKey;
                                    const created = await ScheduleAPI.create({ title: title || 'Untitled', date: date.slice(0, 10), platform: first, description: desc, tags });
                                    onCreated(created);
                                    alert('OK: created on server');
                                } catch {
                                    const id = Math.random().toString(36).slice(2);
                                    const first = (Object.keys(platState).find(k => (platState as any)[k]) as PlatformKey) || 'youtube';
                                    onCreated({ id, title: title || 'Untitled', date: date.slice(0, 10), platform: first });
                                    alert('Fallback: created locally.');
                                }
                            }}
                            className={cx('w-full px-3 py-2 rounded-xl text-white', canSchedule ? 'bg-gray-900' : 'bg-gray-300 cursor-not-allowed')}
                        >
                            {t('addToSchedule')}
                        </button>
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}
