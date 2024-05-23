import { useState } from "react";
import ChatArea from "./ChatSection";
import Sidebar from "./Sidebar";
import WelcomePage from "./Welcome";

const ChatHome = () => {
  // stores id of selected user
  const [selectedChat, setSelectedChat] = useState(null);
    return (
        <div className="flex">
          <div className={`bg-gray-100 w-full lg:w-[30%] md:w-[40%] h-screen p-4 md:flex flex-col ${selectedChat !== null && "hidden"}`}>
            <Sidebar
              selectedChat={selectedChat} 
              setSelectedChat={setSelectedChat} 
            />
          </div>
    
          <div className={`grow md:flex ${selectedChat === null && "hidden"} h-screen`}>
            {selectedChat !== null ? <ChatArea selectedChat={selectedChat} setSelectedChat={setSelectedChat} /> : <WelcomePage />}
          </div>
        </div>
    );
}

export default ChatHome;