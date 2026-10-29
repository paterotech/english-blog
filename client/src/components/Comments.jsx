import React, { useEffect, useState } from "react";
import Moment from "moment";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Comments = ({ blogId }) => {
  const { axios } = useAppContext();
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/api/comment/blog/${blogId}`);
        if (data.success) setComments(data.comments);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchComments();
  }, [axios, blogId]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { data } = await axios.post("/api/comment/add", { blogId, ...form });
      if (data.success) {
        toast.success(data.message);
        setForm({ name: "", email: "", content: "" });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-0 pb-20">
      <h3 className="text-xl font-semibold text-gray-700 mb-5">
        Comments <span className="text-primary/75">({comments.length})</span>
      </h3>

      <div className="flex flex-col gap-3 mb-8">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <p className="font-medium text-gray-800">{comment.name}</p>
              <p className="text-xs text-gray-400">
                {Moment(comment.createdAt).format("Do MMMM YYYY, HH:mm")}
              </p>
            </div>
            <p className="text-sm text-gray-600 whitespace-pre-line">{comment.content}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-gray-500">
            No comments yet. Be the first to share your thoughts.
          </p>
        )}
      </div>

      <form onSubmit={onSubmit} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <h4 className="font-medium text-gray-700 mb-4">Leave a comment</h4>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="comment-name" className="sr-only">
              Your name
            </label>
            <input
              id="comment-name"
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              required
              maxLength={80}
              placeholder="Your name"
              className="w-full p-2.5 border border-gray-300 rounded outline-none text-sm"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="comment-email" className="sr-only">
              Your email (optional)
            </label>
            <input
              id="comment-email"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              maxLength={120}
              placeholder="Your email (optional)"
              className="w-full p-2.5 border border-gray-300 rounded outline-none text-sm"
            />
          </div>
        </div>

        <label htmlFor="comment-content" className="sr-only">
          Write your comment here
        </label>
        <textarea
          id="comment-content"
          name="content"
          value={form.content}
          onChange={onChange}
          required
          maxLength={1000}
          rows={4}
          placeholder="Write your comment here..."
          className="w-full mt-3 p-2.5 border border-gray-300 rounded outline-none text-sm resize-y"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <p className="text-xs text-gray-400">
            Your comment will be published after review. Your email is never shown publicly.
          </p>
          <button
            disabled={isSubmitting}
            type="submit"
            className="px-6 h-10 bg-primary text-white rounded text-sm cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Post comment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Comments;
