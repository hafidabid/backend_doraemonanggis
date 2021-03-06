const TokoDorayaki = require("../model/toko")
const Dorayaki = require("../model/dorayaki")
const toko_dorayaki_get = (req, res, next) => {
    let filterKecamatan = req.query.kecamatan
    let filterProvinsi = req.query.provinsi
    if(filterProvinsi==null){
        //console.log("asdf")
        filterProvinsi = ''
    }
    if(filterKecamatan==null){
        //console.log("a412")
        filterKecamatan = ''
    }
    TokoDorayaki.find({
        'provinsi' : {
            $regex : '^.*'+filterProvinsi+'.*$'
        },
        'kecamatan' : {
            $regex : '^.*'+filterKecamatan+'.*$'
        }
    }).then(r=>{
        res.status(200).json({
            'message' : 'sukses',
            'data' : r
        })
    }).catch(err=>{
        next(err)
    })

}

const toko_dorayaki_get_specific = (req, res, next) => {
    const idToko = req.params.id
    if(idToko==null){
        throw{
            status : 404,
            message : "id toko kosong gan",
            data : {}
        }
    }

    TokoDorayaki.findById(idToko)
    .then(hasil => {
        if(!hasil){
            const e = new Error("id toko tidak ditemukan")
            e.errorStatus = 404
            next(e)
        }

        res.status(200).json({
            message : "fetch id "+idToko+" berhasil",
            data : hasil
        })
    })
    .catch(err => next(err))
}

const toko_dorayaki_post = (req, res, next) => {
    const {nama, jalan, kecamatan, provinsi} = req.body
    if(nama == null || jalan == null || kecamatan == null || provinsi == null){
        throw {
            status : 400, 
            message : "harus ada nama, jalan, kecamata, provinsi di parameter",
            data : req.body
        }
    }

    if(nama.length <3 || jalan.length < 5 || kecamatan.length < 3 || provinsi.length<4){
        throw {
            status : 400,
            message : "nama min 3 char, jalan min 5 char, kecamatan min 3 char, provinsi min 4 char",
            data : {
                nama : nama.length,
                jalan : jalan.length,
                kecamatan : kecamatan.length,
                provinsi : provinsi.length,
            }
        }
    }

    const tokoBaru = new TokoDorayaki({
        nama : nama,
        jalan : jalan,
        kecamatan : kecamatan,
        provinsi : provinsi,
        dorayaki : []
    })
    tokoBaru.save().then(r=> {
        res.status(201).json({
            message : "toko baru berhasil ditambahkan",
            data : r
        })
    }).catch(err => {
        throw {
            status : 500,
            message : err,
            data : {}
        }
    })
}

const toko_dorayaki_put = (req, res, next) => {
    const {nama, jalan, kecamatan, provinsi, dorayaki} = req.body
    const idToko = req.params.id
    if(idToko==null){
        throw{
            status : 404,
            message : "id toko kosong gan",
            data : {}
        }
    }

    TokoDorayaki.findById(idToko)
    .then(hasil => {
        if(!hasil){
            const e = new Error("id toko tidak ditemukan")
            e.errorStatus  = 404
            next(e)
        }

        if(nama != null){
            hasil.nama = nama
        }

        if(jalan != null){
            hasil.jalan = jalan
        }

        if(kecamatan != null){
            hasil.kecamatan = kecamatan
        }

        if(provinsi != null){
            hasil.provinsi = provinsi
        }

        if(dorayaki != null){
            hasil.dorayaki = dorayaki
        }

        return hasil.save()
    })
    .then(hasil=> {
        res.status(200).json({
            message : "berhasil update toko dengan id: "+idToko,
            data : hasil
        })
    })
    .catch(err => {
        next(err)
    })

}

