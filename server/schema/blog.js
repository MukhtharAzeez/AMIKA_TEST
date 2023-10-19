const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        required: true
    }
},{
    timeStamp: true
})

const blog = mongoose.model('blog', schema)

module.exports = blog
        