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
  handle: string; 
  displayName: string; 
  avatarUrl?: string;
  scopes: string[];
  createdAt: string;
  expiresAt?: string;
  status: 'active'|'expired'|'revoked';
  isDefault?: boolean;
};