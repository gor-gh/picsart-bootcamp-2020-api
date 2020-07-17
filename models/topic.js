const mongoose = require('mongoose');
const {Schema} = mongoose;

const topicSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    votes: {
        type: [String],
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("Topic", topicSchema);