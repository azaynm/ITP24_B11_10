import jwt from "jsonwebtoken";
import UserToken from "../models/UserToken.js";


const generateTokens = async(user)=>{
    try{
        //can add more fields if you want
        const payload = {_id:user._id, roles: user.roles};

        //creates access token with jwt
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            {expiresIn: "14m"}
        );

        //creates refresh token with jwt
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            {expiresIn:"30d"}
        );

        //finds whether a user exist in the usertoken table with the given user id
        const userToken = await UserToken.findOne({userId: user._id});
        
        //if exists delete the document
        if(userToken) await userToken.remove();

        //creates a new user token with the user id and refresh token and save in the database
        await new UserToken({userId:user._id, token:refreshToken}).save();
        
        //returns access token and refresh token
        return Promise.resolve({accessToken, refreshToken});
    }catch(err){
        return Promise.reject(err);
    }
};

export default generateTokens;