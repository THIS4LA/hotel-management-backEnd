import express from "express";
import {
  createBooking,
  getBookings,
  deleteBooking,
  updateBooking,
  getAvailableRooms
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getBookings);
bookingRouter.get("/available", getAvailableRooms);
bookingRouter.delete("/:id", deleteBooking);
bookingRouter.put("/:id", updateBooking);

export default bookingRouter;
