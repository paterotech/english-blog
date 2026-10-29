import React, { useEffect, useState } from "react";
import BlogTableItem from "../../components/admin/BlogTableItem";
import Pagination from "../../components/Pagination";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const BLOGS_PER_PAGE = 8;

const ListBlog = () => {

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const {axios} =useAppContext()
  

  const fetchBlogs = async () => {
    try {
      const {data} = await axios.get('/api/admin/blogs')
      if(data.success){
        setBlogs(data.blogs)
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil(blogs.length / BLOGS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * BLOGS_PER_PAGE,
    currentPage * BLOGS_PER_PAGE
  );

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50 overflow-y-auto">
      <h1>All Blogs.</h1>

      <div className="relative mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-600 text-left uppercase">
            <tr>
              <th scope="col" className="px-2 py-4 xl:px-6">
                #
              </th>
              <th scope="col" className="px-2 py-4">
                Blog Title
              </th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">
                Date
              </th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">
                Status
              </th>
              <th scope="col" className="px-2 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedBlogs.map((blog, index) => {
              return <BlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={(currentPage - 1) * BLOGS_PER_PAGE + index + 1}/>
            })}
          </tbody>
        </table>
      </div>
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ListBlog;
