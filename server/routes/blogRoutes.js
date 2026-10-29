
import express from "express";
import { addBlog, deleteBlogById, generateContent, getAllBlogs, getPublishedBlogById, togglePublish, updateBlog } from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

blogRouter.post("/add", auth, upload.single('image'), addBlog);
blogRouter.put("/update/:id", auth, upload.single('image'), updateBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getPublishedBlogById);
blogRouter.post('/delete', auth, deleteBlogById);
blogRouter.post('/toggle-publish/:id', auth, togglePublish);

blogRouter.post('/generate', auth, generateContent);

export default blogRouter;
