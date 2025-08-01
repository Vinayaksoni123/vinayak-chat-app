// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { setselecteduser, setuserdata } from "../redux/userSlice";
// import { serverUrl } from "../main";
// import { toast } from "react-toastify";
// // import { toast } from "react-toastify";

// function Login() {
//   const [show, setshow] = useState();
//   const navigate = useNavigate();
//   const [loading, setloading] = useState(false);
//   let dispatch = useDispatch();
//   let { userdata } = useSelector((state) => state.user);
//   console.log(userdata);
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (data) => {
//     const userinfo = {
//       email: data.email,
//       password: data.password,
//     };
//     setloading(true);
//     // console.log(userinfo);
//     try {
//       const response = await axios.post(
//         `${serverUrl}/api/auth/login`,
//         userinfo,
//         { withCredentials: true }
//       );
//       // console.log("Response data", response.data);

//       dispatch(setuserdata(response.data));
//       dispatch(setselecteduser(null));
//       setloading(false);
//       // navigate("/");
//       alert("You are loged in successfully...");
//       window.location.reload();
//       // toast.success("Login Succesfully");
//     } catch (error) {
//       setloading(false);
//       if (error.response) {
//         toast.error("Invailed user credential ");
//         console.log(error);
//       }
//     }
//   };
//   return (
//     <div className="w-full h-[100vh] bg-slate-200 flex justify-center items-center">
//       <div className="w-full max-w-[500px] h-[620px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]">
//         <div className="w-full h-[200px] bg-[#20c7ff] rounded-b-[30%]  shadow-gray-400 shadow-lg flex justify-center items-center">
//           <h1 className="text-gray-600 font-bold text-[30px]">
//             Login To <span className="text-white">vsChat App</span>
//           </h1>
//         </div>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="w-full flex flex-col gap-[20px] items-center"
//         >
//           <input
//             type="email"
//             placeholder="email"
//             className="w-[90%] h-[60px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg  shadow-gray-400 shadow-lg text-gray-700 text-[19px]"
//             {...register("email", { required: true })}
//           />
//           {errors.email && (
//             <span className="text-red-500 text-sm font-bold">
//               This field is required
//             </span>
//           )}

//           <div className="w-[90%] h-[50px] border-2 border-[#20c7ff] rounded-lg overflow-hidden  shadow-gray-400 shadow-lg relative">
//             <input
//               type={`${show ? "text" : "password"}`}
//               placeholder="password"
//               className="w-full h-full outline-none px-[20px] py-[10px] bg-white text-gray-700 text-[19px]"
//               {...register("password", { required: true })}
//             />
//             <span
//               className="absolute top-[8px] right-[10px] text-blue-500 font-bold text-[20px] cursor-pointer"
//               onClick={() => setshow((prev) => !prev)}
//             >
//               {`${show ? "Hidden" : "Show"}`}
//             </span>
//           </div>
//           {errors.password && (
//             <span className="text-red-500 text-sm font-bold">
//               This field is required
//             </span>
//           )}

//           <button
//             className="px-[20px] py-[10px]  bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-[80%] mt-[30px] font-bold hover:shadow-inner"
//             disabled={loading}
//           >
//             {loading ? "Loading.." : "Login"}
//           </button>
//           <p className="cursor-pointer mt-[20px]">
//             Want to create a new Account
//             <span
//               className="text-[#5eb9d7] font-bold"
//               onClick={() => navigate("/signup")}
//             >
//               SignUp
//             </span>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;


// new code
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setselecteduser, setuserdata } from "../redux/userSlice";
import { serverUrl } from "../main";
import { toast } from "react-toastify";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userdata } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };

    setLoading(true);
    
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/login`,
        userInfo,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      // Extract user data without sensitive information
      const { password, ...userWithoutPassword } = response.data.user;
      
      dispatch(setuserdata(userWithoutPassword));
      dispatch(setselecteduser(null));
      
      toast.success("Login successful!");
      navigate("/"); // Navigate to home page instead of reloading
      
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex justify-center items-center">
      <div className="w-full max-w-[500px] h-[620px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]">
        <div className="w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex justify-center items-center">
          <h1 className="text-gray-600 font-bold text-[30px]">
            Login To <span className="text-white">vsChat App</span>
          </h1>
        </div>
        
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-[20px] items-center"
        >
          <div className="w-[90%]">
            <input
              type="email"
              placeholder="Email"
              className="w-full h-[60px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg shadow-gray-400 shadow-lg text-gray-700 text-[19px]"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm font-bold">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="w-[90%]">
            <div className="w-full h-[50px] border-2 border-[#20c7ff] rounded-lg overflow-hidden shadow-gray-400 shadow-lg relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full h-full outline-none px-[20px] py-[10px] bg-white text-gray-700 text-[19px]"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
              />
              <button
                type="button"
                className="absolute top-[8px] right-[10px] text-blue-500 font-bold text-[20px] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm font-bold">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-[80%] mt-[30px] font-bold hover:shadow-inner disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : "Login"}
          </button>

          <p className="text-center mt-[20px]">
            Want to create a new account?{" "}
            <span
              className="text-[#5eb9d7] font-bold cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
