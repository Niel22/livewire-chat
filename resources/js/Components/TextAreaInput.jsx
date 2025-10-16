import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextAreaInput(
    { className = '', isFocused = false, ...props },
    ref,
) {
    

    useEffect(() => {
        if (isFocused) {
            ref.current?.focus();
        }
    }, [isFocused, ref]);

    return (
        <textarea
            {...props}
            className={
                'rounded-md border-gray-300 text-gray-800 dark:text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ' +
                className
            }
            ref={ref}
        ></textarea>
    );
});
