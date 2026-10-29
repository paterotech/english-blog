import React, { useState, useRef, useEffect } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { useAppContext } from "../../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {parse} from 'marked';


const AddBlog = () => {

  const {axios, fetchBlogs} = useAppContext();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const pendingDescription = useRef("");

  const [image, setImage] = useState(false);
  const [existingImage, setExistingImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Project Activity 1");
  const [isPublished, setIsPublished] = useState(false);

  const generateContent = async () => {
    if(!title) return toast.error('Please, enter the title')
      try {
        setLoading(true)
        const {data} = await axios.post('/api/blog/generate', {prompt: title})
        if(data.success){
          quillRef.current.root.innerHTML = parse(data.content)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }finally{
        setLoading(false)
      }
  };

  //addEventListener

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true);

      const blog = {
        title, subTitle, description: quillRef.current.root.innerHTML, category, isPublished
      }

      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog));
      if (image) formData.append('image', image);

      const {data} = isEditing
        ? await axios.put(`/api/blog/update/${id}`, formData)
        : await axios.post('/api/blog/add', formData)

      if(data.success){
        toast.success(data.message || (isEditing ? 'Blog updated successfully' : 'Blog added successfully'));
        fetchBlogs();
        if (isEditing) {
          navigate('/admin/listBlog');
        } else {
          setImage(false);
          setTitle('');
          setSubTitle('');
          setIsPublished(false);
          quillRef.current.root.innerHTML = ''
          setCategory('Project Activity 1')
        }
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    }finally{
      setIsAdding(false)
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
      if (pendingDescription.current) {
        quillRef.current.root.innerHTML = pendingDescription.current;
      }
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const {data} = await axios.get(`/api/admin/blogs/${id}`);
        if (data.success) {
          const blog = data.blog;
          setTitle(blog.title || '');
          setSubTitle(blog.subTitle || '');
          setCategory(blog.category || 'Project Activity 1');
          setIsPublished(Boolean(blog.isPublished));
          setExistingImage(blog.image || '');
          pendingDescription.current = blog.description || '';
          if (quillRef.current) {
            quillRef.current.root.innerHTML = pendingDescription.current;
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Something went wrong');
      }
    };

    fetchBlog();
  }, [id, axios]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded ">
        <h1 className="text-xl font-semibold text-gray-700 mb-6">{isEditing ? "Edit Blog" : "Add New Blog"}</h1>
        <p>Upload thumbnail</p>
        <label htmlFor="image">
          <img
            src={image ? URL.createObjectURL(image) : existingImage || assets.upload_area}
            alt=""
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required={!isEditing}
          />
        </label>

        <p className=" mt-4">Blog Title</p>
        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <p className=" mt-4">Sub Title</p>
        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />

        <p className=" mt-4">Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          <button
            disabled={loading}
            type="button"
            onClick={generateContent}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer"
          >
           {loading ? "Generating..." : "Generate with AI"}
          </button>
        </div>
        <p className=" mt-4">Blog Category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          name="category"
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
        >
          <option value="">Select category</option>
          {category && !blogCategories.includes(category) && (
            <option value={category}>{category}</option>
          )}
          {blogCategories.filter((item) => item.toUpperCase() !== "ALL").map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <div className="flex items-center gap-2 mt-4 cursor-pointer">
          <p>Publish now</p>
          <input
            type="checkbox"
            checked={isPublished}
            className="scale-125 cursor-pointer"
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>
        <button disabled={isAdding}
          type="submit"
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm"
        >
          {isAdding ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Update Blog" : "Add Blog")}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
