import { db } from '@/infra/db'
import { uploads } from '@/infra/db/schemas/uploads'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeUpload(overrides?: Partial<InferInsertModel<typeof uploads>>) {
  const fileName = faker.system.fileName()

  const result = await db
    .insert(uploads)
    .values({
      name: fileName,
      remoteKey: `images/${fileName}`,
      remoteUrl: `https://example.com/${fileName}`,
      ...overrides,
    })
    .returning()

  return result[0]
}
