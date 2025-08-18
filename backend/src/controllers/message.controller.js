import User from "../models/user.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSideBar = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in message controller getUsersForSideBar");
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        
        const message = await Message.find({
            $or:[
                { sender: senderId, receiver: userToChatId },
                { sender: userToChatId, receiver: senderId }
            ]
        })
        return res.status(200).json(message);
    } catch (error) {
        console.log("Error in message controller getMessages");
        res.status(500).json({ message: "Internal server error" });
    }
};


export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id; // from auth middleware
    const receiverId = req.params.id;
    const { message } = req.body;

    if (!message || !receiverId) {
      return res.status(400).json({ message: "Message and receiver required." });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      createdAt: new Date(),
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message.", error: err.message });
  }
};