import DeleteGroupModal from '@/Components/App/DeleteGroupModal'
import Pagination from '@/Components/App/Pagination'
import ViewGroupModal from '@/Components/App/ViewGroupModal'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useFetchAllGroups } from '@/query/useGroupQuery'
import { EyeIcon, PencilIcon, PlusCircleIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/solid'
import { Head, Link } from '@inertiajs/react'
import { useEffect, useState } from 'react'


const List = () => {

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const {data: groups, isLoading, refetch} = useFetchAllGroups({page, search});

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

          <div className="py-8">
              <div className="mx-auto max-w-[80%] md:max-w-5xl space-y-4">
                <TextInput
                    id="name"
                    className="mt-1 block w-full dark:bg-transparent dark:text-white dark:border-gray-600"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search group by name..."
                    required
                    autoComplete="off"
                />
                  {isLoading ? (
                    [1, 2, 3, 4].map((i) => (<GroupItemSkeleton key={i} />))
                  ) :  groups.data.length > 0 ? groups.data.map((group) => (
                        <GroupItem group={group} openDeleteModal={openDeleteModal} key={group.id} openViewModal={openViewModal} />
                    )
                ) : (
                    <GroupEmpty />
                )}

                {(!isLoading && groups.data.length > 0) && <Pagination setPage={setPage} meta={groups?.meta} links={groups?.links} />}
              </div>

          </div>


        <ViewGroupModal isOpen={isOpen} closeViewModal={closeViewModal} group={group} />
        <DeleteGroupModal isOpen={deleteModalOpen} closeModal={closeDeleteModal} group={group} refetch={refetch} />
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



const GroupItem = ({group, openDeleteModal, openViewModal}) => {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-all gap-3">
            <div className="flex-1 flex flex-col md:flex-row  items-center gap-2">
                <div className="avatar avatar-placeholder">
                    {group.avatar && (<div className="bg-gray-400 dark:bg-gray-700 rounded-full overflow-hidden w-12 h-12 flex items-center justify-center text-gray-800 dark:text-gray-100">
                        <img src={`${group.avatar}`} className="w-full" />
                    </div>)}
                    {!group.avatar && (
                        <div className="bg-gray-400 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center text-gray-800 dark:text-gray-100">
                            <UserGroupIcon className="w-6 h-6" />
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-base truncate font-semibold text-gray-800 dark:text-gray-100">
                        {group.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{group.members_count} members</p>
                </div>
            </div>

            <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                Admin:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-100">
                    {group.admin.name}
                </span>
            </p>
            <div className="flex flex-wrap gap-2 text-sm justify-center">

                <button onClick={() => openViewModal(group)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <EyeIcon className='w-4 h-4' />
                </button>
                <Link href={route('group.edit', group)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                    <PencilIcon className='w-4 h-4' />
                </Link>
                <button onClick={() => openDeleteModal(group)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                    <TrashIcon className='w-4 h-4' />
                </button>
                <Link href={route('group.member.add', group)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    <PlusCircleIcon className='w-4 h-4' />
                </Link>
            </div>
        </div>
    )
}

const GroupItemSkeleton = () => {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-pulse">
            <div className="flex-1 flex flex-col md:flex-row items-center gap-2">

                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>

                <div className="space-y-2 w-full md:w-40">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
            </div>

            <div className="w-40 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>

            <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
        </div>
    )
}

const GroupEmpty = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                <UserGroupIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                No Groups Found
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                You haven’t created or joined any groups yet.
            </p>
        </div>
    )
}