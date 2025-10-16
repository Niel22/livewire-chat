import Checkbox from '@/Components/Checkbox';
import DarkModeToggle from '@/Components/DarkModeToggle';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { useLogin } from '@/query/useAuthQuery';
import { loginSchema } from '@/request/authRequest';
import { joiResolver } from '@hookform/resolvers/joi';
import { Head, Link } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export default function Login({ status, canResetPassword }) {
    const { t } = useTranslation("login");

    const loginMutation = useLogin();
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(loginSchema),
    });

    const handleRegister = (data) => loginMutation.mutate(data);

    return (
        <GuestLayout>
            <Head title={t("title")} />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                    {t("status_success")}
                </div>
            )}

            <form onSubmit={handleSubmit(handleRegister)}>
                <div>
                    <InputLabel htmlFor="email" value={t("email")} className="dark:text-gray-200" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        {...register("email")}
                        className="mt-1 block w-full bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                        autoComplete="username"
                        isFocused={true}
                    />
                    <InputError message={errors.email?.message} className="mt-2 dark:text-red-400" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value={t("password")} className="dark:text-gray-200" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        {...register("password")}
                        className="mt-1 block w-full bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                        autoComplete="current-password"
                    />
                    <InputError message={errors.password?.message} className="mt-2 dark:text-red-400" />
                </div>


                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 dark:text-gray-300 underline hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {t("forgot_password")}
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={loginMutation.isPending}>
                        {t("login")}
                    </PrimaryButton>
                </div>

                <div className="flex items-center justify-center mt-5">
                    <Link
                        href={route('register')}
                        className="rounded-md text-sm text-gray-600 dark:text-gray-300 underline hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {t("no_account")}
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
