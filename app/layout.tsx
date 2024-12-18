import type { Metadata } from "next";
import "./styles/globals.css";
import Navigation from "./components/navigation/Navigation";
import AuthContext from "./context/AuthContext";
import ToasterContext from "@/app/context/ToasterContext";
import SignupModal from "@/app/components/modals/SignupModal";
import LoginModal from "@/app/components/modals/LoginModal";
import ProfileModal from "@/app/components/modals/ProfileModal";

import getCurrentUser from "@/app/actions/getCurrentUser";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "TaskAutomatic",
  description: "タスク予測して自動追加！",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  
  return (
    <html>
      <body className={inter.className}>
        <AuthContext>
          {/* Toaster */}
          <ToasterContext />
          {/* モーダル */}
          <SignupModal />
          <LoginModal />
          <ProfileModal currentUser={currentUser}/>
          <div className="flex min-h-screen flex-col">
            {/* 固定ナビゲーション */}
            <Navigation currentUser={currentUser} />

            {/* Main */}
            <main className="container mx-auto max-w-screen flex-1 px-1 py-5 pt-16">
              {children}
            </main>

            {/* Footer */}
            <footer className="py-5">
              <div className="text-center text-sm">
                Copyright © All rights reserved | Task-Automatic
              </div>
            </footer>
          </div>
        </AuthContext>
      </body>
    </html>
  );
}

