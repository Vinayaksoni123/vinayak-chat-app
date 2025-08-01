import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setmessages } from "../redux/messageSlice.js";
import { serverUrl } from "../main.jsx";

const getMessages = () => {
  let dispatch = useDispatch();
  let { selecteduser, userdata } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        let result = await axios.get(
          `${serverUrl}/api/message/get/${selecteduser._id}`,
          {
            withCredentials: true,
          }
        );
        // console.log(result);
        dispatch(setmessages(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [selecteduser, userdata]);
};

export default getMessages;
