import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setuserdata } from "../redux/userSlice.js";
import { serverUrl } from "../main.jsx";
import { toast } from "react-toastify";

function Signup() {
  const [show, setshow] = useState();
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  let dispatch = useDispatch();
  // let { userdata } = useSelector((state) => state.user);
  // console.log("userdata", userdata);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userinfo = {
      username: data.fullname,
      email: data.email,
      password: data.password,
    };
    setloading(true);
    // console.log(userinfo);
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/signup`,
        userinfo,
        { withCredentials: true }
      );
      console.log("Response data", response.data);
      dispatch(setuserdata(response.data));
      setloading(false);
      toast("Signup successfully...");
    } catch (error) {
      setloading(false);
      if (error.response) {
        toast.error("Invailed user credential..");
        console.log(error);
      }
    }
  };
  return (
    <div className="w-full h-[100vh] bg-slate-200 flex justify-center items-center">
      <div className="w-full max-w-[500px] h-[620px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]">
        <div className="w-full h-[200px] bg-[#20c7ff] rounded-b-[30%]  shadow-gray-400 shadow-lg flex justify-center items-center">
          <h1 className="text-gray-600 font-bold text-[30px]">
            Welcome To <span className="text-white">vsChat App</span>
          </h1>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-[20px] items-center"
        >
          <input
            type="text"
            placeholder="username"
            className="w-[90%] h-[60px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg  shadow-gray-400 shadow-lg text-gray-700 text-[19px]"
            {...register("fullname", { required: true })}
          />
          {errors.fullname && (
            <span className="text-red-500 text-sm font-bold">
              This field is required
            </span>
          )}
          <input
            type="email"
            placeholder="email"
            className="w-[90%] h-[60px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg  shadow-gray-400 shadow-lg text-gray-700 text-[19px]"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm font-bold">
              This field is required
            </span>
          )}

          <div className="w-[90%] h-[50px] border-2 border-[#20c7ff] rounded-lg overflow-hidden  shadow-gray-400 shadow-lg relative">
            <input
              type={`${show ? "text" : "password"}`}
              placeholder="password"
              className="w-full h-full outline-none px-[20px] py-[10px] bg-white text-gray-700 text-[19px]"
              {...register("password", { required: true })}
            />
            <span
              className="absolute top-[8px] right-[10px] text-blue-500 font-bold text-[20px] cursor-pointer"
              onClick={() => setshow((prev) => !prev)}
            >
              {`${show ? "Hidden" : "Show"}`}
            </span>
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm font-bold">
              This field is required
            </span>
          )}

          <button
            className="px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-[80%] mt-[20px] font-bold hover:shadow-inner"
            disabled={loading}
          >
            {loading ? "Loading..." : "Signup"}
          </button>
          <p className="cursor-pointer">
            Already have an Account
            <span
              className="text-[#5eb9d7] font-bold"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
