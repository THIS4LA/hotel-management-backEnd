import express from "express";
import {
  getUsers,
  postUsers,
  deleteUsers,
  loginUser,
  findUserById,
  updateUserById,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);

userRouter.get("/me", findUserById);

userRouter.put("/:id", updateUserById);

userRouter.post("/", postUsers);

userRouter.delete("/", deleteUsers);

userRouter.post("/login", loginUser);

export default userRouter;
