import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const login = async(req,res)=>{
    const { email , password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: 'All fields are required'});
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "Invalid credentials"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message: "Invalid credentials"});
    }
    generateToken(user._id, res);
    return res.status(200).json({
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profilepic: user.profilepic,
    });
}

export const signup = async(req,res)=>{
    const {fullname, email,password } = req.body;
    try{
        if(!fullname || !email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }
        if(password.length<6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "Email already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullname,
            email,
            password: hashedpass,
        })
        await newUser.save();

        if(newUser){
            //generate jwt session
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilepic: newUser.profilepic,
            });
        }
        else{
            return res.status(400).json({message:"Invalid User data"});
        }

        
    }catch(error){
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

export const logout = (req,res)=>{
    const cookie = req.cookies.token;
    if(!cookie){
        return res.status(400).json({message: "No active session found"});
    }
    res.clearCookie('token');
    return res.status(200).json({message: "Logout successful"});
}

export const update_pic = async(req,res)=>{
    try {
        const { profilepic } = req.body;
        const userId = req.user._id;

        if(!profilepic){
            return res.status(400).json({ message: "Profile pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilepic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilepic:uploadResponse.secure_url}, {new:true}); 
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error at update_pic:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const check= (req,res)=>{
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Error at check:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}