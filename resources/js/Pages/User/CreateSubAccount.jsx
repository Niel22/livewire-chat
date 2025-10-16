import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import { Transition } from '@headlessui/react'
import { Head, Link } from '@inertiajs/react'
import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateSubAccount } from '@/query/useUserQuery'
import { subAccountSchema } from '@/request/userRequest'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'

const CreateSubAccount = ({ staffs }) => {
  const createSubAccountMutation = useCreateSubAccount();
        
  const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: joiResolver(subAccountSchema),
  });

  const handleCreateSubAccount = (data) => createSubAccountMutation.mutate(data);

  return (
    <>
      <Head title="Create Sub Account" />
      <div className="py-12 overflow-auto">
        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
          <div className="dark:bg-gray-800 bg-white p-4 shadow sm:rounded-lg sm:p-8">
            <section className="dark:bg-gray-800 bg-white">
              <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                  Create Sub Account
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Add a new sub account by filling in the information below.
                </p>
              </header>

              <form onSubmit={handleSubmit(handleCreateSubAccount)} className="mt-6 space-y-6">
                <div>
                  <InputLabel htmlFor="name" value="Name" />
                  <TextInput
                    id="name"
                    className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    {...register("name")}
                    required
                    autoComplete="off"
                  />
                  <InputError className="mt-2 dark:text-red-400" message={errors.name?.message} />
                </div>

                <div>
                  <InputLabel htmlFor="staff_id" value="Select Staff" />
                  <select
                    id="staff_id"
                    {...register("staff_id")}
                    className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 rounded-md border-gray-300 focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">-- Select Staff --</option>
                    {staffs.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                  <InputError className="mt-2 dark:text-red-400" message={errors.staff_id?.message} />
                </div>

                <div className="flex items-center gap-4">
                  <PrimaryButton disabled={createSubAccountMutation.isPending}>Create Sub Account</PrimaryButton>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

CreateSubAccount.layout = (page) => (
  <AuthenticatedLayout
    header={
      <div className='w-full flex justify-between items-center'>
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Create Sub Account
        </h2>
        <Link href={route('user.list')} className='py-3 px-4 bg-gray-50 text-slate-900 rounded-md text-sm'>
          Back
        </Link>
      </div>
    }
    children={page}
  />
)

export default CreateSubAccount
