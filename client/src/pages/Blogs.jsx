import React, { useState } from "react";
import { Link } from "react-router-dom";
import Moment from "moment";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import { useAppContext } from "../context/AppContext";
import usePageMeta from "../hooks/usePageMeta";

const BLOGS_PER_PAGE = 8;

const Blogs = () => {
  const { blog, loadingBlogs } = useAppContext();
  const [page, setPage] = useState(1);

  usePageMeta({
    title: "All blogs",
    description: "Browse every published post of English Blog.",
  });

  const totalPages = Math.max(1, Math.ceil(blog.length / BLOGS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedBlogs = blog.slice(
    (currentPage - 1) * BLOGS_PER_PAGE,
    currentPage * BLOGS_PER_PAGE
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700">
            All <span className="text-primary/75">blogs</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse every published post of English Blog.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {loadingBlogs && <Spinner className="py-20" />}

          {!loadingBlogs &&
            paginatedBlogs.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post._id}`}
                className="flex flex-col sm:flex-row bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-primary/25 transition-all"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-28 sm:w-28 md:w-32 sm:h-28 md:h-32 object-cover"
                />
                <div className="flex-1 p-3 sm:py-3 sm:pr-5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 mb-1.5">
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full">
                      {post.category}
                    </span>
                    <span>{Moment(post.createdAt).format("Do MMMM YYYY")}</span>
                  </div>
                  <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                    {post.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{post.subTitle}</p>
                </div>
              </Link>
            ))}

          {!loadingBlogs && paginatedBlogs.length === 0 && (
            <p className="text-center text-gray-500 py-16">No blogs published yet.</p>
          )}
        </div>

        {!loadingBlogs && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Blogs;
