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
  const { selecteduser } = useSelector((state) => state.user);
  const [retryCount, setRetryCount] = React.useState(0);

  useEffect(() => {
    // Skip if no user selected
    if (!selecteduser?._id) {
      dispatch(setmessages([]));
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    const fetchMessages = async (attempt = 1) => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/message/get/${selecteduser._id}`,
          {
            withCredentials: true,
            signal: controller.signal
          }
        );

        if (!isMounted) return;

        if (response.data?.success) {
          dispatch(setmessages(response.data.messages || []));
          setRetryCount(0); // Reset retry count on success
        } else {
          handleErrorResponse(response.data);
          dispatch(setmessages([]));
        }
      } catch (error) {
        if (!isMounted) return;

        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
          return;
        }

        handleApiError(error, attempt);
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
        case "UNAUTHORIZED":
          toast.error("Please login again");
          // Optionally redirect to login
          break;
        default:
          toast.error(errorData?.message || "Failed to load messages");
      }
    };

    const handleApiError = (error, attempt) => {
      // Server errors (500) - implement retry logic
      if (error.response?.status >= 500 && attempt < 3) {
        const delay = attempt * 1000; // Exponential backoff
        console.warn(`Retrying in ${delay}ms... (Attempt ${attempt})`);
        setTimeout(() => fetchMessages(attempt + 1), delay);
        setRetryCount(attempt);
        return;
      }

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

      console.error("Message fetch error:", {
        error: error.message,
        config: error.config,
        response: error.response?.data
      });

      dispatch(setmessages([]));
    };

    fetchMessages();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selecteduser?._id, dispatch, retryCount]);

  // Optional: Show loading state based on retryCount
  return null;
};

export default getMessages;
