import { FaceSmileIcon, HandThumbUpIcon, PaperAirplaneIcon, PaperClipIcon, PhotoIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react'
import NewMessageInput from './NewMessageInput';
import axios from 'axios';

const MessageInput = ({conversation = null}) => {

  const [newMessage, setNewMessage] = useState("");
  const [inputErrorMessage, setInputErrorMessage] = useState  ("");
  const [messageSending, setMessageSending] = useState("");

  const onSendClick = () => {
    if(newMessage.trim() === ""){
      setInputErrorMessage("Please type in a message or upload attachment");

      setTimeout(() => {
        setInputErrorMessage("");
      }, 3000)
      return;
    }

    if(messageSending){
      return;
    }

    setMessageSending(true);

    const formData = new FormData();
    formData.append("message", newMessage);

    if(!conversation.is_group) {
      formData.append('conversation_id', conversation.id)
      formData.append('receiver_id', conversation.receiver_id)
    }else if(conversation.is_group){
      formData.append('group_id', conversation.id)
    }

    axios.post(route('message.store'), formData, {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );

        console.log(progress);
      }
    }).then((response) => {
      setNewMessage("");
      setMessageSending(false);
    }).catch((error) => {
      console.log(error);
      setMessageSending(false);
    });
  }

  return (
    <div className='mt-auto flex flex-wrap items-end justify-start z-100 py-3'>
      <div className=" px-3 xs:p-0 min-w-[220px] basis-full flex-1 relative">
        <div className="flex gap-1 items-end px-2 py-1">

          <button className='p-1 text-gray-400 hover:text-gray-300'>
            <FaceSmileIcon className='w-6 h-6' />
          </button>

          <NewMessageInput
            value={newMessage}
            onSend={onSendClick}
            onChange={(e) => setNewMessage(e.target.value)}
          />

          <button className="p-1 text-gray-400 hover:text-gray-300 relative">
            <PaperClipIcon className='w-6' />
            <input type="file" multiple className='absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer' />
          </button>

          <button className="p-1 text-gray-400 hover:text-gray-300 cursor-pointer relative">
            <PhotoIcon className='w-6' />
            <input type="file" accept='image/*' multiple className='absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer' />
          </button>

          {newMessage ? (
            <button onClick={onSendClick} disabled={messageSending} className='btn btn-info'>
              {messageSending ? (<span className="loading loading-dots loading-md"></span>) : (
                <PaperAirplaneIcon className='w-6' />
              )}
            </button>
          ) : (
            <button disabled={messageSending} className=' btn btn-info p-2'>
              <HandThumbUpIcon className='w-6 h-6' />
            </button>
          )}

        </div>
        
        {inputErrorMessage && (
          <p className='text-xs text-red-400'>{inputErrorMessage}</p>
        )}
      </div>
    </div>
  )
}

export default MessageInput
