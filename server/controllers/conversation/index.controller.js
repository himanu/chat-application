const Messages = require("../../db/models/Messages.model");


const getConversationsController = async (req, res) => {
    try{
        const currentUserId = req.user._id;

        const filter = {$or: [
            {sender_id: currentUserId},
            {recipient_id: currentUserId}
        ]}
        const update = { $set: { status: "delivered"} };
        const messages = await Messages.find(filter).select(['text', 'sender_id', 'recipient_id', 'status', 'timestamp']).exec();
        await Messages.updateMany({recipient_id: currentUserId, status: 'sent'}, update)
        const response = {};
        messages.forEach((message) => {
            const sended_by_you = currentUserId.equals(message.sender_id);
            let user_id = sended_by_you ? message.recipient_id : message.sender_id;
            response[user_id] = response[user_id] || {
                messages: {}, 
                unread_msg_count: 0, 
                user_id: user_id
            };
            if (message.status !== "seen" && !sended_by_you) {
                response[user_id].unread_msg_count += 1; 
            }
            response[user_id].messages[message._id] = {
                sended_by_you,
                status: message.status,
                timestamp: message.timestamp,
                text: message.text
            }
        });
        res.json(response);
    } catch(err) {
        console.log("error message ", err.message);
        res.status(500).send(err.message);
    }
};

module.exports = {getConversationsController};