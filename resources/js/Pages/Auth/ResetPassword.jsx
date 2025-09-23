import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function ResetPassword({ token, email }) {
    const { t } = useTranslation("reset_password");

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t("title")} />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value={t("email")} className="dark:text-gray-200" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 dark:text-red-400" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value={t("password")} className="dark:text-gray-200" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 dark:text-red-400" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value={t("confirmPassword")}
                        className="dark:text-gray-200"
                    />

                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 dark:text-red-400"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {t("button")}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
