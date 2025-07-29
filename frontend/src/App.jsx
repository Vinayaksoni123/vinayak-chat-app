import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import getCurrentUser from "./customHook/getCurrentUser.jsx";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import getOtherUsers from "./customHook/getOtherUsers.jsx";
import { io } from "socket.io-client";
import { setonlineuser, setsocket } from "./redux/userSlice.js";
import { serverUrl } from "./main.jsx";

function App() {
  getCurrentUser();
  getOtherUsers();
  let { userdata, socket } = useSelector((state) => state.user);
  let dispatch = useDispatch();

  useEffect(() => {
    if (userdata) {
      const socketio = io(`${serverUrl}`, {
        query: {
          userid: userdata?._id,
        },
      });
      dispatch(setsocket(socketio));
      socketio.on("getOnlineUser", (users) => {
        dispatch(setonlineuser(users));
      });
      return () => socketio.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setsocket(null));
      }
    }
  }, [userdata]);

  return (
    <Routes>
      <Route
        path="/login"
        element={!userdata ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!userdata ? <Signup /> : <Navigate to="/profile" />}
      />
      <Route
        path="/"
        element={userdata ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={userdata ? <Profile /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
}

export default App;
