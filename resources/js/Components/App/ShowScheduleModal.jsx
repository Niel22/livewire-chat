import { formatScheduledTime } from "@/helpers";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";

const ShowScheduleModal = ({ isOpen, setIsOpen, message = null }) => {
  if (!isOpen) return null;


  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-200 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-md overflow-hidden transform transition-transform duration-200 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Scheduled Message
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="text-gray-700 dark:text-gray-200 text-sm whitespace-pre-wrap">
            {message.message}
          </div>

          {message.attachments.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
                {message.attachments.map((file, index) => (
                    <div
                    key={index}
                    className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden"
                    >
                    <img
                        src={`/storage/${file.path}`}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                    </div>
                ))}
            </div>
            )}

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Scheduled for: <span className="font-medium">{formatScheduledTime(message.scheduled_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowScheduleModal;
