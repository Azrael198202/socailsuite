import { Youtube, Instagram, Twitter, Facebook, Linkedin, Music2 as TiktokIcon } from "lucide-react";

export const platforms = [
    { key: "youtube", name: "YouTube", icon: Youtube, color: "bg-red-500" },
    { key: "tiktok", name: "TikTok", icon: TiktokIcon, color: "bg-neutral-900" },
    { key: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-500" },
    { key: "x", name: "X", icon: Twitter, color: "bg-slate-800" },
    { key: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
    { key: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-sky-700" },
] as const;


export function cx(...s: Array<string | false | null | undefined>) { return s.filter(Boolean).join(" "); }