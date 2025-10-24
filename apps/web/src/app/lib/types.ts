export type PlatformKey = 'youtube' | 'tiktok' | 'instagram' | 'x' | 'facebook' | 'linkedin';

export type Account = {
  platform: PlatformKey;
  name: string;
  connected: boolean;
  avatarUrl?: string;
  exists?: boolean;
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
  scopes: string[];
  handle: string;
  access_token?: string;
  refresh_token?: string;
  connected: boolean;
  isDefault: boolean;
  externalId?: string;
  avatarUrl?: string;
  createdAt: string;
  status: 'active' | 'expired' | 'revoked';  
};