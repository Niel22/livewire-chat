import { forwardRef, useEffect } from 'react'

export default forwardRef(function TextInput(
  { type = 'text', className = '', isFocused = false, ...props },
  ref
) {
  useEffect(() => {
    if (isFocused && ref?.current) {
      ref.current.focus()
    }
  }, [isFocused, ref])

  return (
    <input
      {...props}
      type={type}
      className={
        'rounded-md border-gray-300 text-gray-800 dark:text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ' +
        className
      }
      ref={ref}
    />
  )
})
