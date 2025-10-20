'use client';
import { motion } from "framer-motion";
import React from "react";

export default function SectionCard({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="rounded-2xl bg-white shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                {right}
            </div>
            {children}
        </motion.div>
    );
}