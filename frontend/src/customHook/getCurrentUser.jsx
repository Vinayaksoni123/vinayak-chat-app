import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setuserdata } from "../redux/userSlice";
import { serverUrl } from "../main";

const getCurrentUser = () => {
  let dispatch = useDispatch();
  let { userdata } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        let result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        // console.log(result);
        dispatch(setuserdata(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [userdata]);
};

export default getCurrentUser;
