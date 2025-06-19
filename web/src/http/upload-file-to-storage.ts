import { api } from '../lib/axios'

interface UploadFileToStorageParams {
  file: File
}

interface UploadFileToStorageOpts {
  signal: AbortSignal
}

interface UploadFileToStorageResponse {
  url: string
}

export async function uploadFileToStorage(
  { file }: UploadFileToStorageParams,
  opts?: UploadFileToStorageOpts
) {
  const data = new FormData()
  data.append('file', file)

  const response = await api.post<UploadFileToStorageResponse>('/upload-image', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    signal: opts?.signal,
  })

  return { url: response.data.url }
}
