import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.webp";
// import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";
function Receviermessage({ image, message }) {
  let { selecteduser } = useSelector((state) => state.user);
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
        className="w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center bg-white shadow-gray-500 shadow-lg"
        ref={scroll}
      >
        <img src={selecteduser.image || dp} alt="" />
      </div>
      <div className="w-fit max-w-[500px] px-[20px] py-[10px] bg-[#000000] text-white text-[19px] rounded-tl-none rounded-2xl relative left-0   shadow-gray-600 shadow-lg flex flex-col gap-[10px]">
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
    </div>
  );
}

export default Receviermessage;
