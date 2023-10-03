"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { MessageInput } from "@/components/chat/message-input";
import { Message } from "@/components/chat/message";
import { NewChatModal } from "@/components/chat/new-chat-modal";
import { DeleteChatModal } from "@/components/chat/delete-chat-modal";
import { Chats } from "@/components/chat/chats";
import SignOut from "@/components/sign-out";
import LoadingDots from "@/components/loading-dots";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [fetchInProgress, setFetchInProgress] = useState(false);
  const [loading, setLoading] = useState(false); // bot response
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchChats = useCallback(async () => {
    const response = await fetch("/api/auth/chats");
    const data = await response.json();
    setChats(data.chats);
    if (data.chats.length == 0) setIsModalOpen(true);
  }, []);

  const fetchConversation = useCallback(async (chatId) => {
    setFetchInProgress(true);
    await axios
      .post("/api/auth/conversation", { chatId })
      .then((response) => {
        console.log(response.data.conversition);
        setConversation(
          response.data.conversition.map((message) => ({
            text: message.text,
            type: message.isFromBot ? "bot" : "user",
            time: new Date(message.createdAt),
          }))
        );
        setFetchInProgress(false);
      })
      .catch((error) => {
        setFetchInProgress(false);
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (chats.length > 0) {
      setCurrentChat(chats[0]);
    }
  }, [chats]);

  useEffect(() => {
    if (currentChat.id != null) {
      fetchConversation(currentChat.id);
    }
  }, [currentChat.id, fetchConversation]);

  const addMessage = (message, type) => {
    setConversation((prevMessages) => [...prevMessages, { text: message, type: type, time: new Date() }]);
  };

  const getBotResponse = async (message) => {
    setLoading(true);
    await axios
      .post("/api/auth/new-message", { query: message, chatId: currentChat.id })
      .then((response) => {
        console.log(response.data);
        addMessage(response.data.queryResponse, "bot");
        setLoading(false);
      })
      .catch((error) => {
        addMessage("An error occurred while fetching the response.", "error");
        console.log(error);
        setLoading(false);
      });
  };

  const Conversation = ({ conversation }) => {
    const conversationEndRef = useRef(null);

    // still fetching the conversation
    if (fetchInProgress)
      return (
        <div className="flex flex-col flex-grow h-0 p-4 overflow-auto mx-auto">
          <LoadingDots />
        </div>
      );

    useEffect(() => {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [conversation.length]);

    return (
      <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
        {conversation.length == 0 && (
          <>
            <div className="text-center opacity-30">New chat, enter your inquiry in the textbox.</div>
          </>
        )}
        {conversation.map((message, index) => (
          <Message message={message} index={index} />
        ))}

        {loading && (
          <div className="chat chat-start flex-col w-full mt-2 max-w-xs">
            <div className={`chat-bubble chat-bubble-primary`}>
              <LoadingDots color="#fff" />
            </div>
          </div>
        )}

        <div ref={conversationEndRef} />
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-50 text-gray-800 p-10 bg-pattern">
        <div className="flex flex-col flex-grow w-full max-w-xl shadow-xl rounded overflow-hidden card bg-base-100">
          <div className="navbar  bg-primary text-primary-content">
            <div className="flex-1">
              <a className="btn btn-ghost normal-case text-xl">Medical ChatBot</a>
            </div>
            <div className="flex items-center content-center justify-center gap-2">
              <SignOut />
            </div>
          </div>
          <div className="navbar bg-gray-50 border-b">
            <div className="navbar-start">
              <a className="btn btn-ghost normal-case text-xl">
                {!currentChat.id ? (
                  <LoadingDots />
                ) : (
                  <>
                    {currentChat.title} <DeleteChatModal fetchChats={fetchChats} converstion={currentChat} />
                  </>
                )}
              </a>
            </div>
            <div className="navbar-center"></div>
            <div className="navbar-end">
              <Chats chats={chats} currentChat={currentChat} setCurrentChat={setCurrentChat} />
              <NewChatModal fetchChats={fetchChats} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
            </div>
          </div>

          <Conversation conversation={conversation} />
          <MessageInput message={message} setMessage={setMessage} addMessage={addMessage} getBotResponse={getBotResponse} />
        </div>
      </div>
    </>
  );
}
