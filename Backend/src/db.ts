import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

export default db