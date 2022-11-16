const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'resumes/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.pdf'
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf')
        cb(null, true)
    else
        cb(null, false)
}

module.exports = multer({storage: storage, fileFilter: fileFilter})