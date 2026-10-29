import multer from "multer";

const storage = multer.diskStorage({});

const upload = multer({
    storage,
    limits: {
        fieldSize: 15 * 1024 * 1024,
        fileSize: 10 * 1024 * 1024,
    },
})

const uploadAttachment = multer({
    storage,
    limits: {
        fieldSize: 15 * 1024 * 1024,
        fileSize: 4 * 1024 * 1024,
    },
})

export default upload;
export { uploadAttachment };
