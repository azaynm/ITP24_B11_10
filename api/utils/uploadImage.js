import Food from "../models/Food.js";
import cloudinary2 from "cloudinary";

const UploadImage = async (req, res) => {

    const result = await cloudinary.uploader.upload(req.file.path);
    const imageUploaded = new Food({
        name: req.body.name,
        price:req.body.price,
        description:req.body.description,
        image: result.secure_url,
    });

    try{
        await imageUploaded.save();
    }catch(error){
        return res.status(400).json({
            message:`image upload failed, check to see the ${error}`,
            status: "error",
        });
    }
}

export { UploadImage };

