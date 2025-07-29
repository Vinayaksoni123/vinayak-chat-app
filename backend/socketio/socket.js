// import http from "http";
// import express from "express";
// import { Server } from "socket.io";
// let app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "https://vinayak-chat-app-1.onrender.com",
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

import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors"; // Import cors middleware

const app = express();

// Configure CORS for Express routes
const corsOptions = {
  origin: "https://vinayak-chat-app-1.onrender.com",
  credentials: true,
};
app.use(cors(corsOptions));

const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "https://vinayak-chat-app-1.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
  // Add ping/pong timeouts for Render.com's proxy
  pingTimeout: 60000,
  pingInterval: 25000,
});

const userSocketMap = {};

export const getReceiverSocketId = (receiver) => {
  return userSocketMap[receiver];
};

// Handle preflight OPTIONS requests for all routes
app.options("*", cors(corsOptions));

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
