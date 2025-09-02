import { PaperClipIcon, XCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

const ReplyToMessage = ({ replyingTo, setReplyingTo }) => {
    return (
        <div className="flex items-center justify-between bg-blue-50 dark:bg-gray-700 p-2 rounded-t-md border border-b-0 border-blue-300 dark:border-gray-600">
            <div className="flex-1 overflow-hidden">
                <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
                    Replying to {replyingTo.sender.name}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-100 truncate">
                    {replyingTo.message || " Attachment"}
                </p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
                <XCircleIcon
                    className="w-5 h-5"
                    onClick={() => setReplyingTo(null)}
                />
            </button>
        </div>
    );
};

export default ReplyToMessage;
