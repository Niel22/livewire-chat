import TranslationWidget from '@/Components/App/TranslationWidget';
import ApplicationLogo from '@/Components/ApplicationLogo';
import DarkModeToggle from '@/Components/DarkModeToggle';
import { Link } from '@inertiajs/react';
import { Translation, useTranslation } from 'react-i18next';

export default function GuestLayout({ children }) {
    const { t } = useTranslation();
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 dark:bg-gray-900 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 md:h-40 w-auto fill-current text-gray-500 dark:text-gray-400" />
                </Link>
                <div className='flex items-center justify-between'>
                    <DarkModeToggle />
                    <TranslationWidget />
                </div>
            </div>

            <div className="mt-6 w-[90%] overflow-hidden bg-green dark:bg-gray-800 px-6 py-4 shadow-md dark:shadow-gray-700 sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>

    );
}
