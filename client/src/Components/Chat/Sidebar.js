import React, { useContext, useEffect, useState } from 'react';
import { GoSignOut } from "react-icons/go";
import { AuthContext } from '../../Contexts/AuthContext';
import {formatTimestamp, getTick} from './utils';
import { ConversationContext } from '../../Contexts/ConversationContext';


function SlidingTabs({activeTab, setActiveTab}) {
  return (
    <div className="relative mb-1">
      <div className="flex rounded-full overflow-hidden">
        <button
          data-tab="Chats"
          onClick={() => setActiveTab('Chats')}
          className={`px-4 py-2 flex-1 text-sm font-medium rounded-full focus:outline-none ${
            activeTab === 'Chats' ? 'bg-blue-500 text-white' : 'text-gray-500'
          }`}
        >
          Chats
        </button>
        <button
          data-tab="Users"
          onClick={() => setActiveTab('Users')}
          className={`px-4 py-2 flex-1 text-sm font-medium rounded-full focus:outline-none ${
            activeTab === 'Users' ? 'bg-blue-500 text-white' : 'text-gray-500'
          }`}
        >
          Users
        </button>
      </div>
    </div>
  );
}

const UserList = ({users, selectedChat, setSelectedChat}) => {
  return (
    <div className="flex-grow overflow-y-auto">
        {Object.values(users).map((user, index) => (
          <div 
            key={index} 
            className={`flex items-center p-2 mt-2 rounded-md cursor-pointer hover:bg-gray-200 ${selectedChat === user.id ? 'bg-gray-200' : 'bg-white'}`}
            onClick={() => setSelectedChat(user.id)}
          >
            <img 
              src={`https://avatar.iran.liara.run/public?username=${user.name}`} 
              alt={user.name} 
              className="rounded-full w-8 h-8 mr-2" 
            />
            <div className="flex-grow">
              <span className="text-gray-800 font-medium">{user.name}</span>
            </div>
          </div>
        ))}
      </div>
  )
}

const ConversationList = ({conversations, users, setSelectedChat, selectedChat}) => {
  return (
    <div className="flex-grow overflow-y-auto">
        {Object.values(conversations).map((chat, index) => {
          const lastMessage = Object.values(chat?.messages ?? {}).at(-1) ?? "";
          const user = users[chat.user_id];
          if (!user)
              return ""
          return (
            <div 
              key={index} 
              className={`flex items-center p-2 mt-2 rounded-md cursor-pointer hover:bg-gray-200 ${selectedChat === user?.id ? 'bg-gray-200' : 'bg-white'}`}
              onClick={() => setSelectedChat(user.id)}
            >
              <img 
                src={`https://avatar.iran.liara.run/public?username=${user.name}`} 
                alt={chat.name} 
                className="rounded-full w-8 h-8 mr-2" 
              />
              <div className='flex flex-col flex-grow'>
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-medium">{user.name}</span>
                  {chat.unread_msg_count ? <span className="text-white w-5 h-5 text-center text-sm rounded-full bg-blue-500">{chat.unread_msg_count}</span> : ""} 
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm flex items-center">{lastMessage.sended_by_you && getTick(lastMessage?.status ?? '')} {" "} {lastMessage?.text ?? ""}</span>
                  <span className="text-gray-500 text-xs">{formatTimestamp(lastMessage?.timestamp ?? "")}</span>
                </div>
              </div>
            </div>
        )})}
      </div>
  )
};


function Sidebar({selectedChat, setSelectedChat}) {
  const [activeTab, setActiveTab] = useState('Chats');
  const { signOutUser, user } = useContext(AuthContext);
  const { users, conversations } = useContext(ConversationContext);

  return (
    <>
      {/* Profile Information */}
      <div className="flex items-center mb-4" style={{position: "relative"}}>
        <img 
          src={`https://avatar.iran.liara.run/public?username=${user.name}`}
          alt="Your Profile" 
          className="rounded-full w-10 h-10 mr-2" 
        />
        <span className="text-gray-800 font-medium">ChitChat</span>
        <GoSignOut style={{position: "absolute", left: "90%", cursor: "pointer", fontSize: "20px"}} onClick={signOutUser} />
      </div>

      {/* Search Bar */}
      {/* <input 
        type="text" 
        placeholder="Search..." 
        className="border border-gray-300 rounded-md p-2 mb-4"
      /> */}
      
      <SlidingTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      
      {/* Chat List */}
      {activeTab === 'Chats' ? <ConversationList users={users} conversations={conversations} setSelectedChat={setSelectedChat}  selectedChat={selectedChat} /> : <UserList users={users} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />}
      
    </>
  );
}

export default Sidebar;
