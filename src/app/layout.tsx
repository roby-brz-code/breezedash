import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Breezedash - Merchant Dashboard",
  description: "Merchant payment dashboard for Pickem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
