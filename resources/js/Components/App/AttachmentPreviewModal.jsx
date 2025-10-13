import { isAudio, isImage, isPDF, isPreviewable, isVideo } from '@/helpers';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useMemo, useState } from 'react'

const AttachmentPreviewModal = ({
  attachments,
  index,
  show = false,
  onClose = () => {}
}) => {
  

  const [currentIndex, setCurrentIndex] = useState(0);
  const attachment = useMemo(() => {
    return attachments[currentIndex];
  }, [attachments, currentIndex]);

  const previewable = useMemo(() => {
    return attachments.filter((attachment) => isPreviewable(attachment));
  }, [attachments]);

  const close = () => {
    onClose();
  }

  const prev = () => {
    if(currentIndex === 0){
      return;
    }

    setCurrentIndex(currentIndex - 1);
  }
  
  const next = () => {
    if(currentIndex === previewable.length - 1){
      return;
    }

    setCurrentIndex(currentIndex + 1);
  }

  useEffect(() => {
    setCurrentIndex(index);
  }, [index]);

  return (
    <Transition show={show} leave="duration-200">
      <Dialog
        as="div"
        id="modal"
        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 transition-all sm:px-0"
        onClose={close}
      >
        {/* Overlay */}
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </TransitionChild>

        {/* Modal container */}
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto">
          <div className="flex min-h-full items-center justify-center w-full">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                className="flex items-center justify-center relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-xl transition-all sm:mx-auto sm:w-full sm:max-w-5xl sm:max-h-[90vh] min-w-[300px] min-h-[300px]"
              >
                {/* Close button */}
                <button
                  onClick={close}
                  className="absolute right-3 top-3 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white z-40 transition"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="relative group w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  {/* Prev arrow */}
                  {currentIndex > 0 && (
                    <div
                      onClick={prev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 cursor-pointer z-30"
                    >
                      <ChevronLeftIcon className="w-8 h-8 text-white" />
                    </div>
                  )}

                  {/* Next arrow */}
                  {currentIndex < previewable.length - 1 && (
                    <div
                      onClick={next}
                      className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 cursor-pointer z-30"
                    >
                      <ChevronRightIcon className="w-8 h-8 text-white" />
                    </div>
                  )}

                  {/* Attachment preview */}
                  {attachment && (
                    <div className="flex items-center justify-center w-full h-full p-3">
                      {isImage(attachment) && (
                        <img
                          src={attachment.url}
                          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow"
                        />
                      )}

                      {isVideo(attachment) && (
                        <video
                          src={attachment.url}
                          controls
                          autoPlay
                          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow"
                        />
                      )}

                      {isAudio(attachment) && (
                        <audio
                          src={attachment.url}
                          controls
                          autoPlay
                          className="w-full max-w-lg"
                        />
                      )}

                      {isPDF(attachment) && (
                        <iframe
                          src={attachment.url}
                          className="w-full h-[80vh] rounded-lg bg-white"
                        />
                      )}

                      {!isPreviewable(attachment) && (
                        <div className="p-12 flex flex-col items-center justify-center text-gray-700 dark:text-gray-100">
                          <PaperClipIcon className="w-10 h-10 mb-3" />
                          <small>{attachment.name}</small>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>

  )
}

export default AttachmentPreviewModal
