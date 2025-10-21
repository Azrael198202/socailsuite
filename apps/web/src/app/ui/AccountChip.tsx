'use client';
import React from 'react';
import { RefreshCw, Star, Trash2 } from 'lucide-react';
import { cx } from "../lib/platforms";

export default function AccountChip({
  label, hint, status, isDefault, onDefault, onRefresh, onRemove,
}:{
  label: string; hint?: string; status: 'active'|'expired'|'revoked'; isDefault?: boolean;
  onDefault?: ()=>void; onRefresh?: ()=>void; onRemove?: ()=>void;
}) {
  const color =
    status === 'active'  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
    status === 'expired' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                           'bg-gray-50 text-gray-500 border-gray-200';
  return (
    <div className={cx("flex items-center gap-2 px-3 py-2 rounded-xl border text-sm", color)}>
      <span className="truncate">{label}</span>
      {hint && <span className="text-xs opacity-70">{hint}</span>}
      {isDefault && <Star className="w-3.5 h-3.5" />}
      <div className="ml-auto flex items-center gap-1">
        {onDefault && <button className="px-2 py-1 rounded-lg border" onClick={onDefault}>既定</button>}
        {onRefresh && <button className="px-2 py-1 rounded-lg border" onClick={onRefresh}><RefreshCw className="w-3.5 h-3.5"/></button>}
        {onRemove && <button className="px-2 py-1 rounded-lg border" onClick={onRemove}><Trash2 className="w-3.5 h-3.5"/></button>}
      </div>
    </div>
  );
}
