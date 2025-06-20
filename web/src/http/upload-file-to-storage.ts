import { api } from '../lib/axios'

interface UploadFileToStorageParams {
  file: File
  onProgress: (sizeInBytes: number) => void
}

interface UploadFileToStorageOpts {
  signal: AbortSignal
}

interface UploadFileToStorageResponse {
  url: string
}

export async function uploadFileToStorage(
  { file, onProgress }: UploadFileToStorageParams,
  opts?: UploadFileToStorageOpts
) {
  const data = new FormData()
  data.append('file', file)

  const response = await api.post<UploadFileToStorageResponse>('/upload-image', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    signal: opts?.signal,
    onUploadProgress(progressEvent) {
      onProgress(progressEvent.loaded)
    },
  })

  return { url: response.data.url }
}
