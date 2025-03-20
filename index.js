import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRouter from "./routes/usersRoute.js";
import galleryItemRouter from "./routes/galleryItemRoute.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());

const connectionString = process.env.MONGO_URL;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("failed to connect to MongoDB");
  });

// async function connectDB(){
//     try{
//         await mongoose.connect(connectionString);
//         console.log('Connected to MongoDB');
//     }
//     catch(err){
//         console.log('Error connecting to MongoDB');
//     }
// }

// connectDB();

app.use("/api/users", userRouter);
app.use("/api/galleryItems", galleryItemRouter);

app.listen(5000, (req, res) => {
  console.log("Server is running on port 5000");
});
