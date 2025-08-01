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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setmessages } from "../redux/messageSlice.js";
import { serverUrl } from "../main.jsx";
import { toast } from "react-toastify";

const getMessages = () => {
  const dispatch = useDispatch();
  const { selecteduser, userdata } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMessages = async () => {
      // Skip if no user selected
      if (!selecteduser?._id) {
        dispatch(setmessages([]));
        return;
      }

      try {
        const response = await axios.get(
          `${serverUrl}/api/message/get/${selecteduser._id}`,
          { withCredentials: true }
        );

        if (response.data?.success) {
          dispatch(setmessages(response.data.messages || []));
        } else {
          handleErrorResponse(response.data);
          dispatch(setmessages([]));
        }
      } catch (error) {
        handleApiError(error);
        dispatch(setmessages([]));
      }
    };

    const handleErrorResponse = (errorData) => {
      switch (errorData?.code) {
        case "INVALID_ID":
          toast.error("Invalid user selected");
          break;
        case "USER_NOT_FOUND":
          toast.error("User not found");
          break;
        default:
          toast.error(errorData?.message || "Failed to load messages");
      }
    };

    const handleApiError = (error) => {
      if (error.response) {
        // Server responded with error status
        handleErrorResponse(error.response.data);
      } else if (error.request) {
        // Request was made but no response
        toast.error("Network error - please check your connection");
      } else {
        // Other errors
        toast.error("Error loading messages");
      }
      console.error("Message fetch error:", error);
    };

    fetchMessages();

  }, [selecteduser, userdata, dispatch]);
};

export default getMessages;
  }, [selecteduser, userdata, dispatch]);
};

export default getMessages;
