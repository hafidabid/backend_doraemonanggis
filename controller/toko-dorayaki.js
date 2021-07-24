const TokoDorayaki = require("../model/toko")

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

module.exports = {
    toko_dorayaki_get,
    toko_dorayaki_get_specific,
    toko_dorayaki_post,
    toko_dorayaki_put,
    toko_dorayaki_delete,
}