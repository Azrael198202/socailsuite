'use client';
import React from 'react';
import { useI18n } from '@/app/lib/i18n';
import SectionCard from '@/app/ui/SectionCard';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { PlayCircle, BarChart3, Eye } from 'lucide-react';
import { platforms } from '@/app/lib/platforms';

export default function AnalyticsView() {
    const { t } = useI18n();
    return (
        <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 xl:col-span-7">
                <SectionCard title={t('platformViews')}>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={platforms.map((p, i) => ({ name: p.name, views: 2000 + i * 1200 }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="views" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </SectionCard>
            </div>
            <div className="col-span-12 xl:col-span-5 flex flex-col gap-5">
                <SectionCard title={t('bestVideos')}>
                    <ul className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="w-14 h-10 bg-gray-200 rounded-xl grid place-content-center"><PlayCircle className="w-5 h-5" /></div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium">香椎花火ダイジェスト {i}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-3"><Eye className="w-3.5 h-3.5" /> {4200 * i} views</div>
                                </div>
                                <BarChart3 className="w-4 h-4 text-gray-400" />
                            </li>
                        ))}
                    </ul>
                </SectionCard>
                <SectionCard title={t('memo')}>
                    <div className="text-sm text-gray-600">{t('memoText')}</div>
                </SectionCard>
            </div>
        </div>
    );
}
