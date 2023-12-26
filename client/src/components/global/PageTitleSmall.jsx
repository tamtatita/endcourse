import React from "react";

const PageTitleSmall = ({ title }) => {
  return (
    <div className="box-primary w-full py-3 text-white text-center flex items-center justify-center my-4">
      <h1 className="uppercase text-xl font-bold">{title}</h1>
    </div>
  );
};

export default PageTitleSmall;
