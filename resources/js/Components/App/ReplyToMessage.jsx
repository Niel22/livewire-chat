import { XCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

const truncateText = (text, maxLength = 20) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
};

const ReplyToMessage = ({ replyingTo, setReplyingTo }) => {
  if (!replyingTo) return null;

  return (
    <div className="flex items-center justify-between bg-blue-50 dark:bg-gray-700 p-2 rounded-t-md border border-b-0 border-blue-300 dark:border-gray-600">
      <div className="flex-1 overflow-hidden">
        <p className="text-xs text-gray-500 dark:text-gray-300">
          Replying to {replyingTo.sender.name}
        </p>
        <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-100">
          {truncateText(replyingTo.message || "Attachment", 20)}
        </p>
      </div>
      <button
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
        onClick={() => setReplyingTo(null)}
      >
        <XCircleIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ReplyToMessage;
