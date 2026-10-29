import React, { useState, useRef, useEffect } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { useAppContext } from "../../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {parse} from 'marked';


const MAX_ATTACHMENT_SIZE = 4 * 1024 * 1024;
const ALLOWED_ATTACHMENT_EXTENSIONS = [
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
  "png", "jpg", "jpeg", "gif", "webp", "txt", "csv", "zip",
];

const formatSize = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

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
  const attachmentInputRef = useRef(null);

  const [image, setImage] = useState(false);
  const [existingImage, setExistingImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Project Activity 1");
  const [isPublished, setIsPublished] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

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

  const handleAttachFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_ATTACHMENT_EXTENSIONS.includes(extension)) {
      return toast.error(`File type not allowed. Use: ${ALLOWED_ATTACHMENT_EXTENSIONS.join(", ")}`);
    }
    if (file.size > MAX_ATTACHMENT_SIZE) {
      return toast.error("File is too large. Maximum size is 4 MB.");
    }
    if (attachments.length >= 10) {
      return toast.error("Maximum 10 attachments per blog.");
    }

    try {
      setUploadingAttachment(true);
      const formData = new FormData();
      formData.append("file", file);
      const {data} = await axios.post('/api/blog/upload-attachment', formData);
      if (data.success) {
        setAttachments((prev) => [...prev, data.attachment]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setUploadingAttachment(false);
    }
  };

  const removeAttachment = (url) => {
    setAttachments((prev) => prev.filter((item) => item.url !== url));
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true);

      const blog = {
        title, subTitle, description: quillRef.current.root.innerHTML, category, isPublished, attachments
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
          setAttachments([]);
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
          setAttachments(Array.isArray(blog.attachments) ? blog.attachments : []);
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
        <p className=" mt-4">Blog Attachments <span className="text-gray-400 text-sm">(optional, max 4 MB each)</span></p>
        <div className="max-w-lg mt-2">
          <input
            ref={attachmentInputRef}
            type="file"
            hidden
            onChange={handleAttachFile}
            accept={ALLOWED_ATTACHMENT_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
          />
          <button
            type="button"
            disabled={uploadingAttachment}
            onClick={() => attachmentInputRef.current?.click()}
            className="px-4 py-2 border border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
          >
            {uploadingAttachment ? "Uploading..." : "+ Attach file"}
          </button>
          {attachments.length > 0 && (
            <ul className="mt-3 space-y-2">
              {attachments.map((file) => (
                <li
                  key={file.url}
                  className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm"
                >
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-primary hover:underline"
                  >
                    {file.name}
                  </a>
                  <span className="flex items-center gap-3 shrink-0 text-gray-400">
                    {formatSize(file.size)}
                    <button
                      type="button"
                      onClick={() => removeAttachment(file.url)}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                      aria-label={`Remove ${file.name}`}
                    >
                      ✕
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
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
