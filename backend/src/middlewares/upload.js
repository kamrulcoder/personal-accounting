// backend -> src -> middlewares -> upload.js 
// 

import multer from "multer"
import path from "path"
import { fileURLToPath } from 'url';
import fs from "fs"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, "../../uploads");

// ফোল্ডার auto-create
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
    // Extension আলাদা করা
    const ext = path.extname(file.originalname);  // ".jpg"
    const nameWithoutExt = path.basename(file.originalname, ext);

    // sanitize original name
    const safeName = nameWithoutExt
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")// remove invalid chars
        .slice(0, 20);  // max 20 chars 

    // final filename
    const finalName = `${file.fieldname}-${safeName}-${Date.now()}${ext}`;

    cb(null, finalName);
}
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true)
    } else {
        cb(new Error("ony image files are allowed !"))
    }
}

const upload = multer({ storage, fileFilter })
export default upload;

