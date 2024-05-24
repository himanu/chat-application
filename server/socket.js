const { saveMessage, updateMessageStatus, markMessageSeen } = require("./services/message.service");

const user_socker_mapper = {};

const socketHandler = (socket, io) => {
    const user = socket.user;
    console.log("Connected user", user.email);
    user_socker_mapper[user.id] = socket.id
    console.log(user_socker_mapper);

    // Listen for chat message
    socket.on("messageSent", async (msg) => {
        console.log("new message sent ", msg);
        const pending_message_id = msg.pending_message_id;
        // save message to db
        const  { id, timestamp } = await saveMessage(msg);
        console.log("message saved in db");
        // notify sender about save
        const {text, sender_id, recipient_id} = msg;
        socket.emit("messageSaved", {
            pending_message_id,
            id,
            timestamp,
            recipient_id,
            sender_id,
            text
        })
        // nofify reciever
        if (user_socker_mapper[recipient_id]) {
            const recipient_socket_id = user_socker_mapper[recipient_id];
            io.to(recipient_socket_id).emit("recieveMessage", {
                text,
                sender_id,
                timestamp,
                id,
                status: "sent"
            })
        }
    });

    // listen for successful message delivery
    socket.on("messageDelivered", async (msg) => {
        // update message
        console.log("message has been delivered to recipient ", msg);
        const {
            text,
            sender_id,
            timestamp,
            recipient_id,
            id,
        } = msg;
        await updateMessageStatus(id, "delivered");
        console.log("maked the message as delivered");
        console.log("sender_socket" ,user_socker_mapper[sender_id]);
        if (user_socker_mapper[sender_id]) {
            // notify sender about msg delivery
            console.log("notifying the sender about delivery");
            io.to(user_socker_mapper[sender_id]).emit("msgDelivered", {
                recipient_id,
                message_id: id,
                text,
                sender_id,
                timestamp
            })
        }
    })

    socket.on("markMessageAsSeen", async (msg) => {
        const { sender_id, recipient_id } = msg;
        console.log("someone has seen their msgs", msg);
        const documentIds = await markMessageSeen(sender_id, recipient_id);
        console.log("event sender socket id ", user_socker_mapper[sender_id]);
        io.to(user_socker_mapper[sender_id]).emit("messageSeen", {
            messageIds: documentIds,
            user_id: recipient_id
        })
    })
    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected");
        delete user_socker_mapper[user.id]
    });
}

module.exports = socketHandler;