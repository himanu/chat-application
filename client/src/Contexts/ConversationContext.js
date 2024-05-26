import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";

export const ConversationContext = createContext();


const dummyUsers = {
    2: {
      name: 'Raj',
      id: 2,
    },
    3: {
      name: 'Anshu',
      id: 3,
    },
    4: {
      name: 'Bhavishya',
      id: 4,
    },
    5: {
        name: 'Loku',
        id: 5,
    },
    6: {
        name: 'Bheem',
        id: 6
    }
}
const dummyConversations = {
    2: {
      messages: {
        '1': {
            sended_by_you: false,
            text: 'Hii Himanshu',
            timestamp: 1711029600000,
            status: 'seen'
        },
        '2': {
            sended_by_you: false,
            text: 'Kya kar rha h?',
            timestamp: 123456789,
            status: 'delivered'
        },
        '3': {
            sended_by_you: false,
            text: 'Mar gya kya saale?',
            timestamp: 1711929600000,
            status: 'delivered'
        }
      },
      unread_msg_count: 2,
      user_id: 2
    },
    3: {
      messages: {
        '4': {
            sended_by_you: false,
            text: 'Office jane lag gya?',
            timestamp: 1715970600000,
            status: 'delivered'
          }
      },
      unread_msg_count: 1,
      user_id: 3
    },
    4: {
      messages: {
        5: {
            sended_by_you: true,
            text: 'Hello Bhai',
            timestamp: new Date().getTime(),
            status: 'delivered'
        }
      },
      unread_msg_count: 0,
      user_id: 4
    }
}

export const ConversationContxtProvider = ({children}) => {
    const [users, setUsers] = useState({});
    const [conversations, setConversations] = useState({});
    const [socket, setSocket] = useState("");
    const {user} = useContext(AuthContext);

    const fetchUsers=  async () => {
        const token = localStorage.getItem("token");
        const response =  await fetch(`users`, {
          headers: {
            'Authorization': token
          }
        });
        const users = await response.json();
        // console.log(users);
        setUsers(users);
    };

    const fetchConversations = async () => {
        const token = localStorage.getItem("token");
        const response =  await fetch(`conversations`, {
          headers: {
            'Authorization': token
          }
        });
        const jsonRes = await response.json();
        // console.log(jsonRes);
        setConversations(jsonRes);
    }
    const markConversationAsSeen = (user_id) => {
        // send a request to server to update message status and then update request in local

        socket.emit("markMessageAsSeen", {
            sender_id: user_id,
            recipient_id: user.id
        })
        setConversations((oldConversations) => {
            const updatedConversation = {
                ...oldConversations[user_id],
                unread_msg_count: 0,
            }
            return ({
                ...oldConversations,
                [user_id]: {
                    ...updatedConversation
                }
            })
        })
    };

    const sendMessage = async (message, recipient_id) => {
        const message_id = `${user.id}_${new Date().getTime()}`;
        console.log("message_id ", message_id);
        // add message into pending
        setConversations({
            ...conversations,
            [recipient_id]: {
                ...conversations[recipient_id],
                unread_msg_count: 0,
                pending_messages: {
                    ...conversations[recipient_id]?.pending_messages ?? {},
                    [message_id]: {
                        sended_by_you: true,
                        text: message,
                        timestamp: 1715970600000,
                        status: 'pending'
                    }
                },
                messages: {
                    ...conversations?.[recipient_id]?.messages || {}
                },
                user_id: recipient_id
            }
        })
        // send a messageSent event to server
        socket.emit("messageSent", {
            text: message,
            sender_id: user.id,
            recipient_id,
            pending_message_id: message_id
        })
    };

    useEffect(() => {
        fetchUsers();
        fetchConversations()
    }, []);

    useEffect(() => {
        const socket = io('https://chat-application-o7mr.onrender.com', {
          auth: {
            token: localStorage.getItem("token") || ""
          }
        })
        setSocket(socket);

        socket.on("messageSaved", (data) => {
            const {
                pending_message_id,
                id,
                timestamp,
                recipient_id,
                text
            } = data;
            console.log("messageSaved ", data);
            setConversations((old) => {
                let newState = { ...old };
                newState[recipient_id] = newState[recipient_id] || { messages: {}};
                delete newState[recipient_id].pending_messages[pending_message_id];
                newState[recipient_id].messages[id] = {
                    sended_by_you: true,
                    text,
                    timestamp,
                    status: "sent"
                }
                return newState;
            })
        })

        socket.on("recieveMessage", (data) => {
            const {
                text,
                sender_id,
                timestamp,
                id,
                status
            } = data;
            console.log("recieved message");
            setConversations((old) => {
                let newState = { ...old };
                console.log("old ", old);
                newState[sender_id] = newState[sender_id] || {
                    messages: {}, 
                    unread_msg_count: 0, 
                    user_id: sender_id
                };
                newState[sender_id].messages[id] = {
                    sended_by_you: false,
                    text,
                    timestamp,
                    status
                }
                newState[sender_id].unread_msg_count += 1;
                console.log("new ", newState);
                return newState;
            })
            socket.emit("messageDelivered", {
                ...data,
                recipient_id: user.id
            })
        })

        socket.on("msgDelivered", ({message_id, recipient_id, text, timestamp}) => {
            console.log("should mark messages as delivered now");
            setConversations((old) => {
                let newState = { ...old };
                newState[recipient_id] = newState[recipient_id] || {
                    messages: {}, 
                    unread_msg_count: 0, 
                    user_id: recipient_id
                };
                newState[recipient_id].messages[message_id] = {
                    sended_by_you: true,
                    text,
                    timestamp,
                    status: "delivered"
                }
                return newState;
            })
        })

        socket.on("messageSeen", async (data) => {
            const { messageIds, user_id } = data;
            setConversations((old) => {
                let newState = { ...old };
                messageIds.forEach((message_id) => {
                    newState[user_id].messages[message_id].status = "seen";
                })
                return newState;
            })
        })
      }, [])
    //   console.log("conversations ", conversations);
    return (
        <ConversationContext.Provider
            value={{
                users,
                conversations,
                markConversationAsSeen,
                sendMessage
            }}
        >
            {children}
        </ConversationContext.Provider>
    )
}