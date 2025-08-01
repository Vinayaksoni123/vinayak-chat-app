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

// export const getMessages = async (req, res) => {
//   try {
//     let sender = req.userid;
//     let { receiver } = req.params;
//     let conversation = await Conversation.findOne({
//       participants: { $all: [sender, receiver] },
//     }).populate("message");
//     if (!conversation) {
//       return res.status(400).json({ message: "conversation not found" });
//     }
//     return res.status(200).json(conversation?.message);
//   } catch (error) {
//     return res.status(500).json({ message: "getmessage error " });
//   }
// };

// new code
export const getMessages = async (req, res) => {
  try {
    const sender = req.userid;
    const { receiver } = req.params;

    // Validate receiver ID format
    if (!mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid user ID format",
        code: "INVALID_ID"
      });
    }

    // Check if receiver exists
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({ 
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND"
      });
    }

    // Find conversation or create new if doesn't exist
    let conversation = await Conversation.findOneAndUpdate(
      { participants: { $all: [sender, receiver] } },
      { $setOnInsert: { participants: [sender, receiver], message: [] } },
      { 
        new: true,
        upsert: true,
        populate: {
          path: "message",
          options: { sort: { createdAt: -1 } } // Sort by newest first
        }
      }
    );

    return res.status(200).json({
      success: true,
      messages: conversation.message || [],
      participants: conversation.participants
    });

  } catch (error) {
    console.error("GetMessages error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      code: "SERVER_ERROR"
    });
  }
};
