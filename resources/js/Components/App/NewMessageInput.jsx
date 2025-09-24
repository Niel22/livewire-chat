import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next';

const NewMessageInput = ({value, onChange, onSend, onPaste}) => {
    const { t } = useTranslation('convo');
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
        placeholder={t('typeMessage')}
        onKeyDown={onInputKeyDown}
        onChange={(e) => onChangeEvent(e)}
        autoCorrect='off'
        autoComplete='off'
        // onFocus={() => setFocusClass("mb-0")}
        // onBlur={() => setFocusClass("mb-14")}
        autoSave='off'
        data-gramm="false"
        data-gramm_editor="false"
        onPaste={onPaste}
        autoFocus
        className='hide-scrollbar input border-none bg-transparent outline-none shadow-none flex-1 min-w-0 max-w-full text-[16px] focus:outline-none resize-none overflow-y-auto max-h-40 -webkit-text-size-adjust-100'
    >
    </textarea>
  )
}

export default NewMessageInput
