import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { UserGroupIcon } from '@heroicons/react/24/solid';
import React, { Fragment } from 'react'

const ViewGroupModal = ({ isOpen, closeViewModal, group }) => {
  if (!group) return null


  return (
    <Transition show={isOpen} as={Fragment}>
        <Dialog
            open={isOpen}
            as="div"
            className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-300"
            onClose={() => closeViewModal()}
        >
        <div className="fixed inset-0 bg-black/50" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
            

            <div className="flex flex-col items-center space-y-4">
                <div className="avatar avatar-placeholder">
                    <div className="
                        bg-gray-400 text-gray-800 rounded-full w-20
                        dark:bg-gray-700 dark:text-gray-100
                    ">
                        <span className="text-xl">
                        <UserGroupIcon className="w-10" />
                        
                        </span>
                    </div>
                </div>
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {group.name}
                </DialogTitle>
                {group.description && (
                <p className="text-gray-700 dark:text-gray-300 text-center">
                    {group.description}
                </p>
                )}

                <div className="w-full text-center space-y-1">
                    <p className="text-gray-800 dark:text-gray-200">
                    <span className="font-semibold">Admin:</span> {group.admin?.name || 'N/A'}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200">
                    <span className="font-semibold">Total Members:</span> {group.member}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                onClick={closeViewModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                Close
                </button>
            </div>
            </DialogPanel>
        </div>
        </Dialog>
    </Transition>
  )
}

export default ViewGroupModal
