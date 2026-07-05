import TryCatch from "../middlewares/trycatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { Request, Response } from "express";
import Restaurant from "../models/Restaurant.js";
import getBuffer  from "../config/datauri.js";
import axios from "axios";

export const addRestaurant = TryCatch(async(req:AuthenticatedRequest,res:Response)=>{
    const user = req.user;

    if(!user){
        return res.status(401).json({   
            message:"Unauthorized - User not found",
        });
    }

    const existingRestaurant = await Restaurant.findOne({
        ownerId: user?._id,
    })


//one account can only have one restaurant, so if the user already has a restaurant, we will not allow them to create another one.
    if(existingRestaurant){
        return res.status(400).json({
            message:"Restaurant already exists for this user",
        });
    }

    const { name,description, latitude, longitude, formattedAddress, phone } = req.body;

    if(!name || !latitude || !longitude){
        return res.status(400).json({
            message:"Missing required fields",
        });
    }    

    const file = req.file;
    if(!file){
        return res.status(400).json({
            message:"Missing required fields - image",
        });
    }

    const fileBuffer = getBuffer(file);

    if(!fileBuffer?.content){
        return res.status(500).json({
            message:"Failed to create file buffer",
        });
    }

    const {data: uploadResult} = await axios.post(`${process.env.UTILS_SERVICE}/api/upload`,{
        buffer: fileBuffer.content,
    }
    );

    const restaurant = await Restaurant.create({
        name,
        description,
        phone,
        image: uploadResult.url,
        ownerId: user._id,
        autoLocation: {
            type: "Point",
            coordinates:[Number(longitude), Number(latitude)],
            formattedAddress,
        },
});

    res.status(201).json({
        message:"Restaurant created successfully",
        restaurant,
    });

});