const toko_dorayaki_delete = (req, res, next) => {
    const idToko = req.params.id
    if(idToko==null){
        throw{
            status : 404,
            message : "id toko kosong gan",
            data : {}
        }
    }

    TokoDorayaki.findById(idToko)
    .then(hasil => {
        if(!hasil){
            const e = new Error("id toko tidak ditemukan")
            e.errorStatus = 404
            next(e)
        }
        return TokoDorayaki.findByIdAndRemove(idToko)
    })
    .then(hasil => {
        res.status(200).json({
            message : "berhasil delete toko dengan id: "+idToko,
            data : hasil
        })
    })
    .catch(err => {
        next(err)
    })
}

const toko_dorayaki_getitem = (req, res, next) => {
    const idToko = req.params.id
    if(idToko==null){
        throw{
            status : 404,
            message : "id toko kosong gan",
            data : {}
        }
    }

    TokoDorayaki.findById(idToko)
        .then(async (hasil)=>{
            let ret = []
            let i
            for(i=0;i<hasil.dorayaki.length;i++){
                const hehe = await Dorayaki.findById(hasil.dorayaki[i].id).exec()
                hasil.dorayaki[i].detail = hehe
                ret.push(hasil.dorayaki[i])
            }
            res.status(200).json({
                message : "berhasil get dorayaki di id = "+idToko,
                data : ret
            })
        }).catch(err=>next(err))

}

const toko_dorayaki_postitem = (req,res, next) => {
    const {id_dorayaki, stok} = req.body
    const idToko = req.params.id
    if(idToko==null){
        throw{
            status : 404,
            message : "id toko kosong gan",
            data : {}
        }
    }

    TokoDorayaki.findById(idToko)
        .then(hasil=>{
            if(!hasil){
                const e = new Error("id toko tidak ditemukan")
                e.errorStatus = 404
                next(e)
            }else {
                return Dorayaki.findById(id_dorayaki)
            }
        }).then(hasil => {
            if(!hasil){
                const e = new Error("id dorayaki tidak ditemukan")
                e.errorStatus = 404
                next(e)
            }else{
                return TokoDorayaki.findById(idToko)
            }
        }).then(hasil => {
            let flag = true
            hasil.dorayaki.forEach(d=>{
                if(d.id===id_dorayaki){
                    const e = new Error("dorayaki udah ada disini gan, silahkan tambah kurang atau move aja gan")
                    e.errorStatus = 400
                    flag = false
                    next(e)
                }
            })
            hasil.dorayaki.push({
                id : id_dorayaki,
                stok : stok ? stok : 0
            })
            if(flag){
                return hasil.save()
            }
        }).then(hasil => {
            res.status(200).json({
                message : "berhasil tambah dorayaki baru dengan id "+id_dorayaki+" di toko dengan id: "+idToko,
                data : hasil
            })
        }).catch(err=>next(err))
}

const toko_dorayaki_putitem = (req,res,next) => {
    const {stok} = req.body
    const idToko = req.params.id
    const idDorayaki = req.params.idd
    if(idToko==null){
        throw{
            status : 404,
            message : "id toko kosong gan",
            data : {}
        }
    }
    if(idDorayaki==null){
        throw{
            status : 404,
            message : "id_dorayaki kosong gan",
            data : {}
        }
    }


    TokoDorayaki.findById(idToko)
        .then(hasil=>{
            if(!hasil){
                const e = new Error("id toko tidak ditemukan")
                e.errorStatus = 404
                next(e)
            }else{
                return Dorayaki.findById(idDorayaki)
            }
        }).then(hasil => {
            if(!hasil){
                const e = new Error("id dorayaki tidak ditemukan")
                e.errorStatus = 404
                next(e)
            }else{
                return TokoDorayaki.findById(idToko)
            }
        }).then(hasil => {
            let i, idx
            let arr = []
            for(i=0;i<hasil.dorayaki.length;i++){
                if(stok > 0){
                    if(hasil.dorayaki[i].id === idDorayaki){
                        hasil.dorayaki[i].stok = stok
                    }
                    arr.push(hasil.dorayaki[i])
                }else{
                    if(hasil.dorayaki[i].id === idDorayaki){
                        idx = i
                    }else{arr.push(hasil.dorayaki[i])}
                }
            }
            hasil.dorayaki = []
            hasil.dorayaki = arr
            return hasil.save()
        }).then(hasil => {
            res.status(200).json({
                message : "berhasil edit dorayaki dengan id "+idDorayaki+" di toko dengan id: "+idToko,
                data : hasil
            })
        }).catch(err=>next(err))
}

