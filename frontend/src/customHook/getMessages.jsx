// import axios from "axios";
// import React from "react";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import { setmessages } from "../redux/messageSlice.js";
// import { serverUrl } from "../main.jsx";

// const getMessages = () => {
//   let dispatch = useDispatch();
//   let { selecteduser, userdata } = useSelector((state) => state.user);
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         let result = await axios.get(
//           `${serverUrl}/api/message/get/${selecteduser._id}`,
//           {
//             withCredentials: true,
//           }
//         );
//         // console.log(result);
//         dispatch(setmessages(result.data));
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchMessages();
//   }, [selecteduser, userdata]);
// };

// export default getMessages;

// new code
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
      // Don't try to fetch if no user is selected
      if (!selecteduser?._id) {
        dispatch(setmessages([]));
        return;
      }

      try {
        let result = await axios.get(
          `${serverUrl}/api/message/get/${selecteduser._id}`,
          {
            withCredentials: true,
          }
        );

        // Check if response has data
        if (result.data) {
          dispatch(setmessages(result.data.messages || []));
        } else {
          console.log("No messages found");
          dispatch(setmessages([]));
        }
      } catch (error) {
        console.log("Error fetching messages:", error);
        
        // Handle specific error cases
        if (error.response) {
          if (error.response.data?.code === "USER_NOT_FOUND") {
            console.log("Selected user not found");
          } else if (error.response.data?.code === "INVALID_ID") {
            console.log("Invalid user ID format");
          }
        }
        
        dispatch(setmessages([]));
      }
    };

    fetchMessages();

  }, [selecteduser, userdata, dispatch]);
};

export default getMessages;
