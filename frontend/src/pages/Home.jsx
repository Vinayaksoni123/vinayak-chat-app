import React from "react";
import Sidebar from "../componenet/Sidebar";
import Messagearea from "../componenet/Messagearea";
import getMessages from "../customHook/getMessages";

function Home() {
  getMessages();
  return (
    <div className=" w-full h-[100vh] flex">
      <Sidebar />
      <Messagearea />
    </div>
  );
}

export default Home;
