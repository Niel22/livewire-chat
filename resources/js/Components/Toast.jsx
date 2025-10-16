import { toastStore } from '@/store/toastStore';
import React, { useEffect } from 'react'

const Toast = () => {
    const { message, type, show, hideToast } = toastStore();

    useEffect(() => {
        if (show) {
        const timer = setTimeout(() => hideToast(), 3000);
            return () => clearTimeout(timer);
        }
    }, [show, hideToast]);

    if (!show) return null;


  return (
    <div
      className={`
        fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white z-70
        ${type === "success" ? "bg-green-500" : "bg-red-500"}
      `}
    >
      {message}
    </div>
  )
}

export default Toast
