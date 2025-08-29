import React, { useEffect, useRef } from 'react'

const NewMessageInput = ({value, onChange, onSend}) => {
    const input = useRef();

    const onInputKeyDown = (e) => {
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            onSend();
        }
    }

    const onChangeEvent = (e) => {
        setTimeout(() => {
            adjustHeight();
        }, 10);
        onChange(e);
    }

    const adjustHeight= () => {
        setTimeout(() => {
            input.current.style.height = "auto";
            input.current.style.height = input.current.scrollHeight + 1 + "px";
        }, 100);
    }

    useEffect(() => {
        adjustHeight();
    }, [value]);

  return (
    <textarea
        ref={input}
        value={value}
        rows="1"
        placeholder='Type a message'
        onKeyDown={onInputKeyDown}
        onChange={(e) => onChangeEvent(e)}
        autoCorrect='off'
        autoComplete='off'
        autoSave='off'
        autoFocus
        className='hide-scrollbar input border-none border-transparent bg-transparent outline-none shadow-none w-full focus:outline-none resize-none overflow-y-auto max-h-40'
    >
    </textarea>
  )
}

export default NewMessageInput
