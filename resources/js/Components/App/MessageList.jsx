import MessageItem from "./MessageItem";


const MessageList = ({ messages, messageCtrRef, loadMoreIntersect }) => {
  if (!messages?.length) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-lg text-gray-800 dark:text-slate-200">
          No message found
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-white dark:bg-gray-900 transition-colors"
      ref={messageCtrRef}
    >
      <div className="flex-1 flex flex-col">
        <div ref={loadMoreIntersect}></div>
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}

export default MessageList;