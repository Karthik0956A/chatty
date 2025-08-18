import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cors  from 'cors';
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // allow PUT
    allowedHeaders: ["Content-Type", "Authorization"], // allow necessary headers
}));


app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);


app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
    connectDB();
})