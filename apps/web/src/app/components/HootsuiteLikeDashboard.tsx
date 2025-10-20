"use client"

import React, { useEffect, useMemo, useState, useCallback, createContext, useContext } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Upload,
  Calendar,
  LineChart as LineChartIcon,
  MessageSquare,
  Settings,
  Youtube,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Music2 as TiktokIcon,
  Plus,
  Bell,
  Search,
  ChevronRight,
  CheckCircle2,
  Clock,
  PlayCircle,
  Eye,
  BarChart3,
  Users
} from "lucide-react";
import { SiTiktok as TiktokIcon2 } from "react-icons/si";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

/* =========================================================
   🔤 Minimal i18n (JA/EN/ZH) + Hook
   - t(key): string
   - setLang('ja'|'en'|'zh')
   ========================================================= */
 type Lang = 'ja' | 'en' | 'zh';
 const I18nCtx = createContext<{ t: (k:string)=>string; lang: Lang; setLang: (l:Lang)=>void }>({ t: (k)=>k, lang: 'ja', setLang: ()=>{} });
 const dict: Record<Lang, Record<string, string>> = {
  ja: {
    brand: 'SocialOps Studio', menu: 'メニュー', dashboard: 'ダッシュボード', upload: 'アップロード', calendar: 'カレンダー', analytics: 'アナリティクス', inbox: '受信箱', accounts: 'アカウント', settings:'設定',
    searchPh: '検索… (投稿/コメント/アカウント)', newPost: '新規投稿', platforms: 'プラットフォーム', kpi: 'KPI 概要', trend: '再生数 / いいね 推移', recent: '最近の予定', inbox_todo: '受信箱（要対応）', bestVideos: 'ベスト動画', memo: 'メモ', memoText:'TikTokは18-22時、YouTubeは19-21時がやや伸びる傾向。',
    file: '動画ファイル', meta: 'メタ情報', titlePh: 'タイトル', descPh:'説明文…', tagsPh:'#タグ をカンマ区切りで', targets: '投稿先', schedule: 'スケジュール', publishAt: '公開日時', addToSchedule: 'スケジュールに追加', draft:'下書き', send:'送信', status:'状態', connected:'接続済み', disconnected:'未接続', detail:'詳細', connect:'接続', disconnect:'切断', calendarTitle:'カレンダー', reply:'返信', lang:'言語',
    kpi_views:'総再生数', kpi_posts:'投稿数', kpi_followers:'フォロワー増', kpi_eng:'エンゲージ率', platformViews:'プラットフォーム別 再生数',
    oauthConnect:'認可へ', oauthRevoke:'トークン失効',
  },
  en: {
    brand: 'SocialOps Studio', menu: 'Menu', dashboard: 'Dashboard', upload: 'Upload', calendar: 'Calendar', analytics: 'Analytics', inbox: 'Inbox', accounts: 'Accounts', settings:'Settings',
    searchPh: 'Search… (posts/comments/accounts)', newPost: 'New Post', platforms: 'Platforms', kpi: 'KPI Overview', trend: 'Views / Likes Trend', recent: 'Upcoming', inbox_todo: 'Inbox (To‑do)', bestVideos: 'Top Videos', memo: 'Notes', memoText:'TikTok 18–22, YouTube 19–21 tends to perform better.',
    file: 'Video file', meta: 'Meta', titlePh: 'Title', descPh:'Description…', tagsPh:'#tags comma separated', targets: 'Targets', schedule: 'Schedule', publishAt: 'Publish at', addToSchedule: 'Add to schedule', draft:'Draft', send:'Send', status:'Status', connected:'Connected', disconnected:'Disconnected', detail:'Detail', connect:'Connect', disconnect:'Disconnect', calendarTitle:'Calendar', reply:'Reply', lang:'Language',
    kpi_views:'Total views', kpi_posts:'Posts', kpi_followers:'New followers', kpi_eng:'Engagement', platformViews:'Views by platform',
    oauthConnect:'Authorize', oauthRevoke:'Revoke',
  },
  zh: {
    brand: 'SocialOps Studio', menu: '菜单', dashboard: '总览', upload: '上传', calendar: '日历', analytics: '分析', inbox: '收件箱', accounts: '账号', settings:'设置',
    searchPh: '搜索…（帖子/评论/账号）', newPost: '新建发布', platforms: '平台', kpi: 'KPI 概览', trend: '播放/点赞趋势', recent: '最近计划', inbox_todo: '收件箱（待处理）', bestVideos: '热门视频', memo: '备注', memoText:'TikTok 18–22 点、YouTube 19–21 点表现更好。',
    file: '视频文件', meta: '元信息', titlePh: '标题', descPh:'描述…', tagsPh:'#标签 以逗号分隔', targets: '投放平台', schedule: '排程', publishAt: '发布时间', addToSchedule: '加入排程', draft:'草稿', send:'发送', status:'状态', connected:'已连接', disconnected:'未连接', detail:'详情', connect:'连接', disconnect:'断开', calendarTitle:'日历', reply:'回复', lang:'语言',
    kpi_views:'总播放', kpi_posts:'发布数', kpi_followers:'增粉', kpi_eng:'互动率', platformViews:'平台播放对比',
    oauthConnect:'去授权', oauthRevoke:'吊销',
  }
};
function I18nProvider({children}:{children:React.ReactNode}){
  const [lang, setLang] = useState<Lang>('ja');
  const t = useCallback((k:string)=> dict[lang][k] ?? k, [lang]);
  return <I18nCtx.Provider value={{ t, lang, setLang }}>{children}</I18nCtx.Provider>;
}
function useI18n(){ return useContext(I18nCtx); }

