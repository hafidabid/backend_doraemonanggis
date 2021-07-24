const mongoose = require("mongoose")
const Skema = mongoose.Schema

const Dorayaki = new Skema({
    rasa : {
        type : String,
        required : true
    },
    deskripsi : {
        type : String,
        required : true
    },
    gambar : {
        type : String,
        default : "gambar/default-dorayaki.jpg"
    },
},{
    timestamps : true
})

module.exports = mongoose.model('Dorayaki', Dorayaki)