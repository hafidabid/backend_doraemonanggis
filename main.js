const express = require("express")
const routerApi = require("./router")
const path = require("path")
const mongoooo = require("mongoose")
const app = express()
const dotenv = require("dotenv")
dotenv.config()

app.use("/gambar", express.static(path.join(__dirname,"gambar")))
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','GET,, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization')
    next()
})
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded())
app.use("/api",routerApi)
app.use((error, req, res, next)=> {
    let status = error.errorStatus
    if(error.errorStatus==null){
        status = 500
    }
    const message = error.message
    const data = error.data

    res.status(status).json({
        'message' : message,
        'data' : data
    })
})

const {MONGO_HOSTNAME, MONGO_USN, MONGO_PASS, MONGO_DB} = process.env
mongoooo.connect(`mongodb+srv://${MONGO_USN}:${MONGO_PASS}@${MONGO_HOSTNAME}/${MONGO_DB}?retryWrites=true&w=majority`)
.then(()=>{
    app.listen(6900)
})
.catch(err => console.log(err))
