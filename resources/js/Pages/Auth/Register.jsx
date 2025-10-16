import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { useRegister } from '@/query/useAuthQuery';
import { registerSchema } from '@/request/authRequest';
import { Head, Link } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { joiResolver } from "@hookform/resolvers/joi";

export default function Register() {
    const { t } = useTranslation("register");

    const registerMutation = useRegister();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(registerSchema),
    });


    const handleRegister = (data) => registerMutation.mutate(data);

    return (
        <GuestLayout>
            <Head title={t("title")} />

            <form onSubmit={handleSubmit(handleRegister)} noValidate>
                <div>
                    <InputLabel htmlFor="name" value={t("name")} className="dark:text-gray-200" />
                    <TextInput
                        id="name"
                        name="name"
                        {...register("name")}
                        className="mt-1 block w-full bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                        autoComplete="name"
                        isFocused={true}
                        required
                    />
                    <InputError message={errors.name?.message} className="mt-2 dark:text-red-400" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value={t("email")} className="dark:text-gray-200" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        {...register("email")}
                        className="mt-1 block w-full bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                        autoComplete="username"
                        required
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
                        autoComplete="new-password"
                        required
                    />
                    <InputError message={errors.password?.message} className="mt-2 dark:text-red-400" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value={t("confirm_password")}
                        className="dark:text-gray-200"
                    />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        {...register("password_confirmation")}
                        className="mt-1 block w-full bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                        autoComplete="new-password"
                        required
                    />
                    <InputError message={errors.password_confirmation?.message} className="mt-2 dark:text-red-400" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 dark:text-gray-300 underline hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {t("already_registered")}
                    </Link>

                    <PrimaryButton type="submit" className="ms-4" disabled={registerMutation.isPending}>
                        {t("register")}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
