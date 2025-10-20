'use client';
import React, { useMemo } from 'react';
import { useI18n } from '@/app/lib/i18n';
import SectionCard from '@/app/ui/SectionCard';
import { cx } from '@/app/lib/platforms';
import type { ScheduledItem } from '@/app/lib/types';

export default function CalendarView({ items, onDelete }: { items: ScheduledItem[]; onDelete: (id: string) => void }) {
    const { t } = useI18n();
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = useMemo(() => {
        const arr: { date?: number; iso?: string }[] = [];
        for (let i = 0; i < startDay; i++) arr.push({});
        for (let d = 1; d <= daysInMonth; d++) {
            const iso = new Date(year, month, d).toISOString().slice(0, 10);
            arr.push({ date: d, iso });
        }
        return arr;
    }, [year, month, startDay, daysInMonth]);

    return (
        <SectionCard title={t('calendarTitle')}>
            <div className="grid grid-cols-7 gap-2">
                {['日', '月', '火', '水', '木', '金', '土'].map((w) => (<div key={w} className="text-xs text-gray-500 px-2">{w}</div>))}
                {cells.map((c, idx) => (
                    <div key={idx} className={cx('min-h-28 rounded-2xl border p-2 bg-white', c.date ? '' : 'bg-gray-50')}>
                        {c.date && (
                            <div>
                                <div className="text-xs text-gray-500 mb-2">{c.date}</div>
                                <div className="space-y-1">
                                    {items.filter(i => i.date === c.iso).map(i => (
                                        <div key={i.id} className="text-xs px-2 py-1 rounded-lg border flex items-center justify-between">
                                            <span className="truncate mr-2">{i.title}</span>
                                            <button onClick={() => onDelete(i.id)} className="text-gray-400 hover:text-gray-600">×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}
