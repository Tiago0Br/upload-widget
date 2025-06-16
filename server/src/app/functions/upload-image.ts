import { db } from '@/infra/db'
import { uploads } from '@/infra/db/schemas/uploads'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { Readable } from 'node:stream'
import { z } from 'zod'
import { InvalidFileFormat } from './errors/invalid-file-format'

const uploadImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UploadImageInput = z.input<typeof uploadImageInput>
type UploadImageOutput = Either<InvalidFileFormat, { url: string }>

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function uploadImage(input: UploadImageInput): Promise<UploadImageOutput> {
  const { fileName, contentType, contentStream } = uploadImageInput.parse(input)

  if (!allowedMimeTypes.includes(contentType)) {
    return makeLeft(new InvalidFileFormat())
  }

  const { key, url } = await uploadFileToStorage({
    folder: 'images',
    fileName,
    contentType,
    contentStream,
  })

  await db.insert(uploads).values({
    name: fileName,
    remoteUrl: key,
    remoteKey: url,
  })

  return makeRight({ url })
}
