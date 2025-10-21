'use client';
import React from 'react';

export default function ConnectModal({ open, onClose, onConnect }:{
  open:boolean; onClose:()=>void; onConnect:()=>void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
      <div className="bg-white rounded-2xl p-5 w-[420px]">
        <h3 className="text-lg font-semibold">追加認可</h3>
        <p className="text-sm text-gray-600 mt-2">このプラットフォームに新しいアカウントを連携しますか？</p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-2 rounded-xl border" onClick={onClose}>キャンセル</button>
          <button className="px-3 py-2 rounded-xl bg-gray-900 text-white" onClick={onConnect}>認可へ</button>
        </div>
      </div>
    </div>
  );
}
