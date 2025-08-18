import { useEffect, useState, useRef } from "react";
import { useMessageStore } from "../store/useMessageStore";
import chatIcon from "../assets/chat.png";
import { useAuthStore } from "../store/useAuthStore";

const formatTimestamp = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString();
};

const HomePage = ({ authUser }) => {
  const { getUsers, users, getMessages, messages, sendMessage, isloading, subscribeToMessages, unsubscribeToMessages } = useMessageStore();
  const { onlineUsers } = useAuthStore();
  const [currentUser, setCurrentUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  // 👉 create ref for message container
  const msgContainerRef = useRef(null);

  useEffect(() => {
    getUsers();
  }, [getUsers, onlineUsers]);

  // Subscribe to messages on mount
  useEffect(() => {
    subscribeToMessages();
    return () => {
      unsubscribeToMessages();
    };
  }, [subscribeToMessages, unsubscribeToMessages]);

  // Fetch messages when currentUser changes
  useEffect(() => {
    if (currentUser && currentUser._id) {
      getMessages(currentUser);
    }
  }, [currentUser, getMessages]);

  // 👉 Auto scroll when messages change
  useEffect(() => {
    if (msgContainerRef.current) {
      msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUserClick = (user) => {
    setCurrentUser(user);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentUser || !currentUser._id) return;
    sendMessage(messageInput, currentUser);
    setMessageInput("");
  };

  return (
    <div className="flex h-screen">
      {/* User List */}
      <div className="bg-gray-800 w-[30%] h-full overflow-y-auto p-4">
        <h2 className="text-xl font-bold text-white mb-4">Users</h2>
        {users && users.length > 0 ? (
          users.map((user) => {
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
          {currentUser?.fullname ? `Chat with ${currentUser.fullname}` : "Select a user to chat"}
        </h2>
        <div
          ref={msgContainerRef}   // 👈 added ref here
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
                      isMine ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"
                    }`}
                  >
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
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 rounded bg-gray-700 text-white"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
