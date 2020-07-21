const mongoose = require('mongoose');
const { Schema } = mongoose;
const teamSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    topic: {
        type: String
    },
    project: {
        type: String
    },
    members: {
        type: [Schema.Types.ObjectID],
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("Team", teamSchema)