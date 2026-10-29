import React, { useEffect, useState } from "react";
import Moment from "moment";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import Pagination from "../../components/Pagination";

const COMMENTS_PER_PAGE = 8;

const Comments = () => {
  const { axios } = useAppContext();
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pendingId, setPendingId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get("/api/admin/comments");
        if (data.success) {
          setComments(data.comments);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    };

    fetchComments();
  }, [axios]);

  const filteredComments = comments.filter((comment) => {
    if (filter === "pending") return !comment.isApproved;
    if (filter === "approved") return comment.isApproved;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredComments.length / COMMENTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * COMMENTS_PER_PAGE,
    currentPage * COMMENTS_PER_PAGE
  );

  const toggleApproval = async (id) => {
    try {
      setPendingId(id);
      const { data } = await axios.put(`/api/admin/comments/${id}`);
      if (data.success) {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === id ? { ...comment, isApproved: data.isApproved } : comment
          )
        );
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setPendingId(null);
    }
  };

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment permanently?")) return;
    try {
      setPendingId(id);
      const { data } = await axios.delete(`/api/admin/comments/${id}`);
      if (data.success) {
        setComments((prev) => prev.filter((comment) => comment._id !== id));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setPendingId(null);
    }
  };

  const filters = [
    { key: "all", label: `All (${comments.length})` },
    { key: "pending", label: `Pending (${comments.filter((c) => !c.isApproved).length})` },
    { key: "approved", label: `Approved (${comments.filter((c) => c.isApproved).length})` },
  ];

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50 overflow-y-auto">
      <h1>Comments.</h1>

      <div className="flex flex-wrap gap-2 mt-4">
        {filters.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setFilter(item.key);
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${
              filter === item.key
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-primary/10"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 my-5 max-w-4xl">
        {paginatedComments.map((comment) => (
          <div key={comment._id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-gray-800">{comment.name}</p>
                {comment.email && <p className="text-xs text-gray-400">{comment.email}</p>}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] ${
                    comment.isApproved
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {comment.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {Moment(comment.createdAt).format("Do MMMM YYYY, HH:mm")}
              </p>
            </div>

            <p className="text-sm text-gray-600 whitespace-pre-line">{comment.content}</p>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 truncate max-w-sm">
                On: {comment.blogId?.title || "Deleted blog"}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pendingId === comment._id}
                  onClick={() => toggleApproval(comment._id)}
                  className={`px-4 py-1.5 rounded text-xs cursor-pointer disabled:opacity-60 ${
                    comment.isApproved
                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {comment.isApproved ? "Hide" : "Approve"}
                </button>
                <button
                  type="button"
                  disabled={pendingId === comment._id}
                  onClick={() => deleteComment(comment._id)}
                  className="px-4 py-1.5 rounded text-xs cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {paginatedComments.length === 0 && (
          <p className="text-center text-gray-500 py-16">
            {filter === "all"
              ? "No comments yet."
              : `No ${filter} comments.`}
          </p>
        )}
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default Comments;
