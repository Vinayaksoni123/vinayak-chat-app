import http from "http";
import express from "express";
import { Server } from "socket.io";
let app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://skype-v.onrender.com",
  },
});
const userSocketMap = {};

export const getReceiverSocketId = (receiver) => {
  return userSocketMap[receiver];
};

io.on("connection", (socket) => {
  const userid = socket.handshake.query.userid;
  if (userid != undefined) {
    userSocketMap[userid] = socket.id;
  }
  io.emit("getOnlineUser", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    delete userSocketMap[userid];
    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });
});
export { app, server, io };

// import http from "http";
// import express from "express";
// import { Server } from "socket.io";
// let app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "https://localhost:5173",
//   },
// });
// const userSocketMap = {};

// export const getReceiverSocketId = (receiver) => {
//   return userSocketMap[receiver];
// };

// io.on("connection", (socket) => {
//   const userid = socket.handshake.query.userid;
//   if (userid != undefined) {
//     userSocketMap[userid] = socket.id;
//   }
//   io.emit("getOnlineUser", Object.keys(userSocketMap));
//   socket.on("disconnect", () => {
//     delete userSocketMap[userid];
//     io.emit("getOnlineUser", Object.keys(userSocketMap));
//   });
// });
// export { app, server, io };
