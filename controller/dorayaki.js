const Dorayaki = require("../model/dorayaki")
const path = require("path")
const fs = require("fs")
const dorayaki_get = async(req, res, next) => {
    //Cek Query
    Dorayaki.find()
    .then(hasil => {
        res.status(200).json({
            message : '',
            data : hasil
        })
    }).catch(err=>{next(err)})
}

const dorayaki_get_specific = async(req,res,next)=> {
    //Cek ID dan Ambil data dari monggo
    const idDorayaki = req.params.id
    if(idDorayaki==null){
        throw{
            errorStatus : 404,
            message : "id dorayaki kosong gan",
            data : {}
        }
    }
    Dorayaki.findById(idDorayaki)
    .then(result => {
        if(!result){
            const e = new Error("id tidak ditemukan")
            e.errorStatus = 404
            next(e)
        }

        res.status(200).json({
            message : "ambil Dorayaki dengan id "+idDorayaki+" berhasil",
            data : result
        })
    }).catch(err => {
        next(err)
    })
}

const dorayaki_post = async(req, res, next) => {
    const {deskripsi, rasa} = req.body
    if(deskripsi == null || rasa == null){
        throw {
            errorStatus : 400, 
            message : "harus ada deskripsi dan rasa di parameter",
            data : req.body
        }
    }
    if(deskripsi.length < 10 || rasa.length < 3){
        throw {
            errorStatus : 400,
            message : "panjang deskripsi harus min 10 char dan rasa min 3 char",
            data : {
                deskripsi : deskripsi.length,
                rasa : rasa.length
            }
        }
    }
    //mencari apakah ada rasa yang sama sebelumnya
    const cariRasa = await Dorayaki.countDocuments({rasa : rasa.toLowerCase()}).exec()
    if(cariRasa>0){
        //console.log("asuuu")
        const e = new Error('rasa dorayaki udah ada sebelumnya')
        e.errorStatus = 400
        e.data = {}
        next(e)
    }else{
        let flname
        if(req.file == null){
            flname = 'gambar/default-dorayaki.jpg'
        }else{
            flname = 'gambar/'+req.file.filename
        }

        //Memasukkan data ke monggo db
        const dorayakiBaru = new Dorayaki({
            rasa : rasa.toLowerCase(),
            deskripsi : deskripsi,
            gambar : flname,
        })
        dorayakiBaru.save()
        .then(hasil => {
            res.status(201).json({
                message : "Jenis Dorayaki Baru Berhasil ditambahkan",
                result : hasil
            })
            next()
        })
        .catch(err => {
            throw {
                errorStatus : 500,
                message : "gagal input ke mongodb",
                data : err,
            }
        })
    }

    
    
}

const dorayaki_put = (req, res, next) => {
    //Cek dan ambil data di monggo DB
    const idDorayaki = req.params.id
    const {deskripsi, rasa} = req.body
    if(idDorayaki==null){
        throw{
            errorStatus : 404,
            message : "id dorayaki kosong gan",
            data : {}
        }
    }
    Dorayaki.findById(idDorayaki)
    .then(result => {
        if (!result){
            throw {
                errorStatus : 404,
                message : "Dorayaki tidak ditemukan",
                data : {}
            }
        }else{
            //Cek parameter yang diedit
            //Edit data di monggo db
            if(deskripsi != null) {
                result.deskripsi = deskripsi
            }

            if(rasa != null){
                result.rasa = rasa
            }

            if(req.file !=null){
                result.gambar = 'gambar/'+req.file.filename
            }


            //save perubahan data
            return result.save()
        }
    }).then(rslt => {
        res.status(200).json({
            message : "Edit berhasil",
            data : rslt
        })
    })
    .catch(err=> {next(err)})

    
}

const removeGambar = (pathgambar) => {
    const fpath = path.join(__dirname,'..',pathgambar)
    fs.unlink(fpath, err=> {console.log(err)})
}

const dorayaki_delete = (req, res, next) => {
    //Cek dan ambil data di monggo DB
    const idDorayaki = req.params.id
    if(idDorayaki==null){
        throw{
            errorStatus : 404,
            message : "id dorayaki kosong gan",
            data : {}
        }
    }
    //Proses delete data
    Dorayaki.findById(idDorayaki).then(d => {
        if (!d){
            throw {
                errorStatus : 404,
                message : "Dorayaki tidak ditemukan",
                data : {}
            }
        }
        removeGambar(d.gambar)
        return Dorayaki.findByIdAndRemove(idDorayaki)
    })
    .then(rslt => {
        res.status(200).json({
            message : "Delete id "+idDorayaki+" berhasil",
            data : rslt
        })
    })
    .catch(err=>{next(err)})
}

module.exports = {
    dorayaki_get, 
    dorayaki_post, 
    dorayaki_delete, 
    dorayaki_put,
    dorayaki_get_specific
}