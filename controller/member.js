const Member = require("../model/member")
const CryptoJS = require("crypto-js");

const encrypt = (text) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};

const decrypt = (data) => {
  return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
};

const login = (req, res, next) => {

}

const register = async(req,res, next) => {
    const {username, password, nama} = req.body
    if(username == null || password == null || nama == null){
        throw {
            status : 400,
            message : "username, password, nama tidak boleh null"
        }
    }

    const cariUsername = await Dorayaki.countDocuments({username : username.toLowerCase()}).exec()
    if(cariUsername > 0){
        throw {
            status :  403,
            message : "username telah dipakai"
        }
    }

    const dataJeson = {
        username : username.toLowerCase(),
        expire_token : ''
    }

    const newMember = new Member({
        username : username.toLowerCase(),
        password : encrypt(password),
        nama : nama,
        active_token : ''
    })

    newMember.save()
    .then(hasil => {
        res.status(200).json({
            message :"user dengan id: " + username.toLowerCase()+" berhasil dibuat",
            data : hasil
        })
    }).catch(err => {next(err)})
}

const autentikasi = (req,res,next) => {

}

module.exports = {login, register, autentikasi}