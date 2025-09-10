import { isAudio, isImage, isPDF, isPreviewable, isVideo } from '@/helpers'
import { ArrowDownTrayIcon, PaperClipIcon, PlayCircleIcon } from '@heroicons/react/24/solid'
import React from 'react'

const MessageAttachments = ({attachments, attachmentClick}) => {
  return (
    <>
        {attachments.length && (
            <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
                {attachments.map((attachment, index) => (
                    <div
                    key={attachment.id}
                    onClick={() => attachmentClick(attachments, index)}
                    className={`group relative flex flex-col items-center justify-center rounded-xl overflow-hidden cursor-pointer border transition-all shadow-sm 
                        ${isAudio(attachment) 
                        ? "col-span-2 p-3 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700" 
                        : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"}`}
                    >
                    {!isAudio(attachment) && (
                        <a 
                        onClick={(e) => e.stopPropagation()}
                        download
                        href={attachment.url}
                        className="absolute right-1 top-1 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700"
                        >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        </a>
                    )}

                    {isImage(attachment) && (
                        <img 
                        src={attachment.url} 
                        className="max-w-[200px] w-full h-[200px] object-cover rounded-md" 
                        />
                    )}

                    {isVideo(attachment) && (
                        <div className="relative w-full flex justify-center items-center bg-black">
                        <video src={attachment.url} className="w-full h-auto object-contain opacity-60" />
                        <PlayCircleIcon className="absolute z-20 w-16 h-16 text-white opacity-80" />
                        </div>
                    )}

                    {isAudio(attachment) && (
                        <div className="w-full">
                        <audio src={attachment.url} controls className="w-full" />
                        </div>
                    )}

                    {isPDF(attachment) && (
                        <iframe src={attachment.url} className="hide-scrollbar w-full h-auto rounded-md bg-white" />
                    )}

                    {!isPreviewable(attachment) && (
                        <a 
                        onClick={(e) => e.stopPropagation()} 
                        download 
                        href={attachment.url} 
                        className="flex flex-col justify-center items-center text-center p-2"
                        >
                        <PaperClipIcon className="w-10 h-10 mb-2 text-gray-500 dark:text-gray-300" />
                        <small className="text-gray-600 dark:text-gray-300 truncate w-full px-1">{attachment.name}</small>
                        </a>
                    )}
                    </div>
                ))}
                </div>


        )}
    </>
  )
}

export default MessageAttachments
