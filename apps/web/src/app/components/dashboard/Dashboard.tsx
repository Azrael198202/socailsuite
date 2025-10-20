'use client';
import React from 'react';
import { I18nProvider } from '@/app/lib/i18n/index'
import DashboardInner from './DashboardInner';

export type TabKey = 'home' | 'upload' | 'calendar' | 'analytics' | 'inbox' | 'accounts' | 'settings';

export default function Dashboard({ initialTab = 'home' as TabKey }) {
  return (
    <I18nProvider>
      <DashboardInner initialTab={initialTab} />
    </I18nProvider>
  );
}
