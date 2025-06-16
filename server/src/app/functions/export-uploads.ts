import { db, pg } from '@/infra/db'
import { uploads } from '@/infra/db/schemas/uploads'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { type Either, makeRight } from '@/shared/either'
import { stringify } from 'csv-stringify'
import { ilike } from 'drizzle-orm'
import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { z } from 'zod'

const exportUploadInput = z.object({
  searchQuery: z.string().optional(),
})

type ExportUploadsInput = z.input<typeof exportUploadInput>

type ExportUploadsOutput = Either<never, { reportUrl: string }>

export async function exportUploads(
  input: ExportUploadsInput
): Promise<ExportUploadsOutput> {
  const { searchQuery } = exportUploadInput.parse(input)

  const { sql, params } = db
    .select({
      id: uploads.id,
      name: uploads.name,
      remoteUrl: uploads.remoteUrl,
      createdAt: uploads.createdAt,
    })
    .from(uploads)
    .where(searchQuery ? ilike(uploads.name, `%${searchQuery}%`) : undefined)
    .toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(2)

  // for await (const rows of cursor) {
  //   console.log(rows)
  // }

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      {
        key: 'id',
        header: 'ID',
      },
      {
        key: 'name',
        header: 'Name',
      },
      {
        key: 'remote_url',
        header: 'URL',
      },
      {
        key: 'created_at',
        header: 'Uploaded At',
      },
    ],
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCsvPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], _, callback) {
        for (const chunk of chunks) {
          this.push(chunk)
        }

        callback()
      },
    }),
    csv,
    uploadToStorageStream
  )

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: `${new Date().toISOString()}-uploads.csv`,
    contentStream: uploadToStorageStream,
  })

  const [, { url }] = await Promise.all([convertToCsvPipeline, uploadToStorage])

  await convertToCsvPipeline

  return makeRight({ reportUrl: url })
}