const toko_dorayaki_patchitem = async (req,res,next) => {
    const idToko = req.params.id
    const idDorayaki = req.params.idd
    const {toko_id_dest, stokTransfer} = req.body
    if(idToko==null || toko_id_dest==null){
        throw{
            status : 404,
            message : "id toko kosong gan",
            data : {}
        }
    }
    if(idDorayaki==null) {
        throw{
            status: 404,
            message: "id_dorayaki kosong gan",
            data: {}
        }
    }
    const cekDorayaki = await Dorayaki.findById(idDorayaki).exec()
    if(!cekDorayaki){
        const e = new Error("id dorayaki tidak ditemukan")
        e.errorStatus = 404
        next(e)
    }

    const cekDest = await TokoDorayaki.findById(toko_id_dest).exec()
    if(!cekDest){
        const e = new Error("id toko tujuan tidak ditemukan")
        e.errorStatus = 404
        throw(e)
    }

    TokoDorayaki.findById(idToko)
        .then(hasil => {
            if(!hasil){
                const e = new Error("id toko tidak ditemukan")
                e.errorStatus = 404
                next(e)
            }
            let i,idx=-1
            for(i=0;i<hasil.dorayaki.length;i++){
                if(hasil.dorayaki[i].id===idDorayaki && hasil.dorayaki[i].stok-stokTransfer >=0){
                    hasil.dorayaki[i].stok = hasil.dorayaki[i].stok - stokTransfer
                    if(hasil.dorayaki[i].stok<=0){
                        idx = i
                    }
                    break
                }else if(hasil.dorayaki[i].id===idDorayaki && hasil.dorayaki[i].stok-stokTransfer < 0){
                    idx = -2
                    break
                }
            }

            if(idx>=0){
                hasil.dorayaki.splice(idx,1)
            }else if(idx === -2){
                const e = new Error("inssuficient stock to transfer")
                e.errorStatus = 404
                next(e)
            }
            //coba coba
            return hasil.save()
        }).then(hasil => {
            if(!hasil){
                const e = new Error("terjadi kesalahan pada saving sebelumnya")
                e.errorStatus = 404
                next(e)
            }
            return TokoDorayaki.findById(toko_id_dest)
        }).then(hasil => {
            if(!hasil){
                const e = new Error("id toko tidak ditemukan")
                e.errorStatus = 404
                next(e)
            }
            let i,idx=-1
            for(i=0;i<hasil.dorayaki.length;i++){
                if(hasil.dorayaki[i].id===idDorayaki ){
                    hasil.dorayaki[i].stok += stokTransfer
                    idx = i
                    break
                }
            }
            if(idx===-1){
                hasil.dorayaki.push({
                    id : idDorayaki,
                    stok : stokTransfer
                })
            }
            return hasil.save()
        }).then(h=>{
            if(h){
                res.status(200).json({
                    message : "transfer dorayaki sukses",
                    data : h
                })
            }else{
                const e = new Error("gagal transfer dorayaki")
                e.errorStatus = 500
                next(e)
            }
        }).catch(err=>next(err))



}
module.exports = {
    toko_dorayaki_get,
    toko_dorayaki_get_specific,
    toko_dorayaki_post,
    toko_dorayaki_put,
    toko_dorayaki_delete,
    toko_dorayaki_getitem,
    toko_dorayaki_postitem,
    toko_dorayaki_putitem,
    toko_dorayaki_patchitem
}