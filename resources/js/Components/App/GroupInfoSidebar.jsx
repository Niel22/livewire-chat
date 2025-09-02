import { UserGroupIcon, XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import UserAvatar from "./UserAvatar";

const GroupInfoSidebar = ({ sidebarOpen, setSidebarOpen, group }) => {
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
                            Group Info
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
                            <div className="bg-gray-400 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center text-gray-800 dark:text-gray-100">
                                <UserGroupIcon className="w-12 h-12" />
                            </div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                                {group.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Group · {group.members + 1} Members
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-1">
                                Group Info
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {group.description}.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-2">
                                {group.members + 1} Participants
                            </h3>
                            <div className="space-y-3">
                                <div
                                    key={
                                        group.admin.id + group.admin.updated_at
                                    }
                                    className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-3 rounded-lg shadow-sm"
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
                                        Admin
                                    </span>
                                </div>
                                {group.membersList?.map((member) => (
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
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-600">
                        <button className="w-full py-2 px-3 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm font-medium cursor-pointer">
                            Exit Group
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupInfoSidebar;
