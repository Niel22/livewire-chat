import DeleteUserModal from "@/Components/App/DeleteUserModal";
import UserAvatar from "@/Components/App/UserAvatar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Head, Link, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

const List = ({ users }) => {

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
                <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
                    {users?.data.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 gap-2 flex flex-col justify-center items-center"
                        >
                            {user.avatar && (
                                <div className={`chat-image avatar w-20 mx-auto`}>
                                    <div className={`rounded-full`}>
                                        <img src={user.avatar} />
                                    </div>
                                </div>
                            )}
                            {!user.avatar && (
                                <div
                                    className={`chat-image avatar avatar-placeholder w-20 mx-auto`}
                                >
                                    <div
                                        className={`rounded-full w-20
                                bg-gray-400 text-gray-800 
                                dark:bg-gray-700 dark:text-gray-100`}
                                    >
                                        <span className="text-2xl">
                                            {user.name.substring(0, 1)}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {user.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {user.role || "No role"}
                            </p>

                            <div className="flex flex-wrap gap-2 justify-center">
                                <Link 
                                    href={route('user.show', user)} 
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    View
                                </Link>
                                <Link 
                                    href={route('user.edit', user)} 
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Edit
                                </Link>
                                <button 
                                    onClick={() => handleCreate(user)} 
                                    className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700"
                                >
                                    Message
                                </button>
                                <button 
                                    onClick={() => openDeleteModal(user)} 
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <DeleteUserModal isOpen={deleteModalOpen} closeModal={closeDeleteModal} user={user} />
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
                    <div className="flex items-center justify-between gap-2">
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
