import AddMemberSelect from '@/Components/App/AddMemberSelect'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid'
import { Head, Link, router } from '@inertiajs/react'
import React, { useState } from 'react'


const AddMember = ({group, members}) => {
    const [selectedMembers, setSelectedMembers] = useState([])

    const handleSubmit = (e) => {
        e.preventDefault()

        router.post(route("group.member.store", group), {
            members: selectedMembers
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedMembers([]);
            },
        });
    }

  return (
    <>
        <Head title="Add Members" />
        <div className="py-12 overflow-auto">
            <div className="mx-auto max-w-3xl space-y-6 sm:px-6 lg:px-8">
            <div className="dark:bg-gray-800 bg-white p-4 shadow sm:rounded-lg sm:p-8 mb-10">
                <section>
                <header>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                    Add Members to Group: <span className='font-bold'>{group.name}</span>
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Select one or more members to add to this group.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div>
                        <InputLabel htmlFor="members" value="Select Members" />
                        <AddMemberSelect selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers} members={members} />
                    </div>

                    <div className="flex items-center gap-4">
                    <PrimaryButton type="submit">Add Members</PrimaryButton>
                    </div>
                </form>
                </section>
            </div>
            </div>
        </div>
    </>
  )
}

AddMember.layout = (page) => {
    return <AuthenticatedLayout
            header={
                <div className='w-full flex justify-between items-center'>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Add Member
                    </h2>
                    <Link href={route('dashboard')} className='py-3 px-4 bg-gray-50 text-slate-900 rounded-md text-sm'>
                        Back
                    </Link>
                </div>
            }
            children={page}
        >
        </AuthenticatedLayout>
}

export default AddMember
