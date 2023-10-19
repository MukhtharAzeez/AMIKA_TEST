const mongoose = require('mongoose')

module.exports = {
    connect : () => {
        mongoose.connect('mongodb://localhost:27017/blogApplication', {})
        .then(()=>{
            console.log("MongoDB is connected")
        })
        .catch(()=>{
            console.log("Error in MongoDB connection")
        })
    }
}