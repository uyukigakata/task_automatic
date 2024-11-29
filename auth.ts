import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const { handlers, auth } = NextAuth({
    providers: [
        GoogleProvider({
        clientId: process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],
    adapter: PrismaAdapter(prisma), // PrismaAdapterを使用
    callbacks: {
        async jwt({ token, user }) {
          // 初回認証時、トークンにユーザーIDを追加
            if (user) {
                token.sub = user.id; // `sub`にユーザーIDを設定
            }
            return token;
            },
            async session({ session, token }) {
            // トークンからユーザーIDをセッションに追加
            if (token && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
});
