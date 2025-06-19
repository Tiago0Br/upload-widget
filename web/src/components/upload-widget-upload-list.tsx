import { UploadWidgetUploadItem } from './upload-widget-upload-item'

export function UploadWidgetUploadList() {
  return (
    <div className="flex flex-col gap-3 px-3">
      <span className="text-xs font-medium">
        Uploaded Files: <span className="text-zinc-400">(2)</span>
      </span>

      <div className="flex flex-col gap-3">
        <UploadWidgetUploadItem />
        <UploadWidgetUploadItem />
      </div>
    </div>
  )
}
