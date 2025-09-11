import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextAreaInput from '@/Components/TextAreaInput'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Transition } from '@headlessui/react'
import { Head, Link, useForm } from '@inertiajs/react'
import React from 'react'

const Create = ({staffs}) => {

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: '',
            description: '',
            member: '',
            admin_id: staffs.length > 0 ? staffs[0].id : null,
            avatar: null
        });

    const submit = (e) => {
        e.preventDefault();

        post(route('group.store'));
    };

  return (
    <>
        <Head title="Create Group" />
        
        <div className="py-12 overflow-auto">
            <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                <div className="dark:bg-gray-800 bg-white p-4 shadow sm:rounded-lg sm:p-8">
                    <section className="dark:bg-gray-800 bg-white">
                        <header>
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                                Create New Group
                            </h2>

                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Add a new group by filling in the information below.
                            </p>
                        </header>

                        <form onSubmit={submit} className="mt-6 space-y-6">        
                            <div className="flex-1">
                                <InputLabel htmlFor="avatar" value="Group Picture" className="text-gray-700 dark:text-gray-200 font-medium" />
        
                                <label
                                    htmlFor="avatar"
                                    className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-lg shadow cursor-pointer transition hover:bg-blue-700 dark:hover:bg-gray-200"
                                >
                                    Upload Group Picture
                                </label>
        
                                <input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setData('avatar', e.target.files[0])}
                                />
        
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Please upload a square picture (1:1 ratio works best)
                                </p>
        
                                <InputError className="mt-2 dark:text-red-400" message={errors.avatar} />
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="name" value="Group Name" />

                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="off"
                                />

                                <InputError className="mt-2 dark:text-red-400" message={errors.name} />
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel htmlFor="description" value="Description" />

                                <TextAreaInput
                                    id="description"
                                    className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                    rows={4}
                                />

                                <InputError className="mt-2 dark:text-red-400" message={errors.description} />
                            </div>

                            {/* Admin Select */}
                            <div>
                                <InputLabel htmlFor="admin" value="Select Admin" />
                                <select
                                    id="admin"
                                    value={data.admin_id}
                                    onChange={(e) => setData('admin_id', e.target.value)}
                                    className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 rounded-md border-gray-300 focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    {staffs.map((staff) => (
                                        <option key={staff.id} value={staff.id}>
                                            {staff.name}
                                        </option>
                                    ))}
                                </select>

                                <InputError className="mt-2 dark:text-red-400" message={errors.admin_id} />
                            </div>

                            <div>
                                <InputLabel htmlFor="member" value="Group Members Number" />

                                <TextInput
                                    id="member"
                                    className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    value={data.member}
                                    onChange={(e) => setData('member', e.target.value)}
                                    required
                                    type="number"
                                    autoComplete="off"
                                />

                                <InputError className="mt-2 dark:text-red-400" message={errors.name} />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Create Group</PrimaryButton>

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
            </div>
        </div>
    </>
  )
}

Create.layout = (page) => {
    return <AuthenticatedLayout
            header={
                <div className='w-full flex justify-between items-center'>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Create Group
                    </h2>
                    <Link href={route('group.list')} className='py-3 px-4 bg-gray-50 text-slate-900 rounded-md text-sm'>
                        Back
                    </Link>
                </div>
            }
            children={page}
        >
        </AuthenticatedLayout>
}

export default Create
