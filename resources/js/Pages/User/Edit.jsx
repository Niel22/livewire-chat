import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Transition } from '@headlessui/react'
import { Head, Link, useForm } from '@inertiajs/react'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

const Edit = ({ user }) => {
    const queryClient = useQueryClient();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
    })

    const userDetailsForm = useForm({
        name: user.details?.name ?? '',
        date_joined: user.details?.date_joined ?? '',
        payment_method: user.details?.payment_method ?? '',
        email: user.details?.email ?? '',
    });
    
    const userPasswordForm = useForm({
        password: "",
        password_confirmation: ""
    });

    const submitUser = (e) => {
        e.preventDefault()
        queryClient.invalidateQueries(['users']);
        patch(route('user.update', user));
    }

    const submitUserDetails = (e) => {
        e.preventDefault()
        userDetailsForm.patch(route('user.user-details', user))
    }
    
    const submitPasswordDetails = (e) => {
        e.preventDefault();
        userPasswordForm.patch(route('user.password', user))
    }

    return (
        <>
            <Head title="Edit User" />
            <div className="py-12 overflow-auto">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                    {/* Edit User Section */}
                    <div className="dark:bg-gray-800 bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                                    Edit User
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Update this user’s basic information.
                                </p>
                            </header>

                            <form onSubmit={submitUser} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-2 dark:text-red-400" message={errors.name} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email (readonly)" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                                        value={data.email}
                                        readOnly
                                    />
                                    <InputError className="mt-2 dark:text-red-400" message={errors.email} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="role" value="Role" />
                                    <select
                                        id="role" readOnly disabled
                                        className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 border-gray-300 rounded-md"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="staff">Staff</option>
                                        <option value="sub_account">Sub Account</option>
                                    </select>
                                    <InputError className="mt-2 dark:text-red-400" message={errors.role} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Save Changes</PrimaryButton>
                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
                                    </Transition>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* User Details Section */}
                    {user.role === 'member' && (
                        <div className="dark:bg-gray-800 bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <section>
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                                        User Details
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Save extra information for this user. Stored in a separate table.
                                    </p>
                                </header>

                                <form onSubmit={submitUserDetails} className="mt-6 space-y-6">
                                    <div>
                                        <InputLabel htmlFor="name" value="Name" />
                                        <TextInput
                                            id="name"
                                            className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                            value={userDetailsForm.data.name}
                                            onChange={(e) => userDetailsForm.setData('name', e.target.value)}
                                        />
                                        <InputError className="mt-2 dark:text-red-400" message={userDetailsForm.errors.name} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="date_joined" value="Date Joined" />
                                        <TextInput
                                            id="date_joined"
                                            type="date"
                                            className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                            value={userDetailsForm.data.date_joined}
                                            onChange={(e) => userDetailsForm.setData('date_joined', e.target.value)}
                                        />
                                        <InputError className="mt-2 dark:text-red-400" message={userDetailsForm.errors.date_joined} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="payment_method" value="Payment Method" />
                                        <TextInput
                                            id="payment_method"
                                            className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                            value={userDetailsForm.data.payment_method}
                                            onChange={(e) => userDetailsForm.setData('payment_method', e.target.value)}
                                        />
                                        <InputError className="mt-2 dark:text-red-400" message={userDetailsForm.errors.payment_method} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="email" value="Email" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                            value={userDetailsForm.data.email}
                                            onChange={(e) => userDetailsForm.setData('email', e.target.value)}
                                        />
                                        <InputError className="mt-2 dark:text-red-400" message={userDetailsForm.errors.email} />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <PrimaryButton disabled={userDetailsForm.processing}>Save Details</PrimaryButton>
                                        <Transition
                                            show={userDetailsForm.recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
                                        </Transition>
                                    </div>
                                </form>
                            </section>
                        </div>
                    )}

                    <div className="dark:bg-gray-800 bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                                    {user.role === 'member' ? "Client" : "Staff"} Password
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Change Cients Password.
                                </p>
                            </header>

                            <form onSubmit={submitPasswordDetails} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="Password" value="Password" />
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        value={userPasswordForm.password}
                                        onChange={(e) => userPasswordForm.setData('password', e.target.value)}
                                    />
                                    <InputError className="mt-2 dark:text-red-400" message={userPasswordForm.errors.password} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="Comfirm Password" value="Comfirm Password" />
                                    <TextInput
                                        id="payment_method"
                                        className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        value={userPasswordForm.password_confirmation}
                                        onChange={(e) => userPasswordForm.setData('password_confirmation', e.target.value)}
                                    />
                                    <InputError className="mt-2 dark:text-red-400" message={userPasswordForm.errors.password_confirmation} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={userPasswordForm.processing}>Save Details</PrimaryButton>
                                    <Transition
                                        show={userPasswordForm.recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
                                    </Transition>
                                </div>
                            </form>
                        </section>
                    </div>

                </div>
            </div>
        </>
    )
}

Edit.layout = (page) => (
    <AuthenticatedLayout
        header={
            <div className="w-full flex justify-between items-center">
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Edit User
                </h2>
                <Link href={route('user.list')} className="py-3 px-4 bg-gray-50 text-slate-900 rounded-md text-sm">
                    Back
                </Link>
            </div>
        }
        children={page}
    />
)

export default Edit
