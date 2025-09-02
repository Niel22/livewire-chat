import { useEventBus } from '@/EventBus'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ArrowUturnLeftIcon, BookmarkIcon, EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/solid'

const MessageOptionsDropdown = ({message, currentUser, setReplyingTo, setPinnedMessage, isSender, isAdmin}) => {
    const {emit} = useEventBus();

    const onMessageDelete = () => {
        if(currentUser.id !== message.sender_id) return;
        
        axios.delete(route('message.destroy', message.id))
            .then((res) => {
                emit('message.deleted', {message, prevMessage : res.data.message});
                emit('toast.show', "Message deleted")
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const onMessagePin = () => {
        if(message.group_id && currentUser.role !== 'admin') return;

        axios.patch(route('message.pin', message.id))
            .then((res) => {
                emit('message.pin', message);
                emit('toast.show', 'Message Pinned');
                setPinnedMessage(message);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

  return (
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
                )}
            </MenuItems>
        </Menu>
    </div>
  )
}

export default MessageOptionsDropdown
