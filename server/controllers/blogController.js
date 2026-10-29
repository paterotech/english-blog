import fs from "fs";
import mongoose from "mongoose";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";

const UPLOAD_FOLDER = "/blogs";
const ATTACHMENTS_FOLDER = "/blogs/attachments";
const MAX_ATTACHMENTS = 10;
const ALLOWED_ATTACHMENT_EXTENSIONS = [
    "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
    "png", "jpg", "jpeg", "gif", "webp", "txt", "csv", "zip",
];

const removeTempFile = (file) => {
    if (file?.path) fs.unlink(file.path, () => {});
};

const uploadImage = async (imageFile) => {
    try {
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: UPLOAD_FOLDER,
        });

        return {
            url: imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: "auto" },
                    { format: "webp" },
                    { width: "1280" },
                ],
            }),
            fileId: response.fileId,
        };
    } finally {
        removeTempFile(imageFile);
    }
};

const deleteImage = async ({ image, imageFileId }) => {
    try {
        let fileId = imageFileId;

        if (!fileId && image) {
            const fileName = image.split("?")[0].split("/").pop();
            const files = await imagekit.listFiles({ path: UPLOAD_FOLDER, limit: 1000 });
            fileId = files.find(
                (file) => file.type === "file" && file.filePath === `${UPLOAD_FOLDER}/${fileName}`,
            )?.fileId;
        }

        if (fileId) await imagekit.deleteFile(fileId);
    } catch (error) {
        console.log("No se pudo eliminar la imagen de ImageKit:", error.message);
    }
};

const uploadAttachmentFile = async (attachmentFile) => {
    try {
        const fileBuffer = fs.readFileSync(attachmentFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: attachmentFile.originalname,
            folder: ATTACHMENTS_FOLDER,
        });

        return {
            name: attachmentFile.originalname,
            url: imagekit.url({ path: response.filePath }),
            fileId: response.fileId,
            size: attachmentFile.size,
        };
    } finally {
        removeTempFile(attachmentFile);
    }
};

const sanitizeAttachments = (attachments) => {
    if (!Array.isArray(attachments)) return [];
    return attachments
        .filter((item) => item && typeof item.url === "string" && item.url.startsWith("https://"))
        .slice(0, MAX_ATTACHMENTS)
        .map((item) => ({
            name: String(item.name || "attachment").slice(0, 200),
            url: item.url,
            fileId: String(item.fileId || ""),
            size: Number(item.size) || 0,
        }));
};

export const uploadBlogAttachment = async (req, res) => {
    try {
        const attachmentFile = req.file;
        if (!attachmentFile) {
            return res.status(400).json({ success: false, message: "No file provided" });
        }

        const extension = attachmentFile.originalname.split(".").pop().toLowerCase();
        if (!ALLOWED_ATTACHMENT_EXTENSIONS.includes(extension)) {
            removeTempFile(attachmentFile);
            return res.status(400).json({
                success: false,
                message: `File type not allowed. Use: ${ALLOWED_ATTACHMENT_EXTENSIONS.join(", ")}`,
            });
        }

        const attachment = await uploadAttachmentFile(attachmentFile);
        res.json({ success: true, attachment });
    } catch (error) {
        removeTempFile(req.file);
        console.log("Error detallado:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished, attachments } = JSON.parse(
            req.body.blog,
        );
        const imageFile = req.file;

        // Validate required fields
        if (!title || !description || !category || !imageFile) {
            removeTempFile(imageFile);
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
        }
        const { url, fileId } = await uploadImage(imageFile);

        await Blog.create({
            title,
            subTitle,
            description,
            category,
            image: url,
            imageFileId: fileId,
            attachments: sanitizeAttachments(attachments),
            isPublished,
        });
        res.json({ success: true, message: "Blog added successfully" });
    } catch (error) {
        removeTempFile(req.file);
        console.log("Error detallado:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};


export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subTitle, description, category, isPublished, attachments } = JSON.parse(
            req.body.blog,
        );

        if (!title || !description || !category) {
            removeTempFile(req.file);
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
        }

        const blog = await findBlogById(id);
        if (!blog) {
            removeTempFile(req.file);
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        blog.title = title;
        blog.subTitle = subTitle;
        blog.description = description;
        blog.category = category;
        blog.isPublished = Boolean(isPublished);

        const nextAttachments = sanitizeAttachments(attachments);
        const removedAttachments = (blog.attachments || []).filter(
            (previous) =>
                previous.fileId &&
                !nextAttachments.some((next) => next.fileId === previous.fileId),
        );
        blog.attachments = nextAttachments;

        if (req.file) {
            const { url, fileId } = await uploadImage(req.file);
            const previousImage = { image: blog.image, imageFileId: blog.imageFileId };
            blog.image = url;
            blog.imageFileId = fileId;
            await blog.save();
            await deleteImage(previousImage);
        } else {
            await blog.save();
        }

        for (const attachment of removedAttachments) {
            await deleteImage({ image: attachment.url, imageFileId: attachment.fileId });
        }

        res.json({ success: true, message: "Blog updated successfully" });
    } catch (error) {
        removeTempFile(req.file);
        console.log("Error detallado:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

export const getAllBlogs = async (req, res)=> {
    try {
        const blogs = await Blog.find({isPublished: true});
        res.json({ success: true, blogs });
    } catch (error) {
        console.log("Error detallado:", error); 
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}


const findBlogById = async (blogId, onlyPublished = false) => {
    if (!mongoose.isValidObjectId(blogId)) return null;
    const query = onlyPublished ? { _id: blogId, isPublished: true } : { _id: blogId };
    return Blog.findOne(query);
};

export const getBlogById = async (req, res)=> {
    try {
        const blog = await findBlogById(req.params.blogId);

        if(!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        res.json({ success: true, blog });

    } catch (error) {
        console.log("Error detallado:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }   
}

export const getPublishedBlogById = async (req, res)=> {
    try {
        const blog = await findBlogById(req.params.blogId, true);

        if(!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        res.json({ success: true, blog });

    } catch (error) {
        console.log("Error detallado:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}

export const deleteBlogById = async (req, res)=> {
    try {
        const { id } = req.body;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        await Comment.deleteMany({ blogId: id });
        await deleteImage(blog);
        for (const attachment of blog.attachments || []) {
            await deleteImage({ image: attachment.url, imageFileId: attachment.fileId });
        }
        res.json({ success: true, message: "Blog deleted successfully" });

    } catch (error) {
        console.log("Error detallado:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}

export const togglePublish = async (req, res)=> {
    try {
        const { id } = req.params;  
        const blog = await findBlogById(id);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({ success: true, message: "Blog publish status updated successfully" });

    } catch (error) {
        console.log("Error detallado:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}

export const generateContent = async (req, res)=>{
    try {
        const {prompt} = req.body
        const content = await main(prompt + 'Generate a blog content for this topic in simple text format.')
        res.json({success:true, content})
    } catch (error) {
         res.json({ success: false, message: error.message });
    }
}