import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import usePageMeta from "../hooks/usePageMeta";

const NotFound = () => {
  usePageMeta({
    title: "Page not found",
    description: "The page you are looking for does not exist.",
    noIndex: true,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-5 py-20">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-700">
          Page not found
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
          <Link to="/" className="px-6 py-2.5 rounded-full bg-primary text-white text-sm">
            Go home
          </Link>
          <Link
            to="/blogs"
            className="px-6 py-2.5 rounded-full border border-primary/50 text-primary text-sm"
          >
            Browse blogs
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
