import { db } from '@/infra/db'
import { uploads } from '@/infra/db/schemas/uploads'
import { isRight } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { Readable } from 'node:stream'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { uploadImage } from './upload-image'

describe('upload image', () => {
  beforeAll(() => {
    vi.mock('@/infra/storage/upload-file-to-storage', () => ({
      uploadFileToStorage: vi.fn().mockImplementation(() => ({
        key: `${randomUUID()}.png`,
        url: `https://example.com/${randomUUID()}.png`,
      })),
    }))
  })

  it('should be able to upload an image', async () => {
    const fileName = `${randomUUID()}.jpg`

    const sut = await uploadImage({
      fileName,
      contentType: 'image/jpeg',
      contentStream: Readable.from([]),
    })

    expect(isRight(sut)).toBe(true)

    const result = await db.select().from(uploads).where(eq(uploads.name, fileName))

    expect(result).toHaveLength(1)
  })
})
