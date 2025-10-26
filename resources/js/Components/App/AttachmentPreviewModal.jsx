import { isAudio, isImage, isPDF, isPreviewable, isVideo } from '@/helpers';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useMemo, useState } from 'react'

const AttachmentPreviewModal = ({
  attachments,
  index,
  show = false,
  onClose = () => { }
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
    if (currentIndex === 0) {
      return;
    }

    setCurrentIndex(currentIndex - 1);
  }

  const next = () => {
    if (currentIndex === previewable.length - 1) {
      return;
    }

    setCurrentIndex(currentIndex + 1);
  }

  useEffect(() => {
    setCurrentIndex(index);
  }, [index]);

  return (
    <Transition show={show} appear>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-0"
        onClose={close}
      >
        {/* Overlay */}
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="relative w-full max-w-6xl mx-auto flex justify-center items-center min-h-[80vh]">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative w-full rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden flex items-center justify-center group">

              {/* Close button */}
              <button
                onClick={close}
                className="absolute right-3 top-3 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white z-40 transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              {/* Prev button */}
              {currentIndex > 0 && (
                <div
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
                >
                  <ChevronLeftIcon className="w-8 h-8 text-white" />
                </div>
              )}

              {/* Next button */}
              {currentIndex < previewable.length - 1 && (
                <div
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
                >
                  <ChevronRightIcon className="w-8 h-8 text-white" />
                </div>
              )}

              {/* Counter */}
              <div className="absolute bottom-3 right-5 text-xs text-white bg-black/60 px-3 py-1 rounded-full z-30">
                {currentIndex + 1} / {previewable.length}
              </div>

              {/* Preview */}
              <div className="flex items-center justify-center w-full h-full p-4">
                {attachment && (
                  <>
                    {isImage(attachment) && (
                      <img
                        src={attachment.url}
                        loading="lazy"
                        className="max-w-full max-h-[85vh] object-contain rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                      />
                    )}

                    {isVideo(attachment) && (
                      <video
                        src={attachment.url}
                        controls
                        autoPlay
                        className="max-w-full max-h-[85vh] object-contain rounded-xl"
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
                        className="w-full h-[85vh] rounded-lg bg-white"
                      />
                    )}

                    {!isPreviewable(attachment) && (
                      <div className="flex flex-col items-center justify-center text-gray-700 dark:text-gray-100 p-8">
                        <PaperClipIcon className="w-10 h-10 mb-2" />
                        <small>{attachment.name}</small>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>

  )
}

export default AttachmentPreviewModal
