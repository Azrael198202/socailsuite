import Link from "next/link";
import AccountForm from "./AccountForm";

export default async function NewAccountPage({ params }: { params: Promise<{ platform: string }> }) {
    const { platform } = await params;
    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <Link href={`/accounts/${platform}`} className="text-sm text-gray-500 hover:underline">← 戻る</Link>
            <h1 className="text-2xl font-semibold mt-2">{platform.toUpperCase()} アカウント確認</h1>
            {/* Client */}
            {/* @ts-expect-error Async Server Component embedding Client */}
            <AccountForm platform={platform} />
        </div>
    );
}