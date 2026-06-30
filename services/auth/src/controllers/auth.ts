import User from '../model/User.js';
import jwt from 'jsonwebtoken';
import TryCatch from '../middlewares/trycatch.js';
import { AuthenticatedRequest } from '../middlewares/isAuth.js';
import { oauth2Client } from '../config/googleConfig.js';
import axios from 'axios';
import type { Response } from 'express';

export const loginUser = TryCatch(async (req, res) => {
    const {code} = req.body;

    if(!code){
        return res.status(400).json({
            message:"Authorization code is required",
        });
    }

    const googleRes = await oauth2Client.getToken(code)

    oauth2Client.setCredentials(googleRes.tokens)

    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
    
    const { email, name, picture } = userRes.data;
    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name,
            email,
            image: picture,
        });
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
        expiresIn: '18d',
    });
    res.status(200).json({
        message: "login sucess",
        token,
        user,
    });
})

const allowedRoles = ["customer","rider","seller"] as const;
type Role = (typeof allowedRoles)[number];

export const addUserRole = TryCatch(async(req:AuthenticatedRequest, res) =>{
    if(!req.user?._id){
        return res.status(400).json({
            message: "Unauthorized - No user ID",
        });
    }

    const { role } = req.body;

    if(!allowedRoles.includes(role)){
        return res.status(400).json({
            message:"Invalid role",
        })
    }

    const user = await User.findByIdAndUpdate(req.user._id, { role }, { new: true });

    if(!user){
        return res.status(404).json({
            message:"User not found",
        })
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
        expiresIn: '18d',
    });

    res.json({ user, token });
})

export const myProfile = TryCatch(async(req:AuthenticatedRequest, res) =>{
    const user = req.user;
    res.json(user);
})



export const reverseLocation = async (req:AuthenticatedRequest, res:Response) => {
    const lat = req.query.lat;
    const lon = req.query.lon;

    if (!lat || !lon) {
        return res.status(400).json({ message: "lat and lon are required" });
    }

    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
            {
                headers: {
                    "User-Agent": "FoodDeliveryApp/1.0",
                    "Accept-Language": "en",
                    "From": "your-email@example.com",
                },
                timeout: 10000,
            }
        );

        return res.json(response.data);
    } catch (error: any) {
        console.error("Location lookup failed:", error.message);
        return res.status(502).json({
            message: "Location service unavailable",
            error: error.message,
        });
    }
};