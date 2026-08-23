import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sakhi Voice (सखी वॉयस) — Rural Women AI Business Agent",
  description: "Voice-First Conversational AI Business Agent for Rural Women Entrepreneurs powered by Agora Conversational AI & WebRTC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF7F2] text-[#1F1C18] antialiased selection:bg-orange-200 selection:text-orange-900">
        {children}
      </body>
    </html>
  );
}
