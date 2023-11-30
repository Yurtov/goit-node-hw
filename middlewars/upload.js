const multer = require("multer");
const path = require("path");
const crypto = require("node:crypto");

const tempDir = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname); 
        const basename = path.basename(file.originalname, extname);
        const suffix = crypto.randomUUID();
    
        cb(null, `${basename}-${suffix}${extname}`);}
})

const upload = multer({ storage: multerConfig });

module.exports = upload;