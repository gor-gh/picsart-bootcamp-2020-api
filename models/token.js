const mongoose = require('mongoose');
const { Schema } = mongoose;
const tokenSchema = new Schema({
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    });
module.exports = mongoose.model("Token", tokenSchema);