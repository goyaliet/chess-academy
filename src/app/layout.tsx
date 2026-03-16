import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chess Academy — Learn Chess with AI",
  description: "Your personal AI chess coach. Learn tactics, openings, endgames, and strategy step by step.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
