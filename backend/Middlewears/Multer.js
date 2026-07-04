import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//const uploadpath="../../public/uploads";
const uploadpath=path.join(process.cwd(),"public/uploads");

if(!fs.existsSync(uploadpath)){
    fs.mkdirSync(uploadpath,{recursive:true});
}
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadpath);
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname);

    },
});
//export const upload=multer({storage});

export const upload=multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});