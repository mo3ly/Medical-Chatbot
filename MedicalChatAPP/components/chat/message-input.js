import React, { useRef, useState, useEffect } from "react";

export const MessageInput = ({ setMessage, message, getBotResponse, addMessage }) => {
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (message.length == 0) return;
    setIsApiCallInProgress(true);

    addMessage(message, "user");
    setMessage("");

    // await new Promise((resolve) => setTimeout(resolve, 500));

    await getBotResponse(message);

    setIsApiCallInProgress(false);
  };

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <input disabled={isApiCallInProgress} ref={inputRef} value={message} type="text" onChange={(e) => setMessage(e.target.value)} placeholder="Type your message…" className="block w-full p-5 pl-10 text-sm text-gray-900 border-t border-gray-300 rounded-b bg-gray-50 focus:outline-none focus:shadow-outline" />
        <button type="submit" disabled={isApiCallInProgress} className="text-white absolute right-3.5 bottom-3.5  btn-sm btn btn-square">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </form>
  );
};
