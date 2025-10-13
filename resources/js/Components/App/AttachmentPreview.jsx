import { formatBytes, isPDF, isPreviewable } from '@/helpers';
import { PaperClipIcon } from '@heroicons/react/24/solid';
import React from 'react'

const AttachmentPreview = ({file}) => {
  return (
    <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-slate-100 dark:bg-slate-800">
        <div className="bg-black/10 dark:bg-black/30 p-3 rounded-md">
            {isPDF(file.file) && <img src="/assets/img/pdf.webp" className="w-8" />}
            {!isPreviewable(file.file) && (
                <PaperClipIcon className="w-6 text-gray-600 dark:text-gray-300" />
            )}
        </div>

        <div className="flex-1 text-gray-700 dark:text-gray-300 text-nowrap text-ellipsis overflow-hidden">
            <h3 className="font-medium">{file.file.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatBytes(file.file.size)}
            </p>
        </div>
    </div>

  )
}

export default AttachmentPreview;
