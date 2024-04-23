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

router.post('/getUser', async (req, res) => {
    try {
       
        const { email } = req.body;

       
        let user = await User.findOne({ email });
        if(!user){
            user = await Employee.findOne({ email });
        }

        if (!user) {
            
            return res.status(404).json({ error: 'User not found' });
        }

        // If user found, return the user data (e.g., username)
        res.json({ username: user.userName });
    } catch (error) {
        // If an error occurs, return a 500 status with an error message
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});


router.get("/getId/:selectedUser", async (req, res) => {
    console.log("get id")
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