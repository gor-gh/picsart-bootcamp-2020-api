const mongoose = require('mongoose');
const { Schema } = mongoose;
const teamSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    topic: {
        type: Schema.Types.ObjectID,
        ref: "Topic"
    },
    project: {
        type: Schema.Types.ObjectID,
        ref: "Project"
    },
    members: {
        type: [Schema.Types.ObjectID],
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("Team", teamSchema)