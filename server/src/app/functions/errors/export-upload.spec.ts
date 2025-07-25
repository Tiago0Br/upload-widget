import * as upload from '@/infra/storage/upload-file-to-storage'
import { isRight, unwrapEither } from '@/shared/either'
import { makeUpload } from '@/test/factories/make-upload'
import { randomUUID } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import { exportUploads } from '../export-uploads'

describe('export uploads', () => {
  it('should be able to export uploads', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => ({
        key: `${randomUUID()}.csv`,
        url: 'https://example.com/upload-report.csv',
      }))

    const namePattern = randomUUID()

    const upload1 = await makeUpload({ name: `${namePattern}.png` })
    const upload2 = await makeUpload({ name: `${namePattern}.png` })
    const upload3 = await makeUpload({ name: `${namePattern}.png` })

    const sut = await exportUploads({ searchQuery: namePattern })

    const generatedCsvStream = uploadStub.mock.calls[0][0].contentStream
    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generatedCsvStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      generatedCsvStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'))
      })

      generatedCsvStream.on('error', error => {
        reject(error)
      })
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(line => line.split(','))

    expect(isRight(sut)).toBeTruthy()

    expect(unwrapEither(sut)).toEqual({
      reportUrl: 'https://example.com/upload-report.csv',
    })

    expect(csvAsArray).toEqual([
      ['ID', 'Name', 'URL', 'Uploaded At'],
      [upload1.id, upload1.name, upload1.remoteUrl, expect.any(String)],
      [upload2.id, upload2.name, upload2.remoteUrl, expect.any(String)],
      [upload3.id, upload3.name, upload3.remoteUrl, expect.any(String)],
    ])
  })
})
