'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/app/lib/i18n';
import SectionCard from '@/app/ui/SectionCard';
import { cx } from '@/app/lib/platforms';
import type { ScheduledItem } from '@/app/lib/types';
import { ScheduleAPI } from '@/app/lib/api';

type ViewMode = 'month' | 'day';

export default function CalendarView({
    onDelete,
}: {
    onDelete: (id: string) => void;
}) {
    const { t } = useI18n();
    const router = useRouter();

    const [cursor, setCursor] = useState(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    });
    const [view, setView] = useState<ViewMode>('month');
    const [items, setItems] = useState<ScheduledItem[]>([]);
    const [loading, setLoading] = useState(false);

    const year = cursor.getFullYear();
    const month = cursor.getMonth();

    const monthStart = useMemo(() => new Date(year, month, 1), [year, month]);
    const monthEnd = useMemo(() => new Date(year, month + 1, 0), [year, month]);

    const dayISO = useMemo(
        () => cursor.toISOString().slice(0, 10),
        [cursor]
    );

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const from = monthStart.toISOString().slice(0, 10);
                const to = monthEnd.toISOString().slice(0, 10);
                const data = await ScheduleAPI.listRange(from, to);
                console.log('Fetched schedule items:', data);
                setItems(data);
            } catch {
                setItems([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [monthStart, monthEnd]);

    const cells = useMemo(() => {
        const first = new Date(year, month, 1);
        const startDay = first.getDay(); // 0..6
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const arr: { date?: number; iso?: string }[] = [];
        for (let i = 0; i < startDay; i++) arr.push({});
        for (let d = 1; d <= daysInMonth; d++) {
            const iso = new Date(year, month, d).toISOString().slice(0, 10);
            arr.push({ date: d, iso });
        }
        return arr;
    }, [year, month]);

    const dayItems = useMemo(
        () => items.filter((i) => i.date.slice(0, 10) === dayISO),
        [items, dayISO]
    );

    const Header = (
        <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="text-lg font-medium mr-auto">
                {year}年 {month + 1}月
            </div>

            <div className="flex items-center gap-2">
                <button
                    className="px-2 py-1 rounded-lg border bg-white"
                    onClick={() =>
                        setCursor((d) => {
                            const nd = new Date(d);
                            nd.setMonth(d.getMonth() - 1);
                            return nd;
                        })
                    }
                >
                    {t('prev') ?? '前の月'}
                </button>
                <button
                    className="px-2 py-1 rounded-lg border bg-white"
                    onClick={() => setCursor(new Date())}
                >
                    {t('today') ?? '今日'}
                </button>
                <button
                    className="px-2 py-1 rounded-lg border bg-white"
                    onClick={() =>
                        setCursor((d) => {
                            const nd = new Date(d);
                            nd.setMonth(d.getMonth() + 1);
                            return nd;
                        })
                    }
                >
                    {t('next') ?? '次の月'}
                </button>

                <div className="w-px h-6 bg-gray-200 mx-1" />

                <button
                    className={cx(
                        'px-2 py-1 rounded-lg border',
                        view === 'month' ? 'bg-gray-900 text-white' : 'bg-white'
                    )}
                    onClick={() => setView('month')}
                >
                    {t('month') ?? '月'}
                </button>
                <button
                    className={cx(
                        'px-2 py-1 rounded-lg border',
                        view === 'day' ? 'bg-gray-900 text-white' : 'bg-white'
                    )}
                    onClick={() => setView('day')}
                >
                    {t('day') ?? '日'}
                </button>
            </div>
        </div>
    );

    const chipClass = (status?: string) =>
        status === 'published'
            ? 'bg-gray-100 border-gray-200 text-gray-500' // 已发布：灰色
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'; // 未发布/待发布：绿色

    const openEditor = (id: string) => router.push(`/upload?id=${id}`);

    return (
        <SectionCard title={t('calendarTitle')}>
            {Header}

            {view === 'month' && (
                <>
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {['日', '月', '火', '水', '木', '金', '土'].map((w) => (
                            <div key={w} className="text-xs text-gray-500 px-2">
                                {w}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {cells.map((c, idx) => {
                            const dayList = c.iso ? items.filter((i) => i.date.slice(0, 10) === c.iso) : [];
                            console.log('Rendering cell for date:', c.iso, 'with items:', dayList);
                            return (
                                <div
                                    key={idx}
                                    className={cx(
                                        'min-h-28 rounded-2xl border p-2 bg-white',
                                        c.date ? '' : 'bg-gray-50'
                                    )}
                                >
                                    {c.date && (
                                        <div className="flex flex-col h-full">
                                            <div className="text-xs text-gray-500 mb-2 flex items-center justify-between">
                                                <span>{c.date}</span>
                                                <button
                                                    className="text-[11px] text-gray-400 hover:text-gray-600"
                                                    onClick={() =>
                                                        setCursor((d) => {
                                                            const nd = new Date(d);
                                                            nd.setFullYear(year, month, c.date!);
                                                            return nd;
                                                        })
                                                    }
                                                    onDoubleClick={() => setView('day')}
                                                    title="ダブルクリックで日表示へ"
                                                >
                                                    {t('viewDay') ?? '日表示'}
                                                </button>
                                            </div>

                                            <div className="space-y-1">
                                                {dayList.map((i) => (
                                                    <div
                                                        key={i.id}
                                                        onDoubleClick={() => openEditor(i.id)}
                                                        className={cx(
                                                            'text-xs px-2 py-1 rounded-lg border flex items-center justify-between cursor-default select-none',
                                                            chipClass((i as any).status)
                                                        )}
                                                        title="ダブルクリックで編集"
                                                    >
                                                        <span className="truncate mr-2">
                                                            {i.title ?? '(no title)'}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] opacity-60">
                                                                {i.platform?.toUpperCase?.()}
                                                            </span>
                                                            <button
                                                                onClick={() => onDelete(i.id)}
                                                                className="text-gray-400 hover:text-gray-600"
                                                                title="削除"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {loading && (
                                                    <div className="text-[11px] text-gray-400">…</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {view === 'day' && (
                <div className="rounded-2xl border p-3 bg-white">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {dayISO}（{['日', '月', '火', '水', '木', '金', '土'][cursor.getDay()]}）
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="px-2 py-1 rounded-lg border bg-white"
                                onClick={() =>
                                    setCursor((d) => {
                                        const nd = new Date(d);
                                        nd.setDate(d.getDate() - 1);
                                        return nd;
                                    })
                                }
                            >
                                ←
                            </button>
                            <button
                                className="px-2 py-1 rounded-lg border bg-white"
                                onClick={() =>
                                    setCursor((d) => {
                                        const nd = new Date(d);
                                        nd.setDate(d.getDate() + 1);
                                        return nd;
                                    })
                                }
                            >
                                →
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {dayItems.length === 0 && (
                            <div className="text-sm text-gray-500">予定はありません。</div>
                        )}

                        {dayItems.map((i) => (
                            <div
                                key={i.id}
                                onDoubleClick={() => openEditor(i.id)}
                                className={cx(
                                    'rounded-xl border p-2 flex items-center justify-between cursor-default',
                                    chipClass((i as any).status)
                                )}
                                title="ダブルクリックで編集"
                            >
                                <div className="min-w-0">
                                    <div className="text-sm truncate">{i.title ?? '(no title)'}</div>
                                    <div className="text-[11px] text-gray-500">
                                        {i.platform?.toUpperCase?.()} / {i.date}
                                    </div>
                                </div>
                                <button
                                    onClick={() => onDelete(i.id)}
                                    className="text-gray-400 hover:text-gray-600 ml-3"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </SectionCard>
    );
}
