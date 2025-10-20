'use client';
import React from "react";

function cx(...s: Array<string | false | null | undefined>) {
    return s.filter(Boolean).join(" ");
}

export default function SidebarItem({ icon: Icon, label, active, onClick }: { icon: React.ElementType; label: string; active?: boolean; onClick?: () => void }) {
    return (
        <button onClick={onClick} 
            className={cx("w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition", 
                active ? "bg-gray-900 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100")}>
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </button>
    );
}