import { useEventBus } from '@/EventBus';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Toast = ({message}) => {

    const [toasts, setToasts] = useState([]);
    const {on} = useEventBus();

    useEffect(() => {
        on('toast.show', (message) => {
            const uuid = uuidv4();

            setToasts((prev) => {
                return [
                    ...prev,
                    {message, uuid}
                ];
            })

            setTimeout(() => {
                setToasts((prev) => {
                    return prev.filter((toast) => toast.uuid !== uuid);
                });
            }, 5000);
        })
    },[on])

  return (
    <div className='toast toast-top toast-center min-w-[280px]'>
        {toasts?.map((toast, index) => (
            <div key={toast.uuid} className="alert alert-success px-4 py-3 text-gray-100 rounded-md  ">
                <span>{toast.message}</span>
            </div>
        ))}
    </div>
  )
}

export default Toast
