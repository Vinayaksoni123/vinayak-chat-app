import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";

function SenderMessage({ image, message }) {
  let { userdata } = useSelector((state) => state.user);
  let scroll = useRef();
  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  const handelImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex items-start gap-[15px]">
      <div
        className="w-fit max-w-[500px] px-[20px] py-[10px] bg-[#2084a5] text-white text-[19px] rounded-tr-none rounded-2xl relative right-0 ml-auto  shadow-gray-600 shadow-lg flex flex-col gap-[10px]"
        ref={scroll}
      >
        {image && (
          <img
            src={image}
            alt=""
            className="w-[200px] rounded-lg"
            onLoad={handelImageScroll}
          />
        )}
        {message && <span>{message}</span>}
      </div>
      <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center bg-white shadow-gray-500 shadow-lg">
        <img src={userdata.image || dp} alt="" />
      </div>
    </div>
  );
}

export default SenderMessage;
