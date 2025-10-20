'use client';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Bell, Plus, Search, Users, Home as HomeIcon, Upload as UploadIcon,
    Calendar as CalendarIcon, LineChart as LineChartIcon,
    MessageSquare, Settings, ChevronRight, Clock
} from 'lucide-react';
import { useI18n } from '@/app/lib/i18n/index'
import { AccountsAPI, ScheduleAPI } from '../../lib/api';
import { platforms, cx } from '../../lib/platforms';
import type { Account, PlatformKey, ScheduledItem } from '../../lib/types';

import SectionCard from '@/app/ui/SectionCard';
import SidebarItem from '@/app/ui/SidebarItem';

import HomeView from './views/HomeView';
import UploadPanel from './views/UploadPanel';
import CalendarView from './views/CalendarView';
import AnalyticsView from './views/AnalyticsView';
import InboxView from './views/InboxView';
import AccountsView from './views/AccountsView';
import { addDaysISO } from '../../utils/date';
import type { TabKey } from './Dashboard';
import PlatformChip from '@/app/ui/PlatformChip';

export default function DashboardInner({ initialTab }: { initialTab: TabKey }) {
    const { t, lang, setLang } = useI18n();

    const [tab, setTab] = useState<TabKey>(initialTab);

    const [kpis] = useState([
        { label: t('kpi_views'), value: '128,430', delta: '+12%' },
        { label: t('kpi_posts'), value: '42', delta: '+5%' },
        { label: t('kpi_followers'), value: '+1,245', delta: '+9%' },
        { label: t('kpi_eng'), value: '3.8%', delta: '+0.4%' },
    ]);

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [scheduled, setScheduled] = useState<ScheduledItem[]>([]);

    useEffect(() => {
        (async () => {
            try {
                setAccounts(await AccountsAPI.list());
            } catch {
                setAccounts(platforms.map(p => ({
                    platform: p.key as PlatformKey,
                    name: p.name,
                    connected: ['youtube', 'tiktok', 'instagram'].includes(p.key as string),
                })) as Account[]);
            }

            try {
                setScheduled(await ScheduleAPI.list());
            } catch {
                setScheduled([
                    { id: '1', title: '福岡 香椎イベントVlog', date: new Date().toISOString().slice(0, 10), platform: 'youtube' },
                    { id: '2', title: '屋台グルメ15秒', date: addDaysISO(2), platform: 'tiktok' },
                ]);
            }
        })();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Topbar */}
            <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <div className="w-8 h-8 rounded-xl bg-gray-900 text-white grid place-content-center">μ</div>
                        <span>{t('brand')}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border bg-gray-50">
                            <Search className="w-4 h-4 text-gray-500" />
                            <input className="bg-transparent text-sm focus:outline-none" placeholder={t('searchPh')} />
                        </div>
                        <select aria-label={t('lang')} value={lang} onChange={(e) => setLang(e.target.value as any)}
                            className="px-2 py-2 rounded-xl border bg-white text-sm">
                            <option value="ja">日本語</option>
                            <option value="en">English</option>
                            <option value="zh">中文</option>
                        </select>
                        <button className="p-2 rounded-xl hover:bg-gray-100"><Bell className="w-5 h-5" /></button>
                        <button className="p-2 rounded-xl hover:bg-gray-100"><Users className="w-5 h-5" /></button>
                        <button className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm flex items-center gap-2"
                            onClick={() => setTab('upload')}>
                            <Plus className="w-4 h-4" /> {t('newPost')}
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-16 gap-5">
                {/* Sidebar */}
                <aside className="col-span-12 md:col-span-3 lg:col-span-4 flex flex-col gap-3">
                    <SectionCard title={t('menu')}>
                        <div className="flex flex-col gap-1">
                            <SidebarItem icon={HomeIcon} label={t('dashboard')} active={tab === 'home'} onClick={() => setTab('home')} />
                            <SidebarItem icon={UploadIcon} label={t('upload')} active={tab === 'upload'} onClick={() => setTab('upload')} />
                            <SidebarItem icon={CalendarIcon} label={t('calendar')} active={tab === 'calendar'} onClick={() => setTab('calendar')} />
                            <SidebarItem icon={LineChartIcon} label={t('analytics')} active={tab === 'analytics'} onClick={() => setTab('analytics')} />
                            <SidebarItem icon={MessageSquare} label={t('inbox')} active={tab === 'inbox'} onClick={() => setTab('inbox')} />
                            <SidebarItem icon={Settings} label={t('accounts')} active={tab === 'accounts'} onClick={() => setTab('accounts')} />
                        </div>
                    </SectionCard>

                    <SectionCard title={t('platforms')}>
                        <div className="grid grid-cols-2 gap-2">
                            {platforms.map(p => (
                                <PlatformChip key={p.key} name={p.name} Icon={p.icon} colorClass={p.color} />
                            ))}
                        </div>
                    </SectionCard>
                </aside>

                {/* Main */}
                <main className="col-span-12 md:col-span-9 lg:col-span-12 flex flex-col gap-5">
                    {tab === 'home' && <HomeView kpis={kpis} scheduled={scheduled} />}
                    {tab === 'upload' && <UploadPanel onCreated={(it) => setScheduled(s => [it, ...s])} />}
                    {tab === 'calendar' && (
                        <CalendarView
                            items={scheduled}
                            onDelete={async (id) => { try { await ScheduleAPI.remove(id); } catch { }; setScheduled(s => s.filter(x => x.id !== id)); }}
                        />
                    )}
                    {tab === 'analytics' && <AnalyticsView />}
                    {tab === 'inbox' && <InboxView />}
                    {tab === 'accounts' && <AccountsView accounts={accounts} refresh={async () => setAccounts(await AccountsAPI.list())} />}
                </main>
            </div>
        </div>
    );
}
