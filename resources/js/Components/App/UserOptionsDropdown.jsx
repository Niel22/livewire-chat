
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import React from 'react'

const UserOptionsDropdown = () => {
  return (
    <div>
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
        </MenuItems>
        </Menu>

    </div>
  )
}

export default UserOptionsDropdown
