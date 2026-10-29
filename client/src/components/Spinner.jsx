import React from "react";

const Spinner = ({ className = "" }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-t-primary" />
    </div>
  );
};

export default Spinner;
