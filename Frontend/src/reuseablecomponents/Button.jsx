import React from "react";

const Button = ({ size, name, type, OnClick, disable, className }) => {
  return (
    <>
      <button
        onClick={OnClick}
        disabled={disable}
        type={type}
        className={`bg-cyan-600 ${size} hover:bg-cyan-400 cursor-pointer text-white  rounded-lg text-sm lg:text-lg text-center font-bold ${className}`}
      >
        {name}
      </button>
    </>
  );
};

export default Button;
