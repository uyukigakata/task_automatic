import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';


const prisma = new PrismaClient();

// NextAuth設定
export const { handlers, auth, signIn, signOut } = NextAuth({
  // Prismaを使うための設定
  adapter: PrismaAdapter(prisma),
  // 認証プロバイダーの設定
  providers: [
    // Google認証
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    // メールアドレス認証
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        // メールアドレスとパスワード
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials) {
        if (typeof credentials?.email !== 'string' || typeof credentials?.password !== 'string') {
          return null;
        }
        
        // ユーザーを取得
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },

        });
        
        // ユーザーが存在しない場合やパスワードがハッシュ化されていない場合
        if (!user || !user.hashedPassword) {
          return null;
        }
        
        // パスワードの検証
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        
        // パスワードが一致しない場合
        if (!isValidPassword) {
          return null;
        }
        
        return user;        
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});