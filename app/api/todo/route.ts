import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Prisma Clientを使用してタスクを取得
    const tasks = await prisma.task.findMany();

    // 取得したタスクをJSON形式で返す
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("エラーの詳細:", error);

    // エラーが発生した場合は500エラーを返す
    return NextResponse.json(
      { error: "データ取得中にエラーが発生しました。" },
      { status: 500 }
    );
  } finally {
    // Prisma Clientの接続を切断
    await prisma.$disconnect();
  }
}
