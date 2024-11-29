import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 認証ユーザーを取得
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // リクエストボディを解析
    const body = await request.json();
    const { title, details, date, startTime, endTime } = body;

    // バリデーション
    if (!title || !date) {
      return NextResponse.json({ error: "タイトルと日付は必須です" }, { status: 400 });
    }

    // Todoを作成
    const todo = await prisma.todo.create({
      data: {
        title,
        details,
        date: new Date(date),
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        userId: user.id,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Error creating Todo:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // 認証ユーザーを取得
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // クエリパラメータから日付を取得
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date"); // YYYY-MM-DD形式

    let todos;
    if (date) {
      // 特定の日付のTodoを取得
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setDate(startOfDay.getDate() + 1);

      todos = await prisma.todo.findMany({
        where: {
          userId: user.id,
          date: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
        orderBy: { startTime: "asc" },
      });
    } else {
      // 全てのTodoを取得
      todos = await prisma.todo.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Error fetching Todos:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    // 認証ユーザーを取得
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // リクエストボディを解析
    const body = await request.json();
    const { id, isComplete } = body;

    if (!id || typeof isComplete !== "boolean") {
      return NextResponse.json({ error: "idとisCompleteは必須です" }, { status: 400 });
    }

    // Todoを更新
    const todo = await prisma.todo.update({
      where: { id },
      data: { isComplete },
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error updating Todo:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // 認証ユーザーを取得
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // クエリパラメータからIDを取得
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "idは必須です" }, { status: 400 });
    }

    // Todoを削除
    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Todoを削除しました" });
  } catch (error) {
    console.error("Error deleting Todo:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
