import UserToken from "../models/UserToken.js";
import jwt from "jsonwebtoken";

const verifyRefreshToken = (refreshToken) => {

    //get the refresh token from the env file
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

    return new Promise((resolve, reject) => {
        UserToken.findOne({ token: refreshToken }, (err, doc) => {
            
            //couldn't find similar refresh token
            if (!doc)
                return reject({ error: true, message: "Invalid refresh token" });
            
            //if found
            jwt.verify(refreshToken, privateKey, (err, tokenDetails)=>{
                if(err)
                    return reject({error:true, message:"Invalid refresh token"});
                resolve({
                    tokenDetails,
                    error:false,
                    message:"Valid refresh token",
                });
            });
        });
    });
};

export default verifyRefreshToken;