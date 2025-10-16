import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextAreaInput from '@/Components/TextAreaInput'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useUpdateGroup } from '@/query/useGroupQuery'
import { groupSchema } from '@/request/groupRequest'
import { Transition } from '@headlessui/react'
import { joiResolver } from '@hookform/resolvers/joi'
import { Head, Link } from '@inertiajs/react'
import { useForm } from 'react-hook-form'

const Edit = ({group, staffs}) => {
    
    const updateGroupMutation = useUpdateGroup();
        
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(groupSchema),
        defaultValues: {
            name: group.name,
            description: group.description,
            admin_id: group.admin_id,
            avatar: null,
            member: group.member,
        }
    });

    const handleUpdateGroup = (data) => {

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('member', data.member);
        formData.append('admin_id', data.admin_id);
        formData.append('_method', "PATCH");
        
        if (data.avatar && data.avatar.length > 0) {
            formData.append('avatar', data.avatar[0]);
        }

        updateGroupMutation.mutate({
            id: group.id,
            payload: formData
        });
    }

    // const { data, setData, post, errors, processing, recentlySuccessful } =
    //     useForm({
    //         name: group.name,
    //         description: group.description,
    //         admin_id: group.admin_id,
    //         avatar: null,
    //         member: group.member,
    //         _method: "PATCH"
    //     });

    // const submit = (e) => {
    //     e.preventDefault();
    //     post(route('group.update', group));
    //     queryClient.invalidateQueries(['groups']);

    // };

  return (
    <>
        <Head title="Edit Group" />
        
        <div className="py-12 overflow-auto">
            <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                <div className="dark:bg-gray-800 bg-white p-4 shadow sm:rounded-lg sm:p-8">
                    <section className="dark:bg-gray-800 bg-white">
                        <header>
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                                Edit Group
                            </h2>

                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Update group by filling in the information below.
                            </p>
                        </header>

                        <form onSubmit={handleSubmit(handleUpdateGroup)} className="mt-6 space-y-6">

                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-200 dark:ring-slate-700 shadow-md">
                                    <img src={`/storage/${group.avatar}`} alt="Group" className="w-full h-full object-cover" />
                                </div>
                            </div>
        
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
                                    {...register("avatar")}
                                />
        
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Please upload a square picture (1:1 ratio works best)
                                </p>
        
                                <InputError className="mt-2 dark:text-red-400" message={errors.avatar?.message} />
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="name" value="Group Name" />

                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    {...register("name")}
                                    required
                                    autoComplete="off"
                                />

                                <InputError className="mt-2 dark:text-red-400" message={errors.name?.message} />
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel htmlFor="description" value="Description" />

                                <TextAreaInput
                                    id="description"
                                    className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    {...register("description")}
                                    required
                                    rows={4}
                                />

                                <InputError className="mt-2 dark:text-red-400" message={errors.description?.message} />
                            </div>

                            {/* Admin Select */}
                            <div>
                                <InputLabel htmlFor="admin" value="Select Admin" />
                                <select
                                    id="admin"
                                    {...register("admin_id")}
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
                                    {...register("member")}
                                    required
                                    type="number"
                                    autoComplete="off"
                                />

                                <InputError className="mt-2 dark:text-red-400" message={errors.name} />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={updateGroupMutation.isPending}>Update Group</PrimaryButton>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    </>
  )
}

Edit.layout = (page) => {
    return <AuthenticatedLayout
            header={
                <div className='w-full flex justify-between items-center'>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Edit Group
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

export default Edit
