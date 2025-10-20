'use client';
import React, { createContext, useCallback, useContext, useState } from "react";
import ja from "./ja";
import en from "./en";
import zh from "./zh";

export type Lang = 'ja' | 'en' | 'zh';
export type Messages = Record<string, string>;

const bundles: Record<Lang, Messages> = { ja, en, zh };

const I18nCtx = createContext<{
  t: (k: string) => string;
  lang: Lang;
  setLang: (l: Lang) => void;
}>({
  t: (k) => k,
  lang: 'ja',
  setLang: () => {}
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ja');
  const t = useCallback((k: string) => bundles[lang][k] ?? k, [lang]);
  return (
    <I18nCtx.Provider value={{ t, lang, setLang }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  return useContext(I18nCtx);
}
