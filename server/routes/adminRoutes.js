import express from 'express';
import { adminLogin, getAllBlogsAdmin, getDashboard } from '../controllers/adminController.js';
import { getBlogById } from '../controllers/blogController.js';
import { deleteComment, getAllComments, toggleCommentApproval } from '../controllers/commentController.js';
import auth from '../middleware/auth.js';

const adminRouter = express.Router();

adminRouter.post("/login",adminLogin);
adminRouter.get("/blogs", auth, getAllBlogsAdmin);
adminRouter.get("/blogs/:blogId", auth, getBlogById);
adminRouter.get("/dashboard", auth, getDashboard);
adminRouter.get("/comments", auth, getAllComments);
adminRouter.put("/comments/:id", auth, toggleCommentApproval);
adminRouter.delete("/comments/:id", auth, deleteComment);

export default adminRouter;


