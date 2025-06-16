import { isRight, unwrapEither } from '@/shared/either'
import { makeUpload } from '@/test/factories/make-upload'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { getUploads } from './get-uploads'

describe('get uploads', () => {
  it('should be able to get uploads', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({ name: `${namePattern}.webp` })
    const upload2 = await makeUpload({ name: `${namePattern}.webp` })
    const upload3 = await makeUpload({ name: `${namePattern}.webp` })

    const sut = await getUploads({ searchQuery: namePattern })

    expect(isRight(sut)).toBeTruthy()

    const result = unwrapEither(sut)

    expect(result.total).toEqual(3)
    expect(result.uploads).toEqual([
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })

  it('should be able to get paginated uploads', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({ name: `${namePattern}.webp` })
    const upload2 = await makeUpload({ name: `${namePattern}.webp` })
    const upload3 = await makeUpload({ name: `${namePattern}.webp` })
    const upload4 = await makeUpload({ name: `${namePattern}.webp` })
    const upload5 = await makeUpload({ name: `${namePattern}.webp` })

    let sut = await getUploads({
      searchQuery: namePattern,
      page: 1,
      pageSize: 3,
    })

    expect(isRight(sut)).toBeTruthy()

    let result = unwrapEither(sut)

    expect(result.total).toEqual(5)
    expect(result.uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
    ])

    sut = await getUploads({
      searchQuery: namePattern,
      page: 2,
      pageSize: 3,
    })

    expect(isRight(sut)).toBeTruthy()

    result = unwrapEither(sut)

    expect(result.total).toEqual(5)
    expect(result.uploads).toEqual([
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })

  it('should be able to get paginated uploads', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: dayjs().subtract(1, 'day').toDate(),
    })
    const upload2 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: dayjs().subtract(2, 'day').toDate(),
    })
    const upload3 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: new Date(),
    })

    const sut = await getUploads({
      searchQuery: namePattern,
      page: 1,
      pageSize: 3,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })

    expect(isRight(sut)).toBeTruthy()

    const result = unwrapEither(sut)

    expect(result.total).toEqual(3)
    expect(result.uploads).toEqual([
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload1.id }),
      expect.objectContaining({ id: upload2.id }),
    ])
  })
})
