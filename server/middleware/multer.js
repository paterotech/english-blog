import multer from "multer";

const upload = multer({
    storage: multer.diskStorage({}),
    limits: {
        fieldSize: 15 * 1024 * 1024,
        fileSize: 10 * 1024 * 1024,
    },
})

export default upload;
