import { FaceSmileIcon, HandThumbUpIcon, PaperAirplaneIcon, PaperClipIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import React, { useEffect, useState } from 'react'
import NewMessageInput from './NewMessageInput';
import axios from 'axios';
import EmojiPicker, { Emoji } from 'emoji-picker-react';
import { isAudio, isImage } from '@/helpers';
import CustomAudioPlayer from './CustomAudioPlayer';
import AttachmentPreview from './AttachmentPreview';
import { useEventBus } from '@/EventBus';

const MessageInput = ({conversation = null}) => {

  const [newMessage, setNewMessage] = useState("");
  const [inputErrorMessage, setInputErrorMessage] = useState  ("");
  const [messageSending, setMessageSending] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [chosenFiles, setChosenFiles] = useState([]);
  const {emit} = useEventBus();

  const onFileChange = (e) => {
    const files = e.target.files;

    const updatedFiles = [...files].map((file) => {
      return {
        file: file,
        url: URL.createObjectURL(file)
      };
    });

    e.target.value = null;

    setChosenFiles((prevFiles) => {
      console.log(prevFiles);
      const nextFiles = [...prevFiles, ...updatedFiles];
      return nextFiles;
    });

  }

  const onSendClick = () => {
    if(newMessage.trim() === "" && chosenFiles?.length === 0){
      onLikeClick();
      return;
    }

    if(messageSending){
      return;
    }

    setMessageSending(true);

    const formData = new FormData();
    chosenFiles.forEach((file) => {
      formData.append('attachments[]', file.file);
    });
    formData.append("message", newMessage);

    if(!conversation.is_group) {
      formData.append('conversation_id', conversation.id)
      formData.append('receiver_id', conversation.receiver_id)
    }else if(conversation.is_group){
      formData.append('group_id', conversation.id)
    }

    sendRequest(formData);

  }

  const onLikeClick = () => {
    emit('toast.show', 'Message sent successfully');
    if(messageSending){
      return;
    }

    setMessageSending(true);
    
    const formData = new FormData();
    formData.append("message", "👍");



    if(!conversation.is_group) {
      formData.append('conversation_id', conversation.id)
      formData.append('receiver_id', conversation.receiver_id)
    }else if(conversation.is_group){
      formData.append('group_id', conversation.id)
    }

    sendRequest(formData);
  }

  const sendRequest = (data) => {
    axios.post(route('message.store'), data, {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setUploadProgress(progress)

      }
    }).then((response) => {
      setNewMessage('');
      setMessageSending(false);
      setUploadProgress(0);
      setChosenFiles([]);
    }).catch((error) => {
      setMessageSending(false);
      setChosenFiles([]);
      const message = error.response?.data?.message;
      setInputErrorMessage(
        message || "An error occured while sending message"
      );
    });
  }

  return (
    <div className=' mt-auto flex flex-wrap items-end justify-start z-100 py-3'>
      <div className=" px-3 xs:p-0 min-w-[220px] basis-full flex-1 relative">

        {chosenFiles?.length > 0 && !!uploadProgress && (
          <progress className='progress progress-info w-full' value={uploadProgress} max="100" />
        )}

        <div className='flex flex-nowrap gap-1 px-2 py-2'>
          {chosenFiles?.map((file) => (
            <div key={file.file.name} className={`relative flex justify-between cursor-pointer ` + (!isImage(file.file) ? " w-[240px]" : "")}>

              {isImage(file.file) && (
                <img src={file.url} alt="" className='w-16 h-16 object-cover' />
              )}

              {isAudio(file.file) && (
                <CustomAudioPlayer file={file} showVolume={false} />
              )}

              {!isAudio(file.file) && !isImage(file.file) && (
                <AttachmentPreview file={file} />
              )}

              <button onClick={ () => 
                setChosenFiles(
                  chosenFiles.filter(
                    (f) => f.file.name !== file.file.name
                  )
                )
              } className='absolute w-6 h-6 rounded-full bg-gray-800 -right-2 -top-2 text-gray-300 hover:text-gray-100 z-10'>
                <XCircleIcon className='w-6' />
              </button>
            </div>
          ))}
        </div>

        {/* <EmojiPicker /> */}
        <div className="border dark:border-slate-700 border-slate-300 shadow-md mx-2 rounded-full flex gap-1 items-end px-4 py-2">

          <Popover className="relative">
            <PopoverButton className="p-1 focus:outline-none focus:border-none text-gray-400 hover:text-gray-300">
              <FaceSmileIcon className='w-6 h-6' />
            </PopoverButton>
            <PopoverPanel className="absolute z-10 left-0 bottom-full">
              <EmojiPicker theme='dark' onEmojiClick={e => setNewMessage(newMessage + e.emoji)} />
            </PopoverPanel>
          </Popover>

          <NewMessageInput
            value={newMessage}
            onSend={onSendClick}
            onChange={(e) => setNewMessage(e.target.value)}
          />

          <button className="p-1 text-gray-400 hover:text-gray-300 relative">
            <PaperClipIcon className='w-6' />
            <input type="file" onChange={onFileChange} multiple className='absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer' />
          </button>

          <button className="p-1 text-gray-400 hover:text-gray-300 cursor-pointer relative">
            <PhotoIcon className='w-6' />
            <input type="file" onChange={onFileChange} accept='image/*' multiple className='absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer' />
          </button>

          {newMessage || chosenFiles?.length > 0 ? (
            <button onClick={onSendClick} disabled={messageSending} className='btn btn-info'>
              {messageSending ? (<span className="loading loading-dots loading-md"></span>) : (
                <PaperAirplaneIcon className='w-6' />
              )}
            </button>
          ) : (
            <button disabled={messageSending} className=' btn btn-info p-2'>
              <HandThumbUpIcon onClick={onLikeClick} className='w-6 h-6' />
            </button>
          )}

        </div>
        
        {inputErrorMessage && (
          <p className='text-xs text-center text-red-400'>{inputErrorMessage}</p>
        )}
      </div>
    </div>
  )
}

export default MessageInput
