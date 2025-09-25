import React from 'react'

const UserAvatar = ({user, online = null, profile = false}) => {
 

    let OnlineClasses = "";

    if (online === true) {
    OnlineClasses = "avatar-online";
    } else if (online === false) {
    OnlineClasses = "avatar-offline";
    }



    const sizeClass = profile ? "w-40" : "w-8";
    
  return (
    <>
        {user.avatar && (
            <div className={`chat-image avatar ${OnlineClasses}`}>
                <div className={`rounded-full ${sizeClass}`}>
                <img src={user.avatar} />
                </div>
            </div>
        )}
        {!user.avatar && (
            <div className={`chat-image avatar avatar-placeholder ${OnlineClasses}`}>
                <div
                className={`rounded-full ${sizeClass}
                    bg-gray-400 text-gray-800 
                    dark:bg-gray-700 dark:text-gray-100`}
                >
                <span className='text-xl'>
                    {user.name.substring(0,1)}
                </span>
                </div>
            </div>
        )}
    </>
  )
}

export default UserAvatar
