import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { Fragment } from 'react'

const DeleteGroupModal = ({ isOpen, closeModal, group, onConfirm, isLoading }) => {
  if (!group) return null


  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 flex items-center justify-center p-4"
        onClose={closeModal}
      >
        <div className="fixed inset-0 bg-black/50 transition-opacity" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Delete Group
            </DialogTitle>

            <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold">{group.name}</span>? 
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>

              <button onClick={onConfirm}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                {isLoading ? "Deleting Group..." : "Delete"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  )
}

export default DeleteGroupModal
