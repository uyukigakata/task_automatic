import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuthenticatedUser } from "@/app/lib/auth-helpers";

const prisma = new PrismaClient();

// 新規作成 (POST)
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { title, details, date, startTime, endTime } = body;

    if (!title || !date) {
      return NextResponse.json({ error: "タイトルと日付は必須です" }, { status: 400 });
    }

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

// タスク取得 (GET)
export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // IDを取得
    const date = searchParams.get("date"); // 日付を取得

    if (id) {
      // 特定のタスクを取得
      const todo = await prisma.todo.findUnique({
        where: { id },
        include: { user: true }, // 必要に応じて関連情報を含める
      });

      if (!todo) {
        return NextResponse.json({ error: "タスクが見つかりません" }, { status: 404 });
      }

      return NextResponse.json(todo);
    }

    if (date) {
      // 特定の日付のタスクを取得
      const startOfDay = new Date(`${date}T00:00:00`);
      const endOfDay = new Date(`${date}T23:59:59`);

      const todos = await prisma.todo.findMany({
        where: {
          userId: user.id,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: { startTime: "asc" },
      });

      return NextResponse.json(todos);
    }

    // 全タスク取得
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

// 更新 (PATCH)
export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, details, startTime, endTime, isComplete } = body;

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 });
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(details && { details }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(isComplete !== undefined && { isComplete }),
      },
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error updating Todo:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}

// 削除 (DELETE)
export async function DELETE(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 });
    }

    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Todoを削除しました" });
  } catch (error) {
    console.error("Error deleting Todo:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
