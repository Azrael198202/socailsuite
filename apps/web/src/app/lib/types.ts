export type PlatformKey = 'youtube' | 'tiktok' | 'instagram' | 'x' | 'facebook' | 'linkedin';

export type Account = {
  platform: PlatformKey;
  name: string;
  connected: boolean;
  avatarUrl?: string;
};

export type ScheduledItem = {
  id: string;
  title: string;
  date: string;
  platform: PlatformKey;
};

export type PlatformAccount = {
  id: string; 
  platform: PlatformKey;
  name: string;
  handle: string;
  access_token?: string;
  refresh_token?: string;
  connected: boolean;
  isDefault: boolean;
  externalId?: string;
  avatarUrl?: string;
};