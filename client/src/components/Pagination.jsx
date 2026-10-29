import React from "react";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-center gap-2 my-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 text-sm border rounded-md cursor-pointer hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {pages.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-9 h-9 text-sm rounded-md cursor-pointer ${
            number === page
              ? "bg-primary text-white"
              : "border hover:bg-primary/10"
          }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 text-sm border rounded-md cursor-pointer hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
