import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blogCategories } from "../assets/assets";
// eslint-disable-next-line no-unused-vars -- se usa como <motion.div> en JSX
import { motion } from "motion/react";
import BlogCard from "./BlogCard";
import Pagination from "./Pagination";
import Spinner from "./Spinner";
import { useAppContext } from "../context/AppContext";

const POSTS_PER_PAGE = 8;

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [page, setPage] = useState(1);
  const { blog, input, loadingBlogs } = useAppContext();

  const filteredBlogs = () => {
    if (input === "") {
      return blog;
    }
    return blog.filter(
      (blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
    );
  };

  const visibleBlogs = filteredBlogs().filter((blog) =>
    menu === "All" ? true : blog.category === menu
  );
  const totalPages = Math.max(1, Math.ceil(visibleBlogs.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedBlogs = visibleBlogs.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [menu, input]);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 my-10 relative">
        {/* Blog categories */}
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => setMenu(item)}
              className={`cursor-pointer text-gray-500 ${
                menu === item && "text-white px-4 pt-0.5"
              }`}
            >
              {item}
              {menu === item && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full"
                ></motion.div>
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-8 mx-8 sm:mx-16 xl:mx-40">
        {loadingBlogs && <Spinner className="col-span-full py-20" />}

        {!loadingBlogs &&
          paginatedBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        {!loadingBlogs && paginatedBlogs.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-10">
            No blogs found.
          </p>
        )}
      </div>
      <div className="pb-20 flex flex-col items-center">
        {!loadingBlogs && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <Link to="/blogs" className="text-sm font-medium text-primary hover:underline">
          View all blogs →
        </Link>
      </div>
    </div>
  );
};
export default BlogList;
