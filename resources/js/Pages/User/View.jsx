import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'
import React from 'react'

const View = ({ user }) => {
    return (
        <>
            <Head title="View User" />
            <div className="py-12 overflow-auto">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                    {/* Basic User Info */}
                    <div className="dark:bg-gray-800 bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                                    User Information
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Basic details about this user.
                                </p>
                            </header>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Name</p>
                                    <p className="text-gray-900 dark:text-gray-100">{user.name}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</p>
                                    <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role</p>
                                    <p className="text-gray-900 dark:text-gray-100 capitalize">{user.role}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Extra User Details */}
                    {user.role === 'member' && (
                        <div className="dark:bg-gray-800 bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <section>
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                                        Additional Details
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Extra information stored in a separate table.
                                    </p>
                                </header>

                                <div className="mt-6 space-y-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Name</p>
                                        <p className="text-gray-900 dark:text-gray-100">{user.details?.name ?? '-'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Date Joined</p>
                                        <p className="text-gray-900 dark:text-gray-100">{user.details?.date_joined ?? '-'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Payment Method</p>
                                        <p className="text-gray-900 dark:text-gray-100">{user.details?.payment_method ?? '-'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</p>
                                        <p className="text-gray-900 dark:text-gray-100">{user.details?.email ?? '-'}</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}

View.layout = (page) => (
    <AuthenticatedLayout
        header={
            <div className="w-full flex justify-between items-center">
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    View User
                </h2>
                <Link href={route('user.list')} className="py-3 px-4 bg-gray-50 text-slate-900 rounded-md text-sm">
                    Back
                </Link>
            </div>
        }
        children={page}
    />
)

export default View
