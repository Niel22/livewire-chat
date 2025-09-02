import DeleteGroupModal from '@/Components/App/DeleteGroupModal'
import ViewGroupModal from '@/Components/App/ViewGroupModal'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { UserGroupIcon } from '@heroicons/react/24/solid'
import { Head, Link } from '@inertiajs/react'
import { useEffect, useState } from 'react'


const List = ({groups}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [group, setGroup] = useState(null);

    const openViewModal = (group) => {
        setGroup(group);
        setIsOpen(true);
    } 
    
    const closeViewModal = () => {
        setGroup(null);
        setIsOpen(false);
    } 
    
    const openDeleteModal = (group) => {
        setGroup(group);
        setDeleteModalOpen(true);
    } 
    
    const closeDeleteModal = () => {
        setGroup(null);
        setDeleteModalOpen(false);
    }

    useEffect(() => {
        setIsOpen(false);
        setDeleteModalOpen(false);
        setGroup(null);
    }, [])

  return (
    <>
        <Head title="Groups" />

        <div className="py-12 overflow-auto">
            <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
                {groups.map((group) => (
                    <div
                        key={group.id}
                        className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center"
                    >
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
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            {group.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <button onClick={() => openViewModal(group)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                                View
                            </button>
                            <Link href={route('group.edit', group)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                                Edit
                            </Link>
                            <button onClick={() => openDeleteModal(group)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                                Delete
                            </button>
                            <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                Add Member
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <ViewGroupModal isOpen={isOpen} closeViewModal={closeViewModal} group={group} />
        <DeleteGroupModal isOpen={deleteModalOpen} closeModal={closeDeleteModal} group={group} />
    </>
  )
}

List.layout = (page) => {
    return <AuthenticatedLayout
            header={
                <div className='w-full flex justify-between items-center'>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Groups
                    </h2>
                    <Link href={route('group.create')} className='py-3 px-4 bg-gray-50 text-slate-900 rounded-md text-sm'>
                        Create Group
                    </Link>
                </div>
            }
            children={page}
        >
        </AuthenticatedLayout>
}

export default List
