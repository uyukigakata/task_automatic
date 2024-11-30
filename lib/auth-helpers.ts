import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

/**
 * 認証ユーザーを取得
 */
export async function getAuthenticatedUser() {
    const session = await auth();

    if (!session?.user || !session.user.email) {
        return null; // 認証されていない場合はnullを返す
    }

    // メールアドレスからユーザーを取得
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    return user; // 認証されたユーザー情報を返す
}
