const mongoose = require('mongoose');
const { Schema } = mongoose;
const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    votes: {
        type: [String],
        required: true
    },
    isPicked: {
        type: Boolean
    }
})

module.exports = mongoose.model("Project", projectSchema);