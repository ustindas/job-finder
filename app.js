const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const router = require('./routes/mainRouter')
const errorHandler = require('./middleware/ErrorHandler')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors({origin: config.get('SERVER_APP_URL')}))
app.use(express.json())
app.use('/api/', router)
app.use('/images', express.static(path.join(__dirname, 'uploaded_files', 'images')))
app.use('/resumes', express.static(path.join(__dirname, 'uploaded_files', 'resumes')))
app.use(errorHandler)
const PORT = config.get('PORT') || 3000
async function start(){
    try{
        await mongoose.connect(config.get('mongoUri'),{
        })
        app.listen(PORT, ()=> console.log(`App has been started on port ${PORT}...`))
    } catch (e){
        console.log("Server error", e.message)
        process.exit(1)
    }
}

start()


