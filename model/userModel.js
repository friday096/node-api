const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
    nickname: {
        type: String,
        allowNull: false,
        unique: true
    },
    firstname: {
        type: String,
        allowNull: false,
    },
    lastname: {
        type: String,
        allowNull: false,
    },
    email: {
        type: String,
        allowNull: false,
        unique: true
    },
    password: {
        type: String
    },
    jwtToken: {
        type: String
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1 // 1 active, 0 deleted
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('user', userModel);