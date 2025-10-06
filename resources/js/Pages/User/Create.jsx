import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Transition } from '@headlessui/react'
import { Head, Link, useForm } from '@inertiajs/react'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

const Create = () => {
  const queryClient = useQueryClient();
  const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
    name: '',
    email: '',
    password: ''
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('user.store'));
    queryClient.invalidateQueries(['users']);
  };

  return (
    <>
      <Head title="Create User" />
      <div className="py-12 overflow-auto">
        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
          <div className="dark:bg-gray-800 bg-white p-4 shadow sm:rounded-lg sm:p-8">
            <section className="dark:bg-gray-800 bg-white">
              <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                  Create New Staff
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Add a new staff by filling in the information below.
                </p>
              </header>

              <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                  <InputLabel htmlFor="name" value="Name" />
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

                <div>
                  <InputLabel htmlFor="email" value="Email" />
                  <TextInput
                    id="email"
                    type="email"
                    className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                    autoComplete="off"
                  />
                  <InputError className="mt-2 dark:text-red-400" message={errors.email} />
                </div>

                <div>
                  <InputLabel htmlFor="password" value="Password" />
                  <TextInput
                    id="password"
                    type="password"
                    className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <InputError className="mt-2 dark:text-red-400" message={errors.password} />
                </div>

                <div className="flex items-center gap-4">
                  <PrimaryButton disabled={processing}>Create User</PrimaryButton>
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
  return (
    <AuthenticatedLayout
      header={
        <div className='w-full flex justify-between items-center'>
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Create User
          </h2>
          <Link href={route('user.list')} className='py-3 px-4 bg-gray-50 text-slate-900 rounded-md text-sm'>
            Back
          </Link>
        </div>
      }
      children={page}
    />
  )
}

export default Create
