import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from "react-i18next";
import myImage from '@/assets/img.png';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const { t } = useTranslation('profile');
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            avatar: null,
            email: user.email,
            _method: "PATCH"
        });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'));
        e.target.files = [];
    };

    return (
        <section className={`dark:bg-gray-800 bg-white` + className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                    {t('profileInformation')}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t('updateProfileInfo')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-200 dark:ring-slate-700 shadow-md">
                            <img src={user.avatar ?? myImage} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <InputLabel htmlFor="avatar" value={t('profilePicture')} className="text-gray-700 dark:text-gray-200 font-medium" />

                        <label
                            htmlFor="avatar"
                            className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-lg shadow cursor-pointer transition hover:bg-blue-700 dark:hover:bg-gray-200"
                        >
                            {t('uploadNewPicture')}
                        </label>

                        <input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setData('avatar', e.target.files[0])}
                        />

                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t('pictureHint')}</p>

                        <InputError className="mt-2 dark:text-red-400" message={errors.avatar} />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="name" value={t('name')} />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2 dark:text-red-400" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value={t('email')} />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2 dark:text-red-400" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            {t('emailUnverified')}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 dark:text-gray-300 underline hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {t('resendVerification')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                {t('verificationSent')}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>{t('save')}</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('saved')}</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
