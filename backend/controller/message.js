import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../moedel/conversation.js";
import Message from "../moedel/message.js";
import { getReceiverSocketId, io } from "../socketio/socket.js";

export const sendmessage = async (req, res) => {
  try {
    let sender = req.userid;
    let { receiver } = req.params;
    let { message } = req.body;
    // console.log(sender, receiver, message);
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });
    let newmessage = await Message.create({
      sender,
      receiver,
      message,
      image,
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        message: [newmessage._id],
      });
    } else {
      conversation.message.push(newmessage._id);
      await conversation.save();
    }

    const receiverSocketId = getReceiverSocketId(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newmessage);
    }

    return res.status(201).json(newmessage);
  } catch (error) {
    return res.status(500).json({ message: "send message error", error });
  }
};

export const getMessages = async (req, res) => {
  try {
    let sender = req.userid;
    let { receiver } = req.params;
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("message");
    if (!conversation) {
      return res.status(400).json({ message: "conversation not found" });
    }
    return res.status(200).json(conversation?.message);
  } catch (error) {
    return res.status(500).json({ message: "getmessage error " });
  }
};
