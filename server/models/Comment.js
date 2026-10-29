import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, trim: true, lowercase: true, maxlength: 120, default: "" },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    isApproved: { type: Boolean, default: false },
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
