let mongoose = require('mongoose');


let ChatSchema = new mongoose.Schema({
    room: String,
    nickname: String,
    message: String,
    updated_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Chat', ChatSchema);