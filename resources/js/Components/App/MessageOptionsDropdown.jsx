import { useEventBus } from '@/EventBus'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ArrowUturnLeftIcon, BookmarkIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import MessageEditModal from './MessageEditModal';
import { useState } from 'react';
import { router } from '@inertiajs/react';

const MessageOptionsDropdown = ({message, currentUser, setReplyingTo, setPinnedMessages, isSender, isAdmin}) => {
    const {emit} = useEventBus();
    const [isOpen, setIsOpen] = useState(false);
    const [editMessage, setEditMessage] = useState(null);

    const handleEdit = () => {
        setEditMessage(message.message);
        setIsOpen(true);
    }

    const updateEdit = () => {
        axios
            .patch(route("message.update", message.id), {
                message: editMessage,
            })
            .then((response) => {
                setIsOpen(false);
                setEditMessage(null);
                emit('message.updated', response.data);
            })
            .catch((error) => {
                setIsOpen(false);
                const message = error.response?.data?.message;
                // console.error(message);
            });
    };

    const onMessageDelete = () => {
        if(parseInt(currentUser.id) !== parseInt(message.sender_id)) return;
        
        axios.delete(route('message.destroy', message.id))
            .then((res) => {
                emit('message.deleted', {message, prevMessage : res.data.message});
                emit('toast.show', "Message deleted")
            })
            .catch((err) => {
                // console.log(err);
            })
    }

    const onMessagePin = () => {
        if(!isAdmin()) return;

        axios.patch(route('message.pin', message.id))
            .then((res) => {
                emit('message.pin', message);
                emit('toast.show', 'Message Pinned');
                setPinnedMessages((prev) => {
                    if(prev.some((m) => parseInt(m.id) === parseInt(message.id))){
                        return prev;
                    }

                    return [...prev, message].sort(
                        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
                    )
                });
            })
            .catch((err) => {
                console.log(err);
            })
    }

  return (
    <>
        <div className={`absolute ${parseInt(currentUser.id) === parseInt(message.sender_id) ? "right-full" : "left-full"} top-1/2 -translate-y-1/2`}>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <MenuButton className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </MenuButton>
                </div>
                <MenuItems
                    transition
                    anchor="bottom end"
                    className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg z-50 border border-gray-200 dark:border-gray-700"
                >
                    <div className="p-1">
                        <MenuItem>
                            {({ active }) => (
                            <button
                                onClick={() => setReplyingTo(message)}
                                className={`group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm 
                                            ${active ? "bg-gray-100 dark:bg-gray-700" : ""} 
                                            text-gray-800 dark:text-gray-200`}
                            >
                                <ArrowUturnLeftIcon className="size-4 text-gray-500 dark:text-gray-300" />
                                Reply To
                                <kbd className="ml-auto hidden font-sans text-xs text-gray-500 dark:text-gray-400 group-data-focus:inline">
                                ⌘E
                                </kbd>
                            </button>
                            )}
                        </MenuItem>
                    </div>

                    {isAdmin() && (
                        <div className="p-1">
                            <MenuItem>
                                {({ active }) => (
                                <button
                                    onClick={() => onMessagePin()}
                                    className={`group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm 
                                                ${active ? "bg-gray-100 dark:bg-gray-700" : ""} 
                                                text-gray-800 dark:text-gray-200`}
                                >
                                    <BookmarkIcon className="size-4 text-gray-500 dark:text-gray-300" />
                                    Pin
                                    <kbd className="ml-auto hidden font-sans text-xs text-gray-500 dark:text-gray-400 group-data-focus:inline">
                                    ⌘E
                                    </kbd>
                                </button>
                                )}
                            </MenuItem>
                        </div>
                    )}

                    {(isSender() || isAdmin()) && (
                        <>
                            <div className="p-1">
                                <MenuItem>
                                    {({ active }) => (
                                    <button
                                        onClick={handleEdit}
                                        className={`group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm 
                                                    ${active ? "bg-gray-100 dark:bg-gray-700" : ""} 
                                                    text-gray-800 dark:text-gray-200`}
                                    >
                                        <PencilIcon className="size-4 text-gray-500 dark:text-gray-300" />
                                        Edit
                                        <kbd className="ml-auto hidden font-sans text-xs text-gray-500 dark:text-gray-400 group-data-focus:inline">
                                        ⌘E
                                        </kbd>
                                    </button>
                                    )}
                                </MenuItem>
                            </div>
                            <div className="p-1">
                                <MenuItem>
                                    {({ active }) => (
                                    <button
                                        onClick={onMessageDelete}
                                        className={`group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm 
                                                    ${active ? "bg-gray-100 dark:bg-gray-700" : ""} 
                                                    text-gray-800 dark:text-gray-200`}
                                    >
                                        <TrashIcon className="size-4 text-gray-500 dark:text-gray-300" />
                                        Delete
                                        <kbd className="ml-auto hidden font-sans text-xs text-gray-500 dark:text-gray-400 group-data-focus:inline">
                                        ⌘E
                                        </kbd>
                                    </button>
                                    )}
                                </MenuItem>
                            </div>
                        </>
                    )}
                </MenuItems>
            </Menu>
        </div>
        <MessageEditModal 
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            editMessage={editMessage}
            setEditMessage={setEditMessage}
            updateEdit={updateEdit}
        />
    </>
  )
}

export default MessageOptionsDropdown
