import { Outfit, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "V-RUN 11 | Pro Fantasy Cricket Draft Room 2026",
  description: "Real-time multiplayer IPL and Fantasy Cricket Draft Auction Room. Bid for top players, manage team purse, and build your ultimate championship playing XI.",
  keywords: ["IPL Auction", "Fantasy Cricket", "Cricket Draft", "Multiplayer Auction", "V-RUN 11"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${outfit.variable} ${geistMono.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-slate-100 selection:bg-[#657166] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
