const mongoose = require('mongoose');
const { Schema } = mongoose;
const {hash} = require('../helpers/hashPassword');
const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    birthDate: {
       type: String,
       maxlength: 10,
       minlength: 10,
       required: true
    },
    sex: {
        type: String,
        lowercase: true,
        required: true
    },
    avatarUrl: {
        type: String,
        required: true
    },
    jsExperience: {
        type: Number,
        required: true,
        min: 0
    },
    reactExperience: {
        type: Number,
        required: true,
        min: 0
    },
    companyId: {
        type: Number,

    }
});

userSchema.pre('save', function (next) {
    let user = this;
    user.password = hash(user.password);
    next();
})

module.exports = mongoose.model("User", userSchema);