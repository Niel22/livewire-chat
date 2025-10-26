import { isAudio, isImage, isPDF, isPreviewable, isVideo } from '@/helpers'
import { ArrowDownTrayIcon, PaperClipIcon, PlayCircleIcon } from '@heroicons/react/24/solid'
import React from 'react'

const MessageAttachments = ({attachments, attachmentClick}) => {
  return (
    <>
        {attachments.length && (
              <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
                  {attachments.map((attachment, index) => (
                      <div
                          key={attachment.id}
                          onClick={() => attachmentClick(attachments, index)}
                          className={`group relative rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all cursor-pointer`}
                      >
                          {!isAudio(attachment) && (
                              <button
                                  onClick={(e) => e.stopPropagation()}
                                  download
                                  href={attachment.url}
                                  className="absolute right-2 top-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                              >
                                  <ArrowDownTrayIcon className="w-4 h-4" />
                              </button>
                          )}

                          {isImage(attachment) && (
                              <img
                                  src={attachment.url}
                                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                          )}

                          {isVideo(attachment) && (
                              <div className="relative w-full h-40 bg-black flex justify-center items-center">
                                  <video
                                      src={attachment.url}
                                      className="absolute inset-0 w-full h-full object-cover opacity-50"
                                  />
                                  <PlayCircleIcon className="z-10 w-12 h-12 text-white opacity-90" />
                              </div>
                          )}

                          {isAudio(attachment) && (
                              <div className="p-3">
                                  <audio src={attachment.url} controls className="w-full" />
                              </div>
                          )}

                          {isPDF(attachment) && (
                              <div className="p-3 flex flex-col items-center justify-center">
                                  <DocumentTextIcon className="w-10 h-10 text-red-500 mb-2" />
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate w-full text-center">
                                      {attachment.name}
                                  </p>
                              </div>
                          )}

                          {!isPreviewable(attachment) && (
                              <div className="p-3 flex flex-col justify-center items-center text-center">
                                  <PaperClipIcon className="w-10 h-10 mb-2 text-gray-400 dark:text-gray-300" />
                                  <small className="text-gray-700 dark:text-gray-300 truncate w-full">
                                      {attachment.name}
                                  </small>
                              </div>
                          )}
                      </div>
                  ))}
              </div>


        )}
    </>
  )
}

export default MessageAttachments
