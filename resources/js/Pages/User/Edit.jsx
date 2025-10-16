import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useUpdateUser, useUpdateUserDetails, useUpdateUserPassword } from '@/query/useUserQuery'
import { passwordSchema, userDetailsSchema, userSchema } from '@/request/userRequest'
import { Transition } from '@headlessui/react'
import { joiResolver } from '@hookform/resolvers/joi'
import { Head, Link } from '@inertiajs/react'
import { useForm } from 'react-hook-form'

const Edit = ({ user }) => {

    const updateUserMutation = useUpdateUser();
    
    const { register: userRegister, handleSubmit: handleSubmitUpdateUser, formState: { errors: userErrors } } = useForm({
        resolver: joiResolver(userSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            role: user.role,
        }
    });

    const handleUpdateUser = (data) => updateUserMutation.mutate({
        id: user.id,
        payload: data
    });

    const { register: passwordRegister, handleSubmit: handleSubmitUpdatePassword, reset, formState: { errors: passwordErrors } } = useForm({
        resolver: joiResolver(passwordSchema),
    });

    const updateUserPasswordMutation = useUpdateUserPassword(reset);
    const handleUpdatePassword = (data) => updateUserPasswordMutation.mutate({
        id: user.id,
        payload: data
    });

    const { register: userDetailsRegister, handleSubmit: handleSubmitUpdateUserDetails, formState: { errors: userDetailsErrors } } = useForm({
        resolver: joiResolver(userDetailsSchema),
        defaultValues: {
            name: user.details?.name,
            email: user.details?.email,
            date_joined: user.details?.date_joined,
            payment_method: user.details?.payment_method,
        }
    });

    const updateUserDetailsMutation = useUpdateUserDetails();
    const handleUpdateUserDetails = (data) => updateUserDetailsMutation.mutate({
        id: user.id,
        payload: data
    });


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

                            <form onSubmit={handleSubmitUpdateUser(handleUpdateUser)} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        {...userRegister("name")}
                                        required
                                    />
                                    <InputError className="mt-2 dark:text-red-400" message={userErrors.name?.message} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email (readonly)" />
                                    <TextInput
                                        id="user-email"
                                        type="email"
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                                        {...userRegister("email")}
                                        readOnly
                                    />
                                    <InputError className="mt-2 dark:text-red-400" message={userErrors.email?.message} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="role" value="Role" />
                                    <select
                                        id="role" readOnly disabled
                                        className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 border-gray-300 rounded-md"
                                        {...userRegister("role")}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="staff">Staff</option>
                                        <option value="sub_account">Sub Account</option>
                                        <option value="member">Member</option>
                                    </select>
                                    <InputError className="mt-2 dark:text-red-400" message={userErrors.role?.message} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={updateUserMutation.isPending}>Save Changes</PrimaryButton>
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

                                <form onSubmit={handleSubmitUpdateUserDetails(handleUpdateUserDetails)} className="mt-6 space-y-6">
                                    <div>
                                        <InputLabel htmlFor="name" value="Name" />
                                        <TextInput
                                            id="user_name"
                                            className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                            {...userDetailsRegister("name")}
                                        />
                                        <InputError className="mt-2 dark:text-red-400" message={userDetailsErrors.name?.message} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="date_joined" value="Date Joined" />
                                        <TextInput
                                            id="date_joined"
                                            type="date"
                                            className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                            {...userDetailsRegister("date_joined")}
                                        />
                                        <InputError className="mt-2 dark:text-red-400" message={userDetailsErrors.date_joined?.message} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="payment_method" value="Payment Method" />
                                        <TextInput
                                            id="payment_method"
                                            className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                            {...userDetailsRegister("payment_method")}
                                        />
                                        <InputError className="mt-2 dark:text-red-400" message={userDetailsErrors.payment_method?.message} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="email" value="Email" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                            {...userDetailsRegister("email")}
                                        />
                                        <InputError className="mt-2 dark:text-red-400" message={userDetailsErrors.email?.message} />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <PrimaryButton disabled={updateUserMutation.isPending}>Save Details</PrimaryButton>
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

                            <form onSubmit={handleSubmitUpdatePassword(handleUpdatePassword)} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="Password" value="Password" />
                                    <TextInput
                                        id="password"
                                        className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        {...passwordRegister("password")}
                                    />
                                    <InputError className="mt-2 dark:text-red-400" message={passwordErrors.password?.message} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="Comfirm Password" value="Comfirm Password" />
                                    <TextInput
                                        id="password_confirmation"
                                        className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        {...passwordRegister("password_confirmation")}
                                    />
                                    <InputError className="mt-2 dark:text-red-400" message={passwordErrors.password_confirmation?.message} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={updateUserPasswordMutation.isPending}>Save Details</PrimaryButton>
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
