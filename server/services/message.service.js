const Messages = require("../db/models/Messages.model");

const messageServices = {
    async saveMessage(msg) {
        const {text, sender_id, recipient_id} = msg;
        const message = new Messages({
            recipient_id,
            sender_id,
            text,
            timestamp: new Date(),
            status: "sent"
        })
        const savedMessage = await message.save();
        return {
            id: savedMessage._id,
            timestamp: savedMessage.timestamp,
        };
    },

    // update message as delivered
    async updateMessageStatus(id, status) {
        const message = await Messages.findById(id);
        message.status = status;
        await message.save();
    },

    // 
    async markMessageSeen(sender_id, recipient_id) {
        try {
            const filter = { sender_id, recipient_id };
            const update = { $set: { status: "seen"} };
        
            // Directly get the updated documents with their IDs
            const result = await Messages.updateMany(filter, update);
        
            const updatedIds = result.modifiedCount > 0
                ? await Messages.find(filter).select('_id').exec()
                : [];
            // console.log("Updated", updatedDocuments.length, "documents.");
            // const updatedDocumentIds = updatedDocuments.map(doc => doc._id);
            // console.log("IDs of updated documents:", updatedDocumentIds);

            return updatedIds.map(({_id}) => _id);
        } catch (error) {
          console.error('Error updating records:', error);
        }
    }
}
module.exports = messageServices;