import { TrashIcon, UserGroupIcon, XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import UserAvatar from "./UserAvatar";
import { router } from "@inertiajs/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { useTranslation } from "react-i18next";

const GroupInfoSidebar = ({ sidebarOpen, setSidebarOpen, group, isAdmin }) => {
    const { t } = useTranslation('convo');
    
    const handleRemoveMember = (member) => {
        router.patch(route('group.member.remove', {group: group, user: member}));
    }
    
    const handleExitGroup = () => {
        router.patch(route('group.member.exit', group));
    }

    return (
        <div
            className="fixed inset-0 z-40 flex transition-opacity duration-300"
            style={{
                pointerEvents: sidebarOpen ? "auto" : "none",
                opacity: sidebarOpen ? 1 : 0,
            }}
        >
            <div
                className="fixed inset-0 bg-black bg-opacity-30 z-40"
                onClick={() => setSidebarOpen(false)}
            />

            {group.is_group && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`ml-auto w-full md:max-w-md h-full bg-white dark:bg-slate-900 shadow-lg flex flex-col transform ease-in-out transition-transform duration-300 z-50 ${
                        sidebarOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <div className="flex border-b border-slate-600 shadow-sm py-5 px-6 justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            {t('groupInfo')}
                        </h2>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-600 dark:text-gray-300 hover:text-red-500"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 p-6">
                        <div className="flex flex-col items-center text-center gap-2">
                            {group.avatar && (<div className="bg-gray-400 dark:bg-gray-700 rounded-full overflow-hidden w-24 h-24 flex items-center justify-center text-gray-800 dark:text-gray-100">
                                <img src={group.avatar} className="w-full" />
                            </div>)}
                            {!group.avatar && (<div className="bg-gray-400 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center text-gray-800 dark:text-gray-100">
                                <UserGroupIcon className="w-12 h-12" />
                            </div>)}
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                                {group.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t('group')} · {group.members + 1} {t('members')}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-1">
                                {t('groupInfo')}
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        a: ({node, ...props}) => (
                                            <a 
                                            {...props} 
                                            className="text-blue-500 underline hover:text-blue-700"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            />
                                        ),
                                    }}
                                >{group.description || "" }</ReactMarkdown>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-2">
                                {parseInt(group.member) + 1} {t('participants')}
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.post(route('chat.create', group.admin))}
                                    key={
                                        group.admin.id + group.admin.updated_at
                                    }
                                    className="flex w-full items-center justify-between bg-gray-50 dark:bg-slate-800 p-3 rounded-lg shadow-sm"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <UserAvatar user={group.admin} />
                                        <div className="overflow-hidden">
                                            <h6 className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                                                {group.admin.name}
                                            </h6>
                                        </div>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-100">
                                        {t('admin')}
                                    </span>
                                </button>
                                { isAdmin() &&
                                    group.membersList?.map((member) => (
                                        <div
                                            key={member.id + member.updated_at}
                                            className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-3 rounded-lg shadow-sm"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <UserAvatar user={member} />
                                                <div className="overflow-hidden">
                                                    <h6 className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                                                        {member.name}
                                                    </h6>
                                                </div>
                                            </div>
                                            <button onClick={() => handleRemoveMember(member)} className="p-3 hover:bg-red-50/20 rounded-full">
                                                <TrashIcon className="w-4 text-red-500" />
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-600">
                        <button onClick={() => handleExitGroup()} className="w-full py-2 px-3 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm font-medium cursor-pointer">
                            {t('exitGroup')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupInfoSidebar;
