import React, { useContext, useEffect, useState, useRef } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import {formatTimestamp, getTick} from './utils';
import { ConversationContext } from '../../Contexts/ConversationContext';

function ChatArea({selectedChat, setSelectedChat}) {
  const {users, conversations, markConversationAsSeen, sendMessage} = useContext(ConversationContext);
  const conversation = conversations[selectedChat] ?? {};
  const user = users[selectedChat] ?? {};
  const [newMessage, setNewMessage] = useState('');
  const lastMessageRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      await sendMessage(newMessage, selectedChat);
      scrollToBottom();
      setNewMessage('');
    }
    return false;
  };

  const scrollToBottom = () => lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });


  useEffect(() => {
    setTimeout(() => {
			scrollToBottom();
		}, 100);
  }, []);

  useEffect(() => {
    const messages = Object.values(conversation?.messages ?? {});
    const lastMessage = messages[messages.length - 1]
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer.unobserve(lastMessageRef.current);
        markConversationAsSeen(selectedChat);
      }
    });
    if (lastMessageRef.current && lastMessage && lastMessage?.status !== "seen" && lastMessage.sended_by_you !== true) { 
      observer.observe(lastMessageRef.current);
    }
    return () => lastMessageRef.current && observer.unobserve(lastMessageRef.current);
    
  }, [conversations])

  const messages = [...Object.values(conversation?.messages ?? {}), ...Object.values(conversation?.pending_messages ?? {})];
  return (
    <div className="flex-grow flex flex-col bg-white h-[100%]">
      {/* Chat Header */}
      <div className="flex items-center mb-4 bg-gray-200 p-2">
        <IoMdArrowBack onClick={() => setSelectedChat(null)} className='mr-2 text-lg cursor-pointer' />
        <img 
          src={`https://avatar.iran.liara.run/public?username=${user.name}`} 
          alt={user.name} 
          className="rounded-full w-10 h-10 mr-2" 
        />
        <span className="text-gray-800 font-medium">{user.name}</span>
      </div>

      {/* Message Area */}
      <div className="flex-grow overflow-y-auto p-2">
        {messages?.map((msg, index) => (
          <div 
            key={index} 
            {...index === (messages.length - 1) ? {ref: lastMessageRef} : {}} 
            className={`flex ${msg.sended_by_you ? 'justify-end' : ''}`}
          >
            <div className={`bg-gray-200 rounded-lg p-2 m-1 max-w-xs ${msg.sended_by_you ? 'text-right' : ''}`}>
              <p className="text-sm"> {msg.text}</p>
              <p className="text-xs text-gray-500 flex justify-end gap-1">{formatTimestamp(msg.timestamp ?? "")} {" "} {msg.sended_by_you && getTick(msg?.status ?? '')} </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-2 p-2">
        <form className="flex items-center">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..." 
              className="flex-grow border border-gray-300 rounded-md p-2 mr-2"
            />
            <button 
              onClick={handleSendMessage}
              className="bg-blue-500 text-white rounded-md p-2"
            >
              Send
            </button>
        </form>
      </div>
    </div>
  );
}

export default ChatArea;
