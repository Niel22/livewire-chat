import DeleteScheduleModal from '@/Components/App/DeleteScheduleModal'
import ShowScheduleModal from '@/Components/App/ShowScheduleModal'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextAreaInput from '@/Components/TextAreaInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Transition } from '@headlessui/react'
import { EyeIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Head, Link, router, useForm } from '@inertiajs/react'
import React, { useState } from 'react'

const ScheduleMessage = ({group, scheduled_messages}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const onCloseModal = () => {
        setShowDeleteModal(false);
        setSelectedMessage(null);
    }

    const onConfirmDelete = () => {
        router.delete(route('group.schedule.delete', { group: group.id, schedule_message: selectedMessage.id }), {
            onSuccess: () => onCloseModal(),
        });
    }

    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        message: "",
        attachments: [],
        scheduled_at: ""
    });

    const [previewImages, setPreviewImages] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        const updatedFiles = files.map((file) => ({
            file,
            url: URL.createObjectURL(file)
        }));

        e.target.value = null;

        setPreviewImages((prevFiles) => [...prevFiles, ...updatedFiles]);
        setData('attachments', [...data.attachments, ...files]);
    };

    const removeImage = (index) => {
        const updatedPreviews = previewImages.filter((_, i) => i !== index);
        const updatedFiles = data.attachments.filter((_, i) => i !== index);

        setPreviewImages(updatedPreviews);
        setData('attachments', updatedFiles);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("group.schedule", group), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setPreviewImages([]);
            },
        });
    };


  return (
    <>
        <Head title="Schedule Message" />
        
        <div className="py-12 overflow-auto">
            <div className="mx-auto max-w-3xl space-y-6 sm:px-6 lg:px-8">
                <div className="dark:bg-gray-800 bg-white p-4 shadow sm:rounded-lg sm:p-8 mb-10">
                    <section className="dark:bg-gray-800 bg-white">
                        <header>
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                                Schedule New Message
                            </h2>

                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Write your message, attach images, and select when it should be sent.
                            </p>
                        </header>

                        <form onSubmit={submit} className="mt-6 space-y-6">
                            
                            <div>
                                <InputLabel htmlFor="message" value="Message Body" />

                                <TextAreaInput
                                    id="message"
                                    className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Type your message..."
                                    required
                                    rows={4}
                                />

                                <InputError className="mt-2 dark:text-red-400" message={errors.message} />
                            </div>

                            <div>
                                <InputLabel htmlFor="attachments" value="Attach Images" />
                                <input
                                    type="file"
                                    id="attachments"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-gray-700 dark:file:text-gray-200"
                                />
                                <InputError className="mt-2 dark:text-red-400" message={errors.attachments} />

                                {previewImages.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {previewImages.map((src, index) => (
                                            <div key={index} className="relative rounded overflow-hidden border dark:border-gray-600">
                                                <img
                                                    src={src.url}
                                                    alt={`preview-${index}`}
                                                    className="w-full h-32 object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="scheduled_at" value="Schedule Date & Time" />
                                <input
                                    type="datetime-local"
                                    id="scheduled_at"
                                    value={data.scheduled_at}
                                    onChange={(e) => setData('scheduled_at', e.target.value)}
                                    required
                                    className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 rounded-md border-gray-300 focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <InputError className="mt-2 dark:text-red-400" message={errors.scheduled_at} />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Schedule Message</PrimaryButton>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled.</p>
                                </Transition>
                            </div>
                        </form>
                    </section>
                </div>
            
                <div className="max-w-[90%] mx-auto md:max-w-full mt-10">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">
                        Scheduled Messages
                    </h3>

                    {scheduled_messages.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400">No scheduled messages yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Message</th>
                                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Scheduled At</th>
                                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {scheduled_messages.map((msg) => (
                                <tr key={msg.id} className="border-t border-gray-200 dark:border-gray-700">
                                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 truncate max-w-sm">
                                    {msg.message}
                                </td>
                                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                                    {new Date(msg.scheduled_at).toLocaleString()}
                                </td>
                                <td className="px-4 space-x-3 py-2">
                                    <button
                                        onClick={() => {
                                            setShowViewModal(true);
                                            setSelectedMessage(msg);
                                        }}
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                    <EyeIcon className='w-4' />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(true);
                                            setSelectedMessage(msg);
                                        }}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                    <TrashIcon className='w-4' />
                                    </button>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    )}
                </div>
            </div>


        </div>

        <ShowScheduleModal isOpen={showViewModal} setIsOpen={setShowViewModal} message={selectedMessage} />
        <DeleteScheduleModal onClose={onCloseModal} onConfirm={onConfirmDelete} show={showDeleteModal} selectedMessage={selectedMessage} />
    </>

  )
}

ScheduleMessage.layout = (page) => {
    return <AuthenticatedLayout
            header={
                <div className='w-full flex justify-between items-center'>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Schedule Message
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

export default ScheduleMessage
