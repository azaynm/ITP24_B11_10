import { Router } from "express";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";
import User from "../models/User.js";
import Employee from "../models/Nidula/Employee.js";

const router = Router();

router.get("/details", auth, roleCheck(["user"]) ,(req,res)=>{
    res.status(200).json({message:"user authenticated."});

});

router.get("/my-account", auth, roleCheck(["user"]) ,(req,res)=>{
    res.status(200).json({message:"user authenticated."});

});



router.get('/isAdmin/:id', async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id);
    
        res.status(200).json({
            status: true,
            user: user,
        });
    
    
});


router.get("/getId/:selectedUser", async (req, res) => {
    const id = req.params.selectedUser;
    console.log(id)
    try {
        let user = await User.findOne({ userName: id });
        if(!user){
            user = await Employee.findOne({ userName: id });
        }
        
        if (user) {
            
            res.status(200).json({ user });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});







export default router;