import { useEffect, useState, useRef } from "react";
import { useMessageStore } from "../store/useMessageStore";
import chatIcon from "../assets/avatar.svg";
import { useAuthStore } from "../store/useAuthStore";
import imageCompression from "browser-image-compression";
import { showToast } from "../lib/toast";

const formatTimestamp = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString();
};

const HomePage = ({ authUser }) => {
  const {
    getUsers,
    users,
    getMessages,
    messages,
    sendMessage,
    isloading,
    subscribeToMessages,
    unsubscribeToMessages,
  } = useMessageStore();
  const { onlineUsers } = useAuthStore();
  const [currentUser, setCurrentUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const imageInputRef = useRef(null);
  const msgContainerRef = useRef(null);

  useEffect(() => {
    getUsers();
  }, [getUsers, onlineUsers]);

  useEffect(() => {
    subscribeToMessages();
    return () => {
      unsubscribeToMessages();
    };
  }, [subscribeToMessages, unsubscribeToMessages]);

  useEffect(() => {
    if (currentUser && currentUser._id) {
      getMessages(currentUser);
    }
  }, [currentUser, getMessages]);

  useEffect(() => {
    if (msgContainerRef.current) {
      msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUserClick = (user) => {
    setCurrentUser(user);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser._id) return;
    if (!messageInput.trim() && !imageFile) return;

    let base64Image = null;
    if (imageFile) {
      try {
        const options = {
          maxSizeMB: 0.05, // ~50KB
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(imageFile, options);
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      } catch (error) {
        showToast("Failed to process image.", "error");
        console.error("Image processing error:", error);
        return;
      }
    }

    sendMessage(messageInput, base64Image, currentUser);
    setMessageInput("");
    setImageFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Filter users based on search + online toggle
  let filteredUsers = [];
  if(users){
  filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullname
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const isOnline = onlineUsers.includes(user._id);
    return matchesSearch && (!showOnlineOnly || isOnline);
  });
  }

  return (
    <div className="flex h-screen">
      {/* User List */}
      <div className="bg-gray-800 w-[30%] h-full overflow-y-auto p-4 flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4">Users</h2>

        {/* Controls */}
        <div className="flex gap-2 mb-3">
          <button
            className={`px-3 py-1 rounded text-sm font-medium ${
              showOnlineOnly ? "bg-green-600 text-white" : "bg-gray-600 text-white"
            }`}
            onClick={() => setShowOnlineOnly((prev) => !prev)}
          >
            {showOnlineOnly ? "All Users" : "Online Users"}
          </button>
        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 mb-4 w-full rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* User list items */}
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isonline = onlineUsers.includes(user._id);
            return (
              <div
                key={user._id}
                className={`flex items-center gap-3 p-2 mb-2 rounded cursor-pointer ${
                  currentUser?._id === user._id ? "bg-blue-600" : "bg-gray-700"
                }`}
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={user.profilepic ? user.profilepic : chatIcon}
                  alt={user.fullname}
                  className={`w-12 h-12 rounded-full object-cover border-4 ${
                    isonline ? "border-green-500" : ""
                  }`}
                />
                <div>
                  <p className="text-white">{user.fullname}</p>
                  <p className="text-white text-sm opacity-50">
                    {isonline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-400">No users found.</div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex flex-col w-[70%] h-full bg-gray-900 p-4">
        <h2 className="text-xl font-bold text-white mb-4">
          {currentUser?.fullname
            ? `Chat with ${currentUser.fullname}`
            : "Select a user to chat"}
        </h2>

        <div
          ref={msgContainerRef}
          className="flex flex-col gap-2 flex-1 overflow-y-auto bg-gray-800 rounded p-4 mb-4"
        >
          {isloading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : messages && messages.length > 0 ? (
            messages.map((msg, idx) => {
              const isMine = msg.sender === authUser?._id;
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col max-w-xs ${
                    isMine ? "self-end" : "self-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg shadow ${
                      isMine
                        ? "bg-gradient-to-r from-red-500 to-yellow-500 text-white"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 text-gray-200"
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Sent image"
                        className="mb-2 max-w-[200px] rounded"
                      />
                    )}
                    {msg.message}
                  </div>
                  <div className="text-xs text-gray-300 mt-1 text-right">
                    {formatTimestamp(msg.createdAt)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-400">No messages yet.</div>
          )}
        </div>

        {currentUser?._id && (
          <form
            onSubmit={handleSendMessage}
            className="flex gap-2 items-center bg-gray-800 p-2 rounded-lg"
          >
            <input
              type="text"
              className="flex-1 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
            />

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              ref={imageInputRef}
              onChange={(e) => setImageFile(e.target.files[0])}
            />

            <label
              htmlFor="imageUpload"
              className="cursor-pointer p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
              title="Upload image"
            >
              📎
            </label>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomePage;
