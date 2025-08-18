import jwt from "jsonwebtoken";


export const generateToken = async(userId,res)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '5d'});
    res.cookie('token', token, {
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
        httpOnly: true,
        sameSite: 'strict',
    });
    return token;
}