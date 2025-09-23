import { useTranslation } from "react-i18next";
import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";

export default function DeleteUserForm({ className = "" }) {
    const { t } = useTranslation('profile');
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                    {t('deleteAccount')}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t('deleteAccountWarning')}
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                {t('deleteAccount')}
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form
                    onSubmit={deleteUser}
                    className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
                >
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                        {t('deleteAccountConfirmation')}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {t('deleteAccountPasswordPrompt')}
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value={t('password')}
                            className="sr-only dark:text-gray-200"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1 block w-3/4 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                            isFocused
                            placeholder={t('password')}
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2 text-red-600 dark:text-red-400"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton
                            type="button"
                            className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                            onClick={closeModal}
                        >
                            {t('cancel')}
                        </SecondaryButton>

                        <DangerButton
                            type="submit"
                            className="bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-500 hover:bg-red-700"
                            disabled={processing}
                        >
                            {t('deleteAccount')}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
