import React, { useRef, useState } from "react";
import dp from "../assets/dp.webp";
import { IoIosReverseCamera } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setuserdata } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../main";
import { toast } from "react-toastify";
function Profile() {
  const { userdata } = useSelector((state) => state.user);
  const navigate = useNavigate();
  let image = useRef();
  let [loading, setloading] = useState(false);
  let dispatch = useDispatch();
  let [name, setname] = useState(userdata.name || "");
  let [frontendimage, setfrontendimage] = useState(userdata.image || dp);
  let [backendimage, setbackendimage] = useState(null);

  const handelimage = (e) => {
    let file = e.target.files[0];
    setbackendimage(file);
    setfrontendimage(URL.createObjectURL(file));
  };

  const handelprofile = async (e) => {
    setloading(true);
    e.preventDefault();
    try {
      let formdata = new FormData();
      formdata.append("name", name);
      if (backendimage) {
        formdata.append("image", backendimage);
      }
      console.log(formdata);
      let result = await axios.put(`${serverUrl}/api/user/profile`, formdata, {
        withCredentials: true,
      });
      setloading(false);
      dispatch(setuserdata(result.data));
      toast("profile edited successfully..");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setloading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center  gap-[20px]">
      <div
        className="fixed top-[20px] left-[20px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoArrowBack className="w-[50px] h-[50px]" />
      </div>
      <div
        className=" bg-white rounded-full border-4 border-[#20c7ff] shadow-gray-400 shadow-lg relative"
        onClick={() => image.current.click()}
      >
        <div className="w-[200px] h-[200px] rounded-full overflow-hidden flex justify-center items-center">
          <img src={frontendimage} alt="" className="h-[100%]" />
        </div>
        <div className="absolute bottom-3 right-3 text-gray-800 w-[33px] h-[33px] rounded-full bg-[#20c7ff]  shadow-gray-400 shadow-lg flex justify-center items-center">
          <IoIosReverseCamera className=" text-gray-800 w-[33px] h-[33px]" />
        </div>
      </div>
      <form
        action=""
        onSubmit={handelprofile}
        className="w-[95%]  max-w-[500px] flex flex-col gap[20px] items-center justify-center gap-[20px]"
      >
        <input
          type="file"
          accept="image/*"
          ref={image}
          hidden
          onChange={handelimage}
        />
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setname(e.target.value)}
          value={name}
          className="w-[90%] h-[60px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg  shadow-gray-400 shadow-lg text-gray-700 text-[19px]"
        />
        <input
          type="text"
          readOnly
          value={userdata?.username || "hello dear"}
          className="w-[90%] h-[60px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg  shadow-gray-400 shadow-lg text-gray-500 text-[19px]"
        />
        <input
          type="text"
          readOnly
          value={userdata?.email || "hello@gmail.com"}
          className="w-[90%] h-[60px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg  shadow-gray-400 shadow-lg text-gray-500 text-[19px]"
        />
        <button
          className="px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-[80%] mt-[20px] font-bold hover:shadow-inner"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
