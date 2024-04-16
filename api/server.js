import express from "express";
import {config} from "dotenv";
import authRoutes from "./routes/auth.js";

import dbConnect from "./dbConnect.js";
import refreshTokenRoutes from "./routes/refreshToken.js"
import userRoutes from "./routes/users.js";

import cors from "cors";



const app = express();

//allows us access environment variables like dotenv files
config();

dbConnect();


//allows us get json object in request body
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());

app.use("/api", authRoutes);






const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log(`Listening on port ${port}...`));

