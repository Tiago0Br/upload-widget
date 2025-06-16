import { db } from '@/infra/db'
import { uploads as uploadSchema } from '@/infra/db/schemas/uploads'
import { type Either, makeRight } from '@/shared/either'
import { asc, count, desc, ilike } from 'drizzle-orm'
import { z } from 'zod'

const getUploadsInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
})

type GetUploadsInput = z.input<typeof getUploadsInput>
type GetUploadsOutput = Either<
  never,
  {
    uploads: {
      id: string
      name: string
      remoteKey: string
      remoteUrl: string
      createdAt: Date
    }[]
    total: number
  }
>

export async function getUploads(input: GetUploadsInput): Promise<GetUploadsOutput> {
  const { searchQuery, sortBy, sortDirection, page, pageSize } =
    getUploadsInput.parse(input)

  const [uploads, [{ total }]] = await Promise.all([
    db
      .select({
        id: uploadSchema.id,
        name: uploadSchema.name,
        remoteKey: uploadSchema.remoteKey,
        remoteUrl: uploadSchema.remoteUrl,
        createdAt: uploadSchema.createdAt,
      })
      .from(uploadSchema)
      .where(searchQuery ? ilike(uploadSchema.name, `%${searchQuery}%`) : undefined)
      .orderBy(fields => {
        if (sortBy && sortDirection === 'asc') {
          return asc(fields[sortBy])
        }

        if (sortBy && sortDirection === 'desc') {
          return desc(fields[sortBy])
        }

        return desc(fields.id)
      })
      .limit(pageSize)
      .offset((page - 1) * pageSize),

    db
      .select({ total: count(uploadSchema.id) })
      .from(uploadSchema)
      .where(searchQuery ? ilike(uploadSchema.name, `%${searchQuery}%`) : undefined),
  ])

  return makeRight({ uploads, total })
}
