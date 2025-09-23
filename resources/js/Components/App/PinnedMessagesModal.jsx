import { BookmarkIcon, XMarkIcon } from '@heroicons/react/24/solid';
import React from 'react'
import { useTranslation } from 'react-i18next';

const PinnedMessagesModal = ({open,onClose, pinnedMessages, handleViewOriginal, isAdmin}) => {
  const { t } = useTranslation('convo');
    const onMessageUnpin = (message) => {
        if(!isAdmin()) return;

        axios.patch(route('message.unpin', message.id))
            .then((res) => {
                // emit('message.unpin', message);
                // emit('toast.show', 'Message Uninned');
            })
            .catch((err) => {
                // console.log(err);
            })
    }
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/40 flex justify-center items-start pt-20 transition-opacity duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-4 relative transform transition-transform duration-200 ${
          open ? "scale-100" : "scale-95"
        }`}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
          <BookmarkIcon className="w-5 h-5 text-emerald-500" />
          {t('pinnedMessages')}
        </h2>

        <div className="max-h-64 overflow-y-auto border-t dark:border-gray-700 pt-2">
          {pinnedMessages?.length === 0 && (
            <p className="text-gray-500 text-sm text-center">{t('noPinnedMessages')}</p>
          )}

          {pinnedMessages?.map((msg) => (
            <div
              key={msg.id}
              onClick={() => {
                handleViewOriginal(msg.id);
                onClose();
              }}
              className="p-3 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition flex justify-between items-center"
            >
              <div className="w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {msg.sender?.name || t('unknownSender')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {msg.message || t('attachment')}
                </div>
              </div>
              <button className='rounded-full p-2 hover:bg-slate-900/50' onClick={(e) => {
                e.stopPropagation();
                onMessageUnpin(msg)
              }}>
                <BookmarkIcon className="w-4 h-4 text-emerald-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PinnedMessagesModal
