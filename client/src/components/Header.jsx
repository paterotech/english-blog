import React, { useRef } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Header = () => {
  const { setInput, input } = useAppContext();
  const inputRef = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setInput(inputRef.current.value);
  };

  const onClear = () => {
    setInput("");
    inputRef.current.value = "";
  }

  return (
    <div className="mx-8 sm:mx-16 xl:mx-24 relative">
      <div className="text-center mt-20 mb-8">
        <div className="inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/50 bg-prmary/10 rounded-full text-sm text-primary">
          <p>Evidence GA4-240202501-AA1-EV03. Blog</p>
          <img src={assets.star_icon} alt="star-icon" className="w-2.5" />
        </div>
        <h1 className="text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700">
          My own <span className="text-primary/75">blogging</span> <br />{" "}
          platform.
        </h1>
        <p className="my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-600">
          This blog consolidates all the evidence produced throughout the English course—with the exception of quizzes. As part of this learning process, various materials have been created, including videos, audio recordings, and both oral and written texts, covering topics such as family, hobbies, interests, work, travel, and current events.
        </p>
        <form
          onSubmit={onSubmitHandler}
          className="flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for blogs"
            aria-label="Search for blogs"
            required
            className="w-full pl-4 outline-none"
          />
          <button
            type="submit"
            className="bg-primary text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      <div className="text-center">
        {input && <button onClick={onClear} className="border font-light text-xs py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer">
          Clear search
        </button>}
      </div>

      <img
        src={assets.gradientBackground}
        alt="background"
        className="absolute -top-50 -z-1 opacity-50"
      />
    </div>
  );
};

export default Header;
