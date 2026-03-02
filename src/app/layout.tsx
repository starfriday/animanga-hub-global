import type { Metadata } from "next";
import { Outfit, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { HomeHeader } from "@/components/layout/HomeHeader";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "AniVault | Премиальный Аниме и Манга Хаб",
  description: "Смотрите аниме и читайте мангу онлайн в высочайшем качестве.",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    images: ['/logo-512.png'],
  },
};

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#1A1A1A] transition-colors duration-500">
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Warm accent glow */}
      <div className="absolute -top-[20%] right-0 w-[60vw] h-[60vw] bg-[#B83A2D]/[0.03] rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#4E6851]/[0.03] rounded-full blur-[120px]" />
    </div>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="relative">
      <body
        className={cn(
          `${outfit.variable} ${nunitoSans.variable} antialiased`,
          "min-h-screen flex flex-col bg-[#1A1A1A] text-[#DCC9A9] selection:bg-accent/30 selection:text-white"
        )}
      >
        <Background />
        <HomeHeader />

        <main className="flex-grow relative z-10">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
