import * as Progress from '@radix-ui/react-progress'
import { Download, ImageUp, Link2, RefreshCcw, XIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { type Upload, useUploads } from '../store/uploads'
import { downloadUrl } from '../utils/download-url'
import { formatBytes } from '../utils/format-bytes'
import { Button } from './ui/button'

interface UploadWigetUploadItemProps {
  uploadId: string
  upload: Upload
}

export function UploadWidgetUploadItem({ uploadId, upload }: UploadWigetUploadItemProps) {
  const cancelUpload = useUploads(store => store.cancelUpload)
  const retryUpload = useUploads(store => store.retryUpload)

  const progress = Math.min(
    upload.compressedSizeInBytes
      ? Math.round((upload.uploadSizeInBytes * 100) / upload.compressedSizeInBytes)
      : 0,
    100
  )

  return (
    <motion.div
      className="p-3 rounded-lg flex flex-col gap-3 shadow-shape-content bg-white/2 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium flex items-center gap-1">
          <ImageUp className="size-3 text-zinc-300" strokeWidth={1.5} />
          <span className="max-w-[180px] truncate">{upload.name}</span>
        </span>

        <span className="text-xxs text-zinc-400 flex items-center gap-1.5">
          <span className="line-through">{formatBytes(upload.originalSizeInBytes)}</span>
          <div className="size-1 rounded-full bg-zinc-700" />
          <span>
            {formatBytes(upload.compressedSizeInBytes ?? 0)}
            {upload.compressedSizeInBytes && (
              <span className="text-green-400 ml-1">
                -
                {Math.round(
                  ((upload.originalSizeInBytes - upload.compressedSizeInBytes) * 100) /
                    upload.originalSizeInBytes
                )}
                %
              </span>
            )}
          </span>
          <div className="size-1 rounded-full bg-zinc-700" />
          {upload.status === 'success' && <span>100%</span>}
          {upload.status === 'progress' && <span>{progress}%</span>}
          {upload.status === 'error' && <span className="text-red-400">Error</span>}
          {upload.status === 'canceled' && (
            <span className="text-amber-400">Canceled</span>
          )}
        </span>
      </div>

      <Progress.Root
        value={progress}
        data-status={upload.status}
        className="group h-1 bg-zinc-800 rounded-full overflow-hidden"
      >
        <Progress.Indicator
          className="bg-indigo-500 h-1 group-data-[status=success]:bg-green-400 group-data-[status=error]:bg-red-400 group-data-[status=canceled]:bg-amber-400 transition-all"
          style={{ width: upload.status === 'progress' ? `${progress}%` : '100%' }}
        />
      </Progress.Root>

      <div className="absolute top-2 right-2 flex items-center gap-1">
        <Button
          size="icon-small"
          aria-disabled={!upload.remoteUrl}
          onClick={() => {
            if (upload.remoteUrl) {
              downloadUrl(upload.remoteUrl)
            }
          }}
        >
          <Download className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Download compressed image</span>
        </Button>

        <Button
          size="icon-small"
          disabled={upload.status !== 'success'}
          onClick={() =>
            upload.remoteUrl && navigator.clipboard.writeText(upload.remoteUrl)
          }
        >
          <Link2 className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Copy Remote URL</span>
        </Button>

        <Button
          size="icon-small"
          disabled={!['canceled', 'error'].includes(upload.status)}
          onClick={() => retryUpload(uploadId)}
        >
          <RefreshCcw className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Retry Upload</span>
        </Button>

        <Button
          size="icon-small"
          onClick={() => cancelUpload(uploadId)}
          disabled={upload.status !== 'progress'}
        >
          <XIcon className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Cancel Upload</span>
        </Button>
      </div>
    </motion.div>
  )
}
