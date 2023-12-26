import React from "react";

const Title = ({ title, desc }) => {
  return (
    <div className="my-5">
      <h2 className="font-bold uppercase text-2xl text-[#33334F] ">{title}</h2>
      <span className="italic font-semibold">{desc}</span>
    </div>
  );
};

export default Title;
