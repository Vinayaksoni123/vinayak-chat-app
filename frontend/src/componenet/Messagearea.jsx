import React, { useEffect, useRef, useState } from "react";
import dp from "../assets/dp.webp";
import EmojiPicker from "emoji-picker-react";
import { RiEmojiStickerFill } from "react-icons/ri";
import { IoMdSend } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setselecteduser } from "../redux/userSlice";
import SenderMessage from "./SenderMessage";
import Receviermessage from "./Receviermessage";
import axios from "axios";
import { setmessages } from "../redux/messageSlice";
import sound from "../assets/sound.mp3";
import { serverUrl } from "../main";
function Messagearea() {
  let { selecteduser, userdata, socket } = useSelector((state) => state.user);
  let { messages } = useSelector((state) => state.message);
  let dispatch = useDispatch();
  let [showpicker, setshowpicker] = useState(false);
  let [input, setinput] = useState("");
  let [frontendimage, setfrontendimage] = useState(null);
  let [backendimage, setbackendimage] = useState(null);
  let image = useRef();

  const handelimage = (e) => {
    let file = e.target.files[0];
    setbackendimage(file);
    setfrontendimage(URL.createObjectURL(file));
  };

  const handlesendmessage = async (e) => {
    e.preventDefault();
    if (input.length == 0 && backendimage == null) {
      return null;
    }
    try {
      let formData = new FormData();
      formData.append("message", input);
      if (backendimage) {
        formData.append("image", backendimage);
      }
      // console.log(formData);
      let result = await axios.post(
        `${serverUrl}/api/message/send/${selecteduser._id}`,
        formData,
        { withCredentials: true }
      );
      console.log(result.data);
      dispatch(setmessages([...messages, result.data]));
      setinput("");
      setfrontendimage(null);
      setbackendimage(null);
    } catch (error) {
      console.log(error);
    }
  };

  const onEmojiClick = (emojiData) => {
    setinput((previnput) => previnput + emojiData.emoji);
    setshowpicker(false);
  };

  useEffect(() => {
    socket.on("newMessage", (mess) => {
      const notification = new Audio(sound);
      notification.play();
      dispatch(setmessages([...messages, mess]));
    });
    return () => socket.off("newMessage");
  }, [messages, setmessages]);

  return (
    <div
      className={`lg:w-[70%] relative lg:flex ${
        selecteduser ? "flex" : "hidden"
      } w-full h-full bg-slate-300 border-l-2 border-gray-300`}
    >
      {selecteduser && (
        <div className="w-full h-[100vh] flex flex-col">
          <div className="w-full h-[100px] bg-[#2084a5] rounded-b-[30px] shadow-gray-500 shadow-lg flex items-center px-[20px] gap-[20px]">
            <div
              className="cursor-pointer "
              onClick={() => dispatch(setselecteduser(null))}
            >
              <IoArrowBack className="w-[30px] h-[30px] text-white" />
            </div>
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-600 shadow-lg cursor-pointer ">
              <img
                src={selecteduser?.image || dp}
                alt=""
                className="h-[100%]"
              />
            </div>
            <h1 className="text-gray-800 font-semibold text-[23px]">
              {selecteduser?.name || "User"}
            </h1>
          </div>
          <div className="w-full h-[78%] flex flex-col py-[50px] px-[20px] overflow-auto gap-[20px] ">
            {showpicker && (
              <div className="absolute bottom-[120px] left-[20px]">
                <EmojiPicker
                  width={300}
                  height={400}
                  className="shadow-gray-500 shadow-lg z-[10]"
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}
            {messages &&
              messages.map((mess) =>
                mess.sender == userdata._id ? (
                  <SenderMessage image={mess.image} message={mess.message} />
                ) : (
                  <Receviermessage image={mess.image} message={mess.message} />
                )
              )}
          </div>
        </div>
      )}
      {!selecteduser && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className="text-gray-800 font-bold text-[40px]">
            Welcome to Chatly
          </h1>
          <span className=" font-semibold text-[#2084a5] text-[30px]">
            Chat friendly...!
          </span>
          <h5 className="font-serif">Created By Vinayak Soni....!</h5>
        </div>
      )}

      {selecteduser && (
        <div className="w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center">
          <img
            src={frontendimage}
            alt=""
            className="w-[130px] absolute bottom-[100px] right-[7%] rounded-lg  shadow-gray-500 shadow-lg"
          />
          <form
            className="w-[95%] lg-w-[70%] h-[60px] bg-[rgb(23,151,194)] shadow-gray-400 shadow-lg rounded-full flex  items-center gap-[20px] px-[20px] relative"
            onSubmit={handlesendmessage}
          >
            <div onClick={() => setshowpicker((prev) => !prev)}>
              <RiEmojiStickerFill className="w-[25px] h-[25px] text-white cursor-pointer" />
            </div>
            <input
              type="file"
              ref={image}
              hidden
              accept="image/*"
              onChange={handelimage}
            />
            <input
              type="text"
              className="w-full h-full bg-transparent placeholder-white outline-none border-0 text-[19px] text-white"
              placeholder="Message....."
              value={input}
              onChange={(e) => setinput(e.target.value)}
            />
            <div onClick={() => image.current.click()}>
              <FaImages className="w-[25px] h-[25px] text-white cursor-pointer" />
            </div>
            {(input.length > 0 || backendimage != null) && (
              <button>
                <IoMdSend className="w-[25px] h-[25px] text-white cursor-pointer hover:scale-150" />
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default Messagearea;
