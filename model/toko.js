const mongoose = require("mongoose")
const Skema = mongoose.Schema

const Toko = new Skema({
    nama : {
        type : String,
        required : true
    },
    jalan : {
        type : String,
        required : true
    },
    kecamatan : {
        type : String,
        required : true
    },
    provinsi : {
        type : String,
        required : true
    },
    dorayaki : {
        type : Array,
        default : []
    },

},{
    timestamps:true
})

module.exports = mongoose.model('Toko', Toko)