export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent 
                bg-blue-600 dark:bg-white 
                text-white dark:text-gray-800 
                px-4 py-2 text-xs font-semibold uppercase tracking-widest 
                transition duration-150 ease-in-out 
                hover:bg-blue-700 dark:hover:bg-gray-200 
                focus:bg-blue-700 dark:focus:bg-gray-300 
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
                active:bg-blue-800 dark:active:bg-gray-400  ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
