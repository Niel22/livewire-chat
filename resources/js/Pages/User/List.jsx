import DeleteUserModal from "@/Components/App/DeleteUserModal";
import Pagination from "@/Components/App/Pagination";
import UserAvatar from "@/Components/App/UserAvatar";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useFetchAllUsers } from "@/query/useUserQuery";
import { ChatBubbleLeftIcon, EyeIcon, PencilIcon, TrashIcon, UserIcon } from "@heroicons/react/24/solid";
import { Head, Link, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

const List = () => {

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    
    const {data: users, isLoading, refetch} = useFetchAllUsers({page, search});
    

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    const handleCreate = (user) => {
        router.post(route('chat.create', user))
    }

    const openDeleteModal = (user) => {
        setUser(user);
        setDeleteModalOpen(true);
    } 
    
    const closeDeleteModal = () => {
        setUser(null);
        setDeleteModalOpen(false);
    }

    useEffect(() => {
        setDeleteModalOpen(false);
        setUser(null);
    }, [])
    return (
        <>
            <Head title="Users" />

            <div className="py-12 overflow-auto">
                <div className="mx-auto max-w-[80%] md:max-w-5xl space-y-4">
                    <TextInput
                        id="name"
                        className="mt-1 block w-full dark:bg-transparent dark:text-white dark:border-gray-600"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search user by name or role..."
                        required
                        autoComplete="off"
                    />

                    {isLoading ? (
                        [1, 2, 3, 4].map((i) => (<UserItemSkeleton key={i} />))
                    ) : users?.data?.map((user) => (
                        <UserItem user={user} key={user.id} handleCreate={handleCreate} openDeleteModal={openDeleteModal} />
                    ))}
                </div>

                {(!isLoading && users.data.length > 0) && <Pagination setPage={setPage} meta={users?.meta} links={users?.links} />}
            </div>

            <DeleteUserModal isOpen={deleteModalOpen} closeModal={closeDeleteModal} user={user} refetch={refetch} />
        </>
    );
};

List.layout = (page) => {
    return (
        <AuthenticatedLayout
            header={
                <div className="w-full flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Users
                    </h2>
                    <div className="hidden md:flex items-center justify-between gap-2">
                        <Link
                            href={route("user.create")}
                            className="py-3 px-4 bg-gray-50 text-slate-900 rounded-md text-sm"
                            >
                            Create Staff
                        </Link>
                        <Link
                            href={route("user.create-sub")}
                            className="py-3 px-4 bg-gray-50 text-slate-900 rounded-md text-sm"
                            >
                            Create Sub Account
                        </Link>
                    </div>
                </div>
            }
            children={page}
        ></AuthenticatedLayout>
    );
};

export default List;

const UserItem = ({user, handleCreate, openDeleteModal}) => {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-all gap-3">
            
            <div className="flex-1 flex flex-col md:flex-row items-center gap-2">
                {user.avatar && (
                    <div className={`chat-image avatar w-12 mx-auto md:mx-0`}>
                        <div className={`rounded-full`}>
                            <img src={user.avatar} />
                        </div>
                    </div>
                )}
                {!user.avatar && (
                    <div
                        className={`chat-image avatar avatar-placeholder w-12 mx-auto md:mx-0`}
                    >
                        <div
                            className={`rounded-full w-12
                    bg-gray-400 text-gray-800 
                    dark:bg-gray-700 dark:text-gray-100`}
                        >
                            <span className="text-2xl">
                                {user.name.substring(0, 1)}
                            </span>
                        </div>
                    </div>
                )}
                <div className="text-center md:text-left">
                    <h3 className="text-base truncate font-semibold text-gray-800 dark:text-gray-100">
                        {user.name}
                    </h3>
                    <p className="text-sm capitalize font-medium text-gray-500 dark:text-gray-400">
                        {user.role}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm justify-center">
                <Link 
                    href={route('user.show', user)} 
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <EyeIcon className="w-4 h-4" />
                </Link>
                <Link 
                    href={route('user.edit', user)} 
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    <PencilIcon className="w-4 h-4" />
                </Link>
                <button 
                    onClick={() => handleCreate(user)} 
                    className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700"
                >
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => openDeleteModal(user)} 
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}


const UserItemSkeleton = () => {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-pulse">
            
            <div className="flex-1 flex flex-col md:flex-row items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>

                <div className="flex flex-col gap-2 mt-2 md:mt-0">
                    <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm justify-center">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
        </div>
    )
}