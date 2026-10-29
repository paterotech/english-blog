import express from "express";
import { addComment, getCommentsByBlog } from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/add", addComment);
commentRouter.get("/blog/:blogId", getCommentsByBlog);

export default commentRouter;
