import { PrismaClient } from '@prisma/client/index.js'

declare global {
  var prisma: PrismaClient | undefined
}

// PrismaClientのインスタンス作成
const client = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = client
}

export default client
