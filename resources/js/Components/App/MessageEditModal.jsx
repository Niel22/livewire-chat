import { useState } from "react";

const MessageEditModal = ({ isOpen, setIsOpen, editMessage, setEditMessage, updateEdit }) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Edit Message</h2>
                <textarea
                    
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 resize-none"
                />
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-3 py-1 rounded-md bg-gray-300 hover:bg-gray-400 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={updateEdit}
                        className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageEditModal;
