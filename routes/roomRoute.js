import express from "express";
import {
  postRoom,
  updateRoom,
  deleteRoom,
  getRooms,
  getRoomById,
} from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.get("/", getRooms);
roomRouter.get("/:id", getRoomById);
roomRouter.post("/", postRoom);
roomRouter.put("/:id", updateRoom);
roomRouter.delete("/:id", deleteRoom);

export default roomRouter;
