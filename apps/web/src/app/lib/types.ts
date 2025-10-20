export type PlatformKey = 'youtube' | 'tiktok' | 'instagram' | 'x' | 'facebook' | 'linkedin';
export type Account = { platform: PlatformKey; name: string; connected: boolean; avatarUrl?: string };
export type ScheduledItem = { id: string; title: string; date: string; platform: PlatformKey };