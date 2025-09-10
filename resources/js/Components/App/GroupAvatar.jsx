import { UserGroupIcon, UserIcon } from '@heroicons/react/24/solid'
import React from 'react'

const GroupAvatar = ({avatar = null}) => {
  return (
    <>
        {avatar && (
            <div className={`chat-image avatar`}>
                <div className={`rounded-full w-8`}>
                <img src={avatar} />
                </div>
            </div>
        )}
        {!avatar && (<div className="avatar avatar-placeholder">
            <div className="
                bg-gray-400 text-gray-800 rounded-full w-8
                dark:bg-gray-700 dark:text-gray-100
            ">
                <span className="text-xl">
                <UserGroupIcon className="w-4" />
                
                </span>
            </div>
        </div>)}
    </>
  )
}

export default GroupAvatar
