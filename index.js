import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";

import userRouter from "./routes/usersRoute.js";
import galleryItemRouter from "./routes/galleryItemRoute.js";
import roomRouter from "./routes/roomRoute.js";
import bookingRouter from "./routes/bookingRoute.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

const connectionString = process.env.MONGO_URL;

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token != null) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (decoded != null) {
        req.body.user = decoded;
        console.log(decoded);
        next();
      }
    });
  } else {
    next();
  }
});

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
app.use("/api/rooms", roomRouter);
app.use("/api/book", bookingRouter);

app.listen(process.env.PORT, (req, res) => {});
