const mongoose = require("mongoose")
const Skema = mongoose.Schema

const Member = new Skema({
    nama : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    active_token : {
        type : String,
        default : ""
    }

},{
    timestamps:true
})

module.exports = mongoose.model('Member',Member)