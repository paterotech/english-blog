import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

export const addComment = async (req, res) => {
    try {
        const { blogId, name, email, content } = req.body;

        if (!blogId || !mongoose.isValidObjectId(blogId)) {
            return res.status(400).json({ success: false, message: "Invalid blog" });
        }
        if (!name?.trim() || !content?.trim()) {
            return res
                .status(400)
                .json({ success: false, message: "Name and comment are required" });
        }

        const blog = await Blog.findOne({ _id: blogId, isPublished: true });
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        await Comment.create({
            blogId,
            name: name.trim(),
            email: email?.trim() || "",
            content: content.trim(),
        });

        res.status(201).json({
            success: true,
            message: "Comment submitted. It will appear once it is approved.",
        });
    } catch (error) {
        console.log("Error detallado:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

export const getCommentsByBlog = async (req, res) => {
    try {
        const { blogId } = req.params;

        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).json({ success: false, message: "Invalid blog" });
        }

        const comments = await Comment.find({ blogId, isApproved: true })
            .select("name content createdAt")
            .sort({ createdAt: 1 });

        res.json({ success: true, comments });
    } catch (error) {
        console.log("Error detallado:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate("blogId", "title")
            .sort({ createdAt: -1 });

        res.json({ success: true, comments });
    } catch (error) {
        console.log("Error detallado:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

export const toggleCommentApproval = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid comment" });
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        comment.isApproved = !comment.isApproved;
        await comment.save();

        res.json({
            success: true,
            message: comment.isApproved ? "Comment approved" : "Comment hidden",
            isApproved: comment.isApproved,
        });
    } catch (error) {
        console.log("Error detallado:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid comment" });
        }

        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        console.log("Error detallado:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
