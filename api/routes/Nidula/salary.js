import { Router } from "express";
import Salary from "../../models/Nidula/Salary.js";

const router = Router();

router.get('/salary', async(req, res) => {
    try{
        const salaries = await Salary.find();
        res.status(200).json(salaries)
    } catch(error){
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/employee-add-salary', async (req, res) => {
    try {
        // Extract data from the request body
        const { userName, month, salary, isPaid } = req.body;

        // Create a new salary document
        const newSalary = new Salary({
            userName,
            month,
            salary,
            isPaid
        });

        // Save the new salary document to the database
        const savedSalary = await newSalary.save();

        // Return the newly created salary document
        res.status(201).json(savedSalary);
    } catch (error) {
        console.error('Error adding salary:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/check-payment/:userName', async (req, res) => {
    try {
        const { userName } = req.params;
        
        // Get the current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Check if there is a salary entry for the current month and year for the given employee
        const salaryEntry = await Salary.findOne({
            userName,
            // Compare only the month and year components
            month: { 
                $gte: new Date(currentYear, currentMonth, 1), // Start of the month
                $lt: new Date(currentYear, currentMonth + 1, 1) // Start of the next month
            }
        });

        // Return whether the employee was paid or not
        if (salaryEntry) {
            res.json({ paid: salaryEntry.isPaid, salary: salaryEntry.salary });
        } else {
            res.json({ paid: false });
        }
    } catch (error) {
        console.error('Error checking payment status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;