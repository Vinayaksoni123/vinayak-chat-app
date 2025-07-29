import express from "express";
import dotenv from "dotenv";
import connectdb from "./config/db.js";
import router from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userrouter from "./routes/user.js";
import messagerouter from "./routes/message.js";
import { app, server } from "./socketio/socket.js";
dotenv.config();

const port = process.env.PORT || 5000;
// const app = express();
app.use(
  cors({
    origin: "https://vinayak-chat-app-1.onrender.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", router);
app.use("/api/user", userrouter);
app.use("/api/message", messagerouter);

server.listen(port, () => {
  connectdb();
  console.log(`server is listen on port ${port} `);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Chat App Backend!");
});
