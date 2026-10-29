import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Moment from "moment";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Comments from "../components/Comments";
import usePageMeta, { stripHtml } from "../hooks/usePageMeta";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Blog = () => {

  const { id } = useParams();

  const {axios}= useAppContext();

  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  usePageMeta({
    title: data?.title || "Blog",
    description:
      data?.subTitle || (data ? stripHtml(data.description).slice(0, 160) : undefined),
    image: data?.image,
    type: "article",
    noIndex: notFound,
  });

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const {data} = await axios.get(`/api/blog/${id}`);
        if (data.success) {
          setData(data.blog);
        } else {
          setNotFound(true);
          toast.error(data.message);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setNotFound(true);
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message || 'Something went wrong');
        }
      }
    };

    fetchBlogData();
  }, [axios, id]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-5 py-20">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700">
            Blog not found
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            This post does not exist or has not been published.
          </p>
          <Link
            to="/blogs"
            className="mt-6 px-6 py-2.5 rounded-full bg-primary text-white text-sm"
          >
            Back to all blogs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return data ? (
    <div className="relative">
      <img src={assets.gradientBackground} alt="background" className="absolute -top-50 -z-1 opacity-80" />
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 mt-4">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          ← Back to all blogs
        </Link>
      </div>
      <div className="text-center mt-10 text-gray-500">
        <p className="text-primary py-4 font-medium">Publicado: {Moment(data.createdAt).format('Do MMMM YYYY')}</p>
        <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-600">{data.title}</h1>
        <h2 className="my-5 max-w-lg truncate mx-auto">{data.subTitle}</h2>
        <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/50 bg-primary/10 font-medium text-primary">Micaela</p>
      </div>
      <div className="mx-5 max-w-3xl md:mx-auto my-10 mt-6">
        <img src={data.image} alt={data.title} className="w-full max-h-[520px] object-contain rounded-2xl mb-8"/>
        <div className="rich-text max-w-3xl mx-auto" dangerouslySetInnerHTML={{__html: data.description}}></div>
      </div>
      <Comments blogId={data._id} />
      <Footer/>
    </div>
  ) : <Loader />;
};

export default Blog;
