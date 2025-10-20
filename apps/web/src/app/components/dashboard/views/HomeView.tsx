'use client';
import React from 'react';
import { useI18n } from '@/app/lib/i18n';
import SectionCard from '@/app/ui/SectionCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { MessageSquare, ChevronRight, Clock } from 'lucide-react';
import { platforms } from '@/app/lib/platforms';
import type { ScheduledItem } from '@/app/lib/types';

type KPI = { label: string; value: string; delta: string };

export default function HomeView({ kpis, scheduled }: { kpis: KPI[]; scheduled: ScheduledItem[] }) {
    const { t } = useI18n();

    const chartData = [
        { day: 'Mon', views: 2200, likes: 140 },
        { day: 'Tue', views: 3200, likes: 210 },
        { day: 'Wed', views: 2800, likes: 180 },
        { day: 'Thu', views: 4500, likes: 320 },
        { day: 'Fri', views: 5100, likes: 350 },
        { day: 'Sat', views: 3900, likes: 250 },
        { day: 'Sun', views: 6100, likes: 410 },
    ];

    const inboxSamples = [
        { id: 1, user: '@hana', platform: 'Instagram', text: '素敵な動画でした！', ts: '10:12' },
        { id: 2, user: '@techguy', platform: 'YouTube', text: '字幕つけてもらえると助かります', ts: '09:55' },
        { id: 3, user: '@mika', platform: 'TikTok', text: '次は福岡のグルメ紹介して！', ts: '昨日' },
    ];

    return (
        <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 xl:col-span-8 flex flex-col gap-5">
                <SectionCard title={t('kpi')}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {kpis.map(k => (
                            <div key={k.label} className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
                                <div className="text-xs text-gray-500">{k.label}</div>
                                <div className="text-2xl font-semibold mt-1">{k.value}</div>
                                <div className="text-xs text-emerald-600 mt-1">{k.delta}</div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard title={t('trend')}>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="views" strokeWidth={2} />
                                <Line type="monotone" dataKey="likes" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </SectionCard>
            </div>

            <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
                <SectionCard title={t('recent')}>
                    <ul className="space-y-3">
                        {scheduled.slice(0, 4).map(i => (
                            <li key={i.id} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 grid place-content-center"><Clock className="w-4 h-4" /></div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium">{i.title}</div>
                                    <div className="text-xs text-gray-500">{i.date} ・ {platforms.find(p => p.key === i.platform)?.name}</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </li>
                        ))}
                    </ul>
                </SectionCard>

                <SectionCard title={t('inbox_todo')}>
                    <ul className="space-y-3">
                        {inboxSamples.map(m => (
                            <li key={m.id} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 grid place-content-center"><MessageSquare className="w-4 h-4" /></div>
                                <div className="flex-1">
                                    <div className="text-sm"><span className="font-medium">{m.user}</span> ・ <span className="text-gray-500 text-xs">{m.platform}</span></div>
                                    <div className="text-xs text-gray-600 line-clamp-1">{m.text}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </SectionCard>
            </div>
        </div>
    );
}
