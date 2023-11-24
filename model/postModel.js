const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postModel = new Schema({
    userId: {
        type: String,
        allowNull: false,
    },
    title: {
        type: String,
        allowNull: false,
    },
    subject: {
        type: String,
        allowNull: false,
    },
    summary: {
        type: String,
        allowNull: false,
    },
    image: {
        type: String,
        allowNull: false,
    },
    youtubeLink: {
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

module.exports = mongoose.model('post', postModel);