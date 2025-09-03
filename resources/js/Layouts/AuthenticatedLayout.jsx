import NewMessageNotification from '@/Components/App/NewMessageNotification';
import Toast from '@/Components/App/Toast';
import ApplicationLogo from '@/Components/ApplicationLogo';
import DarkModeToggle from '@/Components/DarkModeToggle';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { useEventBus } from '@/EventBus';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);
    
    const page = usePage();
    const user = page.props.auth.user;
    const conversations = page.props.conversations;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const {emit} = useEventBus();


    useEffect(() => {
        conversations.forEach((conversation) => {
            let channel = `message.group.${conversation.id}`;

            if(!conversation.is_group){
                channel = `message.user.${[
                    parseInt(user.id),
                    parseInt(conversation.receiver_id)
                ].sort((a, b) => a - b).join("-")}`
            }

            Echo.private(channel)
                .error((error) => {
                    console.log(error);
                })
                .listen("SocketMessage", (e) => {
                    const message = e.message;
                    
                    emit("message.created", message);
                    if(message.sender_id === user.id){
                        return;
                    }

                    emit('newMessageNotification', {
                        user: message.sender,
                        conversation_id: message.conversation_id,
                        group_id: message.group_id,
                        message: message.message || `Shared ${
                            message.attachments.length === 1 ? "an attachment" : `${message.attachments.length + " attachments"}`
                        }`
                    });
                })
                .listen("SocketDeleteMessage", (e) => {
                    const { message, prevMessage } = e;
                    emit("message.deleted", { message, prevMessage });
                })
                .listen('SocketMessagePinned', (e) => {
                    emit('message.pinned', e.message);
                });
            
            Echo.private(`group.${conversation.id}`)
                .listen('SocketGroupLocked', (e) => {
                    emit('group.locked', e.group);
                });
        });

        return () => {
            conversations.forEach((conversation) => {
                let channel = `message.group.${conversation.id}`;

                if(!conversation.is_group){
                    channel = `message.user.${[
                        parseInt(user.id),
                        parseInt(conversation.receiver_id)
                    ].sort((a, b) => a - b).join("-")}`
                }

                Echo.leave(channel);
            });
        }
    }, [conversations]);



    return (
        <>
            <div className="min-h-100vh sm:min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col h-screen">
                <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-lg">
                    <div className="mx-auto max-w-[90%] px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex shrink-0 items-center">
                                    <Link href="/">
                                        <ApplicationLogo className="block w-20 h-auto fill-current text-gray-800 dark:text-gray-200" />
                                    </Link>
                                </div>

                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route('dashboard')}
                                        active={route().current('dashboard')}
                                        className="text-gray-700 dark:text-gray-200"
                                    >
                                        Dashboard
                                    </NavLink>
                                    <NavLink
                                        href={route('group.list')}
                                        active={route().current('group.list')}
                                        className="text-gray-700 dark:text-gray-200"
                                    >
                                        Groups
                                    </NavLink>
                                    <NavLink
                                        href={route('user.list')}
                                        active={route().current('user.list')}
                                        className="text-gray-700 dark:text-gray-200"
                                    >
                                        Users
                                    </NavLink>
                                </div>
                            </div>

                            <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                <DarkModeToggle />
                                <div className="relative ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium leading-4 text-gray-500 dark:text-gray-300 transition duration-150 ease-in-out hover:text-gray-700 dark:hover:text-gray-100 focus:outline-none"
                                                >
                                                    {user.name}

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content className="dark:bg-gray-700 dark:text-gray-200">
                                            <Dropdown.Link
                                                href={route('profile.edit')}
                                                
                                                
                                            >
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="-me-2 flex items-center sm:hidden">
                                <DarkModeToggle />
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState
                                        )
                                    }
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-100 focus:outline-none"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            className={
                                                !showingNavigationDropdown
                                                    ? 'inline-flex'
                                                    : 'hidden'
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={
                                                showingNavigationDropdown
                                                    ? 'inline-flex'
                                                    : 'hidden'
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                {showingNavigationDropdown && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setShowingNavigationDropdown(false)}
                    />
                    )}

                    <div
                        className={
                            "fixed top-0 right-0 h-full w-[75%] sm:w-[30%] bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 " +
                            (showingNavigationDropdown ? "translate-x-0" : "translate-x-full")
                        }
                    >
                        
                    <div className="space-y-1 pb-3 pt-4 px-4">
                        <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                            {user.name}
                        </div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {user.email}
                        </div>
                    </div>

                    {/* Divider with user info */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pb-4 pt-4">
                        

                        <div className="mt-3 space-y-1 px-4">
                            <ResponsiveNavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                                className="block text-gray-700 dark:text-gray-200"
                                >
                                Dashboard
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('group.list')}
                                active={route().current('group.list')}
                                className="block text-gray-700 dark:text-gray-200"
                                >
                                Group
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('profile.edit')}
                                active={route().current('profile.edit')}
                                className="block text-gray-700 dark:text-gray-200"
                            >
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="block text-gray-700 hover:bg-red-300 dark:hover:bg-red-500 dark:text-gray-200"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                    </div>


                </nav>

                {header && (
                    <header className="bg-white dark:bg-gray-800 shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {children}
            </div>
            <Toast />
            <NewMessageNotification />
        </>

    );
}
