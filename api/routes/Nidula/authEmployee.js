import { Router } from "express";
import Employee from "../models/Employee.js";
import mongoose from "mongoose";
//use to hash password
import bcrypt from "bcrypt";
import { signUpBodyValidation, loginBodyValidation } from "../../utils/employeeValidationSchema.js";
import generateTokens from "../../utils/generateTokens.js";
import EmployeeToken from "../models/Nidula/EmployeeToken.js";
import DeliveryStaff from "../models/Maleesha/DeliveryStaff.js";
import Cheff from "../models/Maleesha/Cheff.js";



const router = Router();


router.get('/view-employees', async (req, res) => {
    const employees = await Employee.find();
    res.json(employees);
})

router.post("/signUpEmployee", async (req, res) => {
    try {
        const { error } = signUpBodyValidation(req.body);
        //if error occurs in the sign up body request
        if (error)
            return res
                .status(400)
                .json({ error: true, message: error.details[0].message });

        //if error not occur in the sign up body request
        //checks user with the given email is already exist or not
        const user = await Employee.findOne({ email: req.body.email });
        if (user)
            return res
                .status(400)
                .json({ error: true, message: "User with given email already exist" });

        //creates a object to hash password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));

        //hash the password with the object
        const hashPassword = await bcrypt.hash(req.body.password, salt);


        //update the password field with the hash password
        const newEmployee = await new Employee({ ...req.body, password: hashPassword }).save();

        if (req.body.roles.includes("deliveryStaff")) {
            const deliveryDetails = {
                name: req.body.empName,
                userId: newEmployee._id,
            };

            // Save the new delivery staff details to the database
            const newDelivery = new DeliveryStaff(deliveryDetails);
            await newDelivery.save();
        }
        if (req.body.roles.includes("cheff")) {
            const cheffDetails = {
                name: req.body.empName,
                userId: newEmployee._id,
            };

            // Save the new delivery staff details to the database
            const newCheff = new Cheff(cheffDetails);
            await newCheff.save();
        }

        res
            .status(201)
            .json({ error: false, message: "Account created successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

router.post("/getUser", async (req, res) => {

    const user = await Employee.findOne({ email: req.body.email });
    if (!user) res.status(401).json({ error: true, message: "user is not there" });
    else if (user) {
        res.status(200).json({
            error: false,
            username: user.userName,
            messaage: "User is there",
        });
    }
})

router.post("/get-user-details", async (req, res) => {

    const user = await Employee.findOne({ userName: req.body.username });
    if (!user) res.status(401).json({ error: true, message: "user is not there" });
    else if (user) {
        res.status(200).json({
            error: false,
            username: user.userName,
            email: user.email,
            messaage: "User is there",
        });
    }
})

router.post("/checkStatus", async (req, res) => {

    const token = await EmployeeToken.findOne({ token: req.body.refreshToken });
    if (!token) res.status(401).json({ error: true, loggedIn: false, message: "user is not logged in" });
    else if (token) {
        res.status(200).json({
            error: false,
            loggedIn: true,
            messaage: "User is logged in",
        });
    }
})

router.put('/employees/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the employee ID from the request parameters
        const updatedEmployeeData = req.body; // Get the updated employee details from the request body

        // Find the employee by ID and update their details
        const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedEmployeeData, { new: true });

        if (!updatedEmployee) {
            // If the employee with the specified ID is not found, return a 404 Not Found response
            return res.status(404).json({ error: 'Employee not found' });
        } else {
            if (req.body.roles.includes("deliveryStaff")) {
                const deliveryDetails = {
                    name: updatedEmployee.empName,
                    userId: updatedEmployee._id,
                };

                // Save the new delivery staff details to the database
                const newDelivery = new DeliveryStaff(deliveryDetails);
                await newDelivery.save();
            }

            if (req.body.roles.includes("cheff")) {
                const cheffDetails = {
                    name: updatedEmployee.empName,
                    userId: updatedEmployee._id,
                };

                // Save the new delivery staff details to the database
                const newCheff = new Cheff(cheffDetails);
                await newCheff.save();
            }

        }

        res.json(updatedEmployee); // Respond with the updated employee details
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




// login

router.post("/login", async (req, res) => {
    try {
        //validates the login
        const { error } = loginBodyValidation(req.body);
        if (error)
            return res
                .status(400)
                .json({ error: true, messaage: error.details[0].message });

        //checks user with the given email exist or not
        const user = await Employee.findOne({ email: req.body.email });
        if (!user)
            return res
                .status(401)
                .json({ error: true, message: "Invalid email or password" });


        //compare the password came from request.body with the hash password
        const verifiedPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!verifiedPassword)
            return res
                .status(401)
                .json({ error: true, message: "Invalid email or password" });

        //if the user exists
        const { accessToken, refreshToken } = await generateTokens(user);

        res.status(200).json({
            error: false,
            accessToken,
            refreshToken,
            messaage: "Logged in succcessfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});


export default router;