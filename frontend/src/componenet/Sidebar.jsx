import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { RiLogoutCircleLine } from "react-icons/ri";
import axios from "axios";
import {
  setotheruserdata,
  setsearchdata,
  setselecteduser,
  setuserdata,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import { toast } from "react-toastify";

function Sidebar() {
  let { userdata, otherusers, selecteduser, onlineuser, searchdata } =
    useSelector((state) => state.user);
  let [input, setinput] = useState("");
  let [search, setsearch] = useState(false);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const handlelogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setuserdata(null));
      dispatch(setotheruserdata(null));
      toast("Logout Successful");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${input}`,
        {
          withCredentials: true,
        }
      );
      dispatch(setsearchdata(result.data));
      // setinput("");
      // console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (input) {
      handleSearch();
    }
  }, [input]);

  return (
    <div
      className={`lg:w-[30%] lg:block overflow-hidden relative ${
        !selecteduser ? "block" : "hidden"
      }  w-full h-full bg-slate-200`}
    >
      {/* logout div  */}
      <div
        className="w-[50px] h-[50px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-600 shadow-lg bg-[#20c7ff]  cursor-pointer fixed bottom-[10px] left-3"
        onClick={handlelogout}
      >
        <RiLogoutCircleLine className="w-[25px] h-[25px]" />
      </div>
      {/* search user data */}
      {input.length > 0 && (
        <div className="flex w-full absolute top-[250px] bg-white h-full overflow-y-auto flex-col gap-[10px] z-[125] rounded-t-[50px] items-center pt-[40px]">
          {searchdata?.map((user) => (
            <div
              className="w-[95%] h-[70px] flex items-center gap-[20px]  border-b-4 border-gray-400 rounded-full px-[10px] hover:bg-[#78cae5] cursor-pointer "
              onClick={() => {
                dispatch(setselecteduser(user));
                setinput("");
                setsearch(false);
              }}
            >
              <div className="relative rounded-full  shadow-gray-600 shadow-lg bg-white flex justify-center items-center">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center">
                  <img src={user.image || dp} alt="" className="h-[100%]" />
                </div>
                {onlineuser?.includes(user._id) && (
                  <span className="w-[15px] h-[15px] rounded-full absolute bottom-0 right-0 bg-green-400 shadow-gray-600 shadow-lg"></span>
                )}
              </div>

              <h1 className="text-gray-800 font-semibold text-[23px]">
                {user.name || user.username}
              </h1>
            </div>
          ))}
        </div>
      )}

      {/* top user credential */}
      <div className="w-full h-[260px] bg-[#20c7ff] rounded-b-[30%]  shadow-gray-400 shadow-lg flex flex-col justify-center  px-[20px]">
        <h1 className="text-white font-bold text-[25px] font-serif">Skype-V</h1>
        <div className="w-full flex justify-between items-center">
          <h1 className="text-gray-600 font-bold text-[25px]">
            Hii, {userdata.name || userdata.username}
          </h1>
          <div
            className="w-[60px] h-[60px] rounded-full overflow-hidden bg-white flex justify-center items-center shadow-gray-600 shadow-lg cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <img src={userdata.image || dp} alt="" className="h-[100%]" />
          </div>
        </div>
        <div className="w-full flex items-center gap-[20px] overflow-y-auto-auto ">
          {!search && (
            <div
              className="w-[50px] h-[50px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-600 shadow-lg bg-white cursor-pointer"
              onClick={() => setsearch(true)}
            >
              <IoSearch className="w-[25px] h-[25px]" />
            </div>
          )}
          {search && (
            <form className="w-full h-[60px] rounded-full overflow-hidden flex  items-center shadow-gray-600 shadow-lg bg-white gap-[10px] mt-[10px] px-[10px]">
              <IoSearch className="w-[25px] h-[25px]" />
              <input
                type="text"
                placeholder="Search...."
                className="w-full h-full outline-0 border-0 px-[10px]p-[10px] text-[17px]"
                value={input}
                onChange={(e) => setinput(e.target.value)}
              />
              <RxCross2
                className="w-[25px] h-[25px] cursor-pointer "
                onClick={() => {
                  setsearch(false);
                  setinput("");
                }}
              />
            </form>
          )}
          {!search &&
            otherusers?.map(
              (user) =>
                onlineuser?.includes(user._id) && (
                  <div
                    className="relative rounded-full  shadow-gray-600 shadow-lg bg-white flex justify-center items-center mt-[15px] cursor-pointer"
                    onClick={() => dispatch(setselecteduser(user))}
                  >
                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center">
                      <img src={user.image || dp} alt="" className="h-[100%]" />
                    </div>
                    <span className="w-[15px] h-[15px] rounded-full absolute bottom-0 right-0 bg-green-400 shadow-gray-600 shadow-lg"></span>
                  </div>
                )
            )}
        </div>
      </div>
      <div className="w-full h-[60%] flex flex-col overflow-auto gap-[20px] mt-[20px] items-center">
        {otherusers?.map((user) => (
          <div
            className="w-[90%] h-[60px] flex items-center justify-start gap-[20px] bg-white shadow-gray-400 shadow-lg rounded-full p-[10px] hover:bg-slate-200 cursor-pointer "
            onClick={() => dispatch(setselecteduser(user))}
          >
            <div className="relative rounded-full  shadow-gray-600 shadow-lg bg-white flex justify-center items-center">
              <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center">
                <img src={user.image || dp} alt="" className="h-[100%]" />
              </div>
              {onlineuser?.includes(user._id) && (
                <span className="w-[15px] h-[15px] rounded-full absolute bottom-0 right-0 bg-green-400 shadow-gray-600 shadow-lg"></span>
              )}
            </div>

            <h1 className="text-gray-800 font-semibold text-[23px]">
              {user.name || user.username}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
