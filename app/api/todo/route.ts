import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth"; // Auth.js用の認証関数をインポート

// Prismaクライアントを初期化
const prisma = new PrismaClient();

/**
 * POSTメソッド: 新しいTodoを作成（ユーザーに紐づける）
 */
export async function POST(request: Request) {
  try {
    // 認証情報を取得
    const session = await auth();

    // 認証されていない場合はエラーを返す
    if (!session?.user || !session.user.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // リクエストボディをJSON形式で解析
    const body = await request.json();
    const { title } = body;

    // タイトルが空の場合はエラーを返す
    if (!title) {
      return NextResponse.json({ error: "タイトルは必須です" }, { status: 400 });
    }

    // ユーザーを取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    // 新しいTodoを作成
    const todo = await prisma.todo.create({
      data: {
        title,
        userId: user.id,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Error creating Todo:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}

/**
 * GETメソッド: 認証されたユーザーのTodoを取得
 */
export async function GET() {
  try {
    // 認証情報を取得
    const session = await auth();

    // 認証されていない場合はエラーを返す
    if (!session?.user || !session.user.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // ユーザーを取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    // ユーザーのTodoリストを取得
    const todos = await prisma.todo.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Error fetching Todos:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
