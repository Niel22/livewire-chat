import { useEventBus } from '@/EventBus';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import UserAvatar from './UserAvatar';
import { Link } from '@inertiajs/react';

const NewMessageNotification = ({message}) => {

    const [toasts, setToasts] = useState([]);
    const {on} = useEventBus();

    useEffect(() => {
        const unsubscribe = on('newMessageNotification', ({ message, user, group_id, conversation_id }) => {
            const uuid = uuidv4();

            setToasts((prev) => [...prev, { message, uuid, user, group_id, conversation_id }]);

            setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.uuid !== uuid));
            }, 5000);
        });

        return unsubscribe;
    }, [on]);

  return (
    <div className='toast toast-top toast-center min-w-[280px]'>
        {toasts?.map((toast, index) => (
            <div key={toast.uuid} className="alert alert-success px-4 py-3 text-gray-100 rounded-md  ">
                <Link className='flex items-center gap-2 justify-start' href={toast.group_id ? route('chat.group', toast.group_id) : route('chat.user', toast.conversation_id)}>
                    <UserAvatar user={toast.user} />
                    <span>{toast.message}</span>
                </Link>
            </div>
        ))}
    </div>
  )
}

export default NewMessageNotification