/* =========================================================
   🔌 Quarkus API Client (DTO/Endpoints)
   Back-end assumptions:
   - GET    /api/accounts
   - POST   /api/oauth/{platform}/authorize -> { url }
   - POST   /api/oauth/{platform}/revoke    -> { ok:true }
   - GET    /api/schedule
   - POST   /api/schedule
   - DELETE /api/schedule/{id}
   ========================================================= */
 const API_BASE = (typeof window !== 'undefined' && (window as any).__API_BASE__) || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';
 type PlatformKey = 'youtube'|'tiktok'|'instagram'|'x'|'facebook'|'linkedin';
 type Account = { platform: PlatformKey; name: string; connected: boolean; avatarUrl?: string };
 type ScheduledItem = { id: string; title: string; date: string; platform: PlatformKey };
 async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`, {
    method: init?.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(init?.headers||{}) },
    ...(init||{}),
    cache: 'no-store'
  });
  if(!r.ok){ throw new Error(`${r.status} ${r.statusText}: ${await r.text().catch(()=> '')}`); }
  return (await r.json()) as T;
 }
 const AccountsAPI = {
  list: () => api<Account[]>(`/api/accounts`),
  authorize: async (platform: PlatformKey) => {
    const { url } = await api<{url:string}>(`/api/oauth/${platform}/authorize`, { method:'POST' });
    window.location.href = url; // redirect to provider
  },
  revoke: (platform: PlatformKey) => api<{ok:boolean}>(`/api/oauth/${platform}/revoke`, { method:'POST' })
 };
 const ScheduleAPI = {
  list: () => api<ScheduledItem[]>(`/api/schedule`),
  create: (payload: Omit<ScheduledItem,'id'> & { description?:string; tags?:string }) => api<ScheduledItem>(`/api/schedule`, { method:'POST', body: JSON.stringify(payload) }),
  remove: (id: string) => api<{ok:boolean}>(`/api/schedule/${id}`, { method:'DELETE' })
 };

/* =========================================================
   🎛️ UI Helpers & Data
   ========================================================= */
const platforms = [
  { key: "youtube", name: "YouTube", icon: Youtube, color: "bg-red-500" },
  { key: "tiktok", name: "TikTok", icon: TiktokIcon2, color: "bg-neutral-900" },
  { key: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-500" },
  { key: "x", name: "X", icon: Twitter, color: "bg-slate-800" },
  { key: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
  { key: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-sky-700" },
] as const;
function classNames(...s: Array<string | false | null | undefined>) { return s.filter(Boolean).join(" "); }
const SectionCard: React.FC<React.PropsWithChildren<{ title: string; right?: React.ReactNode }>> = ({ title, right, children }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="rounded-2xl bg-white shadow-sm p-5 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {right}
    </div>
    {children}
  </motion.div>
);
const SidebarItem: React.FC<{ icon: React.ElementType; label: string; active?: boolean; onClick?: () => void }>
= ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={classNames("w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition", active ? "bg-gray-900 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100")}>
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

/* =========================================================
   ⭐ Exported Component
   ========================================================= */
export default function HootsuiteLikeDashboard() {
  return (
    <I18nProvider>
      <DashboardInner />
    </I18nProvider>
  );
}

function DashboardInner(){
  const { t, lang, setLang } = useI18n();
  const [tab, setTab] = useState<"home" | "upload" | "calendar" | "analytics" | "inbox" | "accounts" | "settings">("home");
  const [kpis] = useState([
    { label: t('kpi_views'), value: "128,430", delta: "+12%" },
    { label: t('kpi_posts'), value: "42", delta: "+5%" },
    { label: t('kpi_followers'), value: "+1,245", delta: "+9%" },
    { label: t('kpi_eng'), value: "3.8%", delta: "+0.4%" },
  ]);
  const chartData = [
    { day: "Mon", views: 2200, likes: 140 },
    { day: "Tue", views: 3200, likes: 210 },
    { day: "Wed", views: 2800, likes: 180 },
    { day: "Thu", views: 4500, likes: 320 },
    { day: "Fri", views: 5100, likes: 350 },
    { day: "Sat", views: 3900, likes: 250 },
    { day: "Sun", views: 6100, likes: 410 },
  ];

  // Accounts & Schedule (from Quarkus)
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledItem[]>([]);
  useEffect(()=>{ (async ()=>{
    try { setAccounts(await AccountsAPI.list()); } catch { setAccounts(platforms.map(p=>({ platform: p.key as PlatformKey, name: p.name, connected: ['youtube','tiktok','instagram'].includes(p.key as string) })) as Account[]); }
    try { setScheduled(await ScheduleAPI.list()); } catch { setScheduled([{ id:'1', title:'福岡 香椎イベントVlog', date: new Date().toISOString().slice(0,10), platform:'youtube' }, { id:'2', title:'屋台グルメ15秒', date: addDaysISO(2), platform:'tiktok' }]); }
  })(); },[]);

  const inboxSamples = [
    { id: 1, user: "@hana", platform: "Instagram", text: "素敵な動画でした！", ts: "10:12" },
    { id: 2, user: "@techguy", platform: "YouTube", text: "字幕つけてもらえると助かります", ts: "09:55" },
    { id: 3, user: "@mika", platform: "TikTok", text: "次は福岡のグルメ紹介して！", ts: "昨日" },
  ];

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
            {/* Language switcher */}
            <div className="relative">
              <select aria-label={t('lang')} value={lang} onChange={(e)=> setLang(e.target.value as Lang)} className="px-2 py-2 rounded-xl border bg-white text-sm">
                <option value="ja">日本語</option>
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </div>
            <button className="p-2 rounded-xl hover:bg-gray-100"><Bell className="w-5 h-5"/></button>
            <button className="p-2 rounded-xl hover:bg-gray-100"><Users className="w-5 h-5"/></button>
            <button className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm flex items-center gap-2" onClick={() => setTab("upload")}>
              <Plus className="w-4 h-4"/> {t('newPost')}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-5">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 flex flex-col gap-3">
          <SectionCard title={t('menu')}>
            <div className="flex flex-col gap-1">
              <SidebarItem icon={Home} label={t('dashboard')} active={tab === "home"} onClick={() => setTab("home")} />
              <SidebarItem icon={Upload} label={t('upload')} active={tab === "upload"} onClick={() => setTab("upload")} />
              <SidebarItem icon={Calendar} label={t('calendar')} active={tab === "calendar"} onClick={() => setTab("calendar")} />
              <SidebarItem icon={LineChartIcon} label={t('analytics')} active={tab === "analytics"} onClick={() => setTab("analytics")} />
              <SidebarItem icon={MessageSquare} label={t('inbox')} active={tab === "inbox"} onClick={() => setTab("inbox")} />
              <SidebarItem icon={Settings} label={t('accounts')} active={tab === "accounts"} onClick={() => setTab("accounts")} />
            </div>
          </SectionCard>

          <SectionCard title={t('platforms')}>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map(p => (
                <div key={p.key} className="flex items-center gap-2 rounded-xl border px-2 py-2 text-xs border-gray-200">
                  <span className={classNames("w-4 h-4 rounded", p.color)}></span>
                  <p.icon className="w-3.5 h-3.5" />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 flex flex-col gap-5">
          {tab === 'home' && (
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 xl:col-span-8 flex flex-col gap-5">
                <SectionCard title={t('kpi')}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {kpis.map((k) => (
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
                        <div className="w-10 h-10 rounded-xl bg-gray-100 grid place-content-center"><Clock className="w-4 h-4"/></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{i.title}</div>
                          <div className="text-xs text-gray-500">{i.date} ・ {platforms.find(p=>p.key===i.platform)?.name}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400"/>
                      </li>
                    ))}
                  </ul>
                </SectionCard>
                <SectionCard title={t('inbox_todo')}>
                  <ul className="space-y-3">
                    {inboxSamples.map(m => (
                      <li key={m.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 grid place-content-center"><MessageSquare className="w-4 h-4"/></div>
                        <div className="flex-1">
                          <div className="text-sm"><span className="font-medium">{m.user}</span> ・ <span className="text-gray-500 text-xs">{m.platform}</span></div>
                          <div className="text-xs text-gray-600 line-clamp-1">{m.text}</div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500"/>
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              </div>
            </div>
          )}

          {tab === 'upload' && <UploadPanel onCreated={(it)=> setScheduled((s)=> [it, ...s])} />}

          {tab === 'calendar' && (
            <SectionCard title={t('calendarTitle')}>
              <CalendarMonth items={scheduled} onDelete={async (id)=> { try { await ScheduleAPI.remove(id); } catch{}; setScheduled((s)=> s.filter(x=> x.id!==id)); }} />
            </SectionCard>
          )}

          {tab === 'analytics' && (
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 xl:col-span-7">
                <SectionCard title={t('platformViews')}>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={platforms.map((p,i)=>({ name:p.name, views: 2000 + i*1200 }))}>
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
                    {[1,2,3].map(i=> (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-14 h-10 bg-gray-200 rounded-xl grid place-content-center"><PlayCircle className="w-5 h-5"/></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">香椎花火ダイジェスト {i}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-3"><Eye className="w-3.5 h-3.5"/> {4200 * i} views</div>
                        </div>
                        <BarChart3 className="w-4 h-4 text-gray-400"/>
                      </li>
                    ))}
                  </ul>
                </SectionCard>
                <SectionCard title={t('memo')}>
                  <div className="text-sm text-gray-600">{t('memoText')}</div>
                </SectionCard>
              </div>
            </div>
          )}

          {tab === 'inbox' && (
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
          )}

          {tab === 'accounts' && (
            <SectionCard title={t('accounts')}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {platforms.map(p => {
                  const acc = accounts.find(a=> a.platform === (p.key as PlatformKey));
                  const connected = acc?.connected ?? false;
                  return (
                    <div key={p.key} className="rounded-2xl border p-4 bg-white">
                      <div className="flex items-center gap-2">
                        <span className={classNames("w-2 h-2 rounded-full", connected ? "bg-emerald-500" : "bg-gray-300")}></span>
                        <p.icon className="w-4 h-4"/>
                        <div className="font-medium">{p.name}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{t('status')}: {connected ? t('connected') : t('disconnected')}</div>
                      <div className="mt-3 flex gap-2">
                        <button className="px-3 py-2 rounded-xl bg-gray-100 text-sm">{t('detail')}</button>
                        {connected ? (
                          <button className="px-3 py-2 rounded-xl bg-white border text-sm" onClick={async()=> { try{ await AccountsAPI.revoke(p.key as PlatformKey); setAccounts(await AccountsAPI.list()); } catch(e){ alert(String(e)); } }}>{t('disconnect')}</button>
                        ) : (
                          <button className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm" onClick={async()=> { try{ await AccountsAPI.authorize(p.key as PlatformKey); } catch(e){ alert(String(e)); } }}>{t('connect')}</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {tab === 'settings' && (
            <SectionCard title={t('settings')}>
              <div className="text-sm text-gray-600">OpenID Connect / OAuth2、通知、ワークフローなどの設定。</div>
            </SectionCard>
          )}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   ⬆ UploadPanel: creates schedule via Quarkus
   ========================================================= */
function UploadPanel({ onCreated }: { onCreated: (item: ScheduledItem) => void }) {
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState<string>(new Date(Date.now() + 60*60*1000).toISOString().slice(0,16));
  const [platState, setPlatState] = useState<Record<PlatformKey, boolean>>({ youtube: true, tiktok: true, instagram: false, x:false, facebook:false, linkedin:false });
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
            <input value={title} onChange={e=> setTitle(e.target.value)} className="w-full rounded-xl border p-3 text-sm" placeholder={t('titlePh')} />
            <textarea value={desc} onChange={e=> setDesc(e.target.value)} className="w-full rounded-xl border p-3 text-sm h-28" placeholder={t('descPh')} />
            <input value={tags} onChange={e=> setTags(e.target.value)} className="w-full rounded-xl border p-3 text-sm" placeholder={t('tagsPh')} />
          </div>
        </SectionCard>
      </div>
      <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
        <SectionCard title={t('targets')}>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map(p => (
              <button key={p.key as string}
                onClick={()=> setPlatState(s=> ({...s, [p.key]: !s[p.key as PlatformKey]}))}
                className={classNames("flex items-center gap-2 rounded-xl border px-2 py-2 text-xs", platState[p.key as PlatformKey] ? "border-gray-900" : "border-gray-200")}
              >
                <span className={classNames("w-4 h-4 rounded", p.color)}></span>
                <p.icon className="w-3.5 h-3.5"/>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={t('schedule')}>
          <div className="space-y-3">
            <label className="text-sm text-gray-600">{t('publishAt')}</label>
            <input type="datetime-local" value={date} onChange={(e)=> setDate(e.target.value)} className="w-full rounded-xl border p-2 text-sm" />
            <button
              disabled={!canSchedule}
              onClick={async ()=> {
                try{
                  const first = (Object.entries(platState).find(([_,v])=> v)![0]) as PlatformKey;
                  const created = await ScheduleAPI.create({ title: title || 'Untitled', date: date.slice(0,10), platform: first, description: desc, tags });
                  onCreated(created);
                  alert('OK: created on server');
                }catch(e){
                  const id = Math.random().toString(36).slice(2);
                  onCreated({ id, title: title || 'Untitled', date: date.slice(0,10), platform: (Object.keys(platState).find(k=> (platState as any)[k]) as PlatformKey) || 'youtube' });
                  alert('Fallback: created locally.');
                }
              }}
              className={classNames("w-full px-3 py-2 rounded-xl text-white", canSchedule ? "bg-gray-900" : "bg-gray-300 cursor-not-allowed")}
            >
              {t('addToSchedule')}
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* =========================================================
   📅 Calendar month
   ========================================================= */
function CalendarMonth({ items, onDelete }: { items: ScheduledItem[]; onDelete: (id:string)=>void }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = useMemo(()=>{
    const arr: { date?: number; iso?: string }[] = [];
    for (let i=0;i<startDay;i++) arr.push({});
    for (let d=1; d<=daysInMonth; d++) {
      const iso = new Date(year, month, d).toISOString().slice(0,10);
      arr.push({ date: d, iso });
    }
    return arr;
  }, [year, month, startDay, daysInMonth]);

  return (
    <div className="grid grid-cols-7 gap-2">
      {['日','月','火','水','木','金','土'].map((w)=> (
        <div key={w} className="text-xs text-gray-500 px-2">{w}</div>
      ))}
      {cells.map((c, idx)=> (
        <div key={idx} className={classNames("min-h-28 rounded-2xl border p-2 bg-white", c.date ? "" : "bg-gray-50") }>
          {c.date && (
            <div>
              <div className="text-xs text-gray-500 mb-2">{c.date}</div>
              <div className="space-y-1">
                {items.filter(i=> i.date === c.iso).map(i=> (
                  <div key={i.id} className="text-xs px-2 py-1 rounded-lg border flex items-center justify-between">
                    <span className="truncate mr-2">{i.title}</span>
                    <button onClick={()=> onDelete(i.id)} className="text-gray-400 hover:text-gray-600">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ========================================================= */
function addDaysISO(days: number) { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0,10); }
