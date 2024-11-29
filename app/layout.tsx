import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';
import Navigation from "@/components/layout/Navigation";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
        <Navigation />
      </body>
    </html>
  );
}
