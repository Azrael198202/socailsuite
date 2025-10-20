import "./globals.css";

export const metadata = { title: "SocialOps Studio", description: "Hootsuite-like dashboard" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja"><body className="min-h-screen bg-gray-50 text-gray-900">{children}</body></html>
  );
}