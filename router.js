const express = require("express")
const { dorayaki_get, dorayaki_post, dorayaki_put, dorayaki_delete, dorayaki_get_specific } = require("./controller/dorayaki")
const { autentikasi, register, login } = require("./controller/member")
const { toko_dorayaki_get, toko_dorayaki_get_specific, toko_dorayaki_post, toko_dorayaki_put, toko_dorayaki_delete } = require("./controller/toko-dorayaki")
var bodyParser = require("body-parser")
const path = require("path")
const jsonParser = bodyParser.json()
const formParser = bodyParser.urlencoded()
const router = express.Router()
const multer = require("multer")
const upload = multer({
    storage : multer.diskStorage({
        destination : (req, file, cb)=> {
            cb(null, path.join(__dirname,'gambar'))
        },
        filename : (req,file,cb)=>{
            cb(null, new Date().getTime().toString()+'-'+file.originalname)
        }
    }),
    fileFilter : (req, file, cb) => {
        if(
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ){
            cb(null, true)
        }else{
            cb(null,false)
        }
    }
})

router.get("/dorayaki", dorayaki_get)
router.get("/dorayaki/:id", dorayaki_get_specific)
router.post("/dorayaki", upload.single('gambar'), dorayaki_post)
router.put("/dorayaki/:id", jsonParser, dorayaki_put)
router.delete("/dorayaki/:id", dorayaki_delete)

router.get("/auth", autentikasi)
router.post("/daftar", register)
router.post("/masuk", login)

router.get("/toko", toko_dorayaki_get)
router.get("/toko/:id", toko_dorayaki_get_specific)
router.post("/toko",jsonParser, toko_dorayaki_post)
router.put("/toko/:id",jsonParser, toko_dorayaki_put)
router.delete("/toko/:id", toko_dorayaki_delete)


router.get("/cok",(req,res,next)=>{
    res.send({
        halo : 'aselolee cokkk'
    })
})
module.exports= router