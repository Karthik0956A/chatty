import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    }
});
const userSocketmap = {};
export const getReceiverSocketId = (userId) => {
    return userSocketmap[userId];
};

io.on('connection', (socket) => {  
    console.log(`User connected: ${socket.id}`);
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketmap[userId] = socket.id;

    }
    //to broadcast online users
    io.emit("getOnlineUsers",Object.keys(userSocketmap));
    
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete userSocketmap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketmap));
    });
});
export {io, server, app};