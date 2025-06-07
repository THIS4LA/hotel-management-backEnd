import Booking from "../models/booking.js";
import { isLogged } from "../utils/validation.js";

export async function createBooking(req, res) {
  const allowed = isLogged(req, res);
  if (!allowed) return;

  try {
    const count = await Booking.countDocuments();
    req.body.bookingId = `BKG${(count + 1).toString().padStart(4, "0")}`;

    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({
      success: true,
      bookingId: booking.bookingId,
      status: booking.status,
      startDate: booking.startDate,
    });
  } catch (error) {
    console.error("booking creation error:", error);

    // Handle validation errors (e.g., missing required fields)
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    // Generic server error
    return res.status(500).json({ message: "Failed to create room" });
  }
}

export async function getBookings(req, res) {
    const allowed = isLogged(req, res);
    if (!allowed) return;
  
    try {
      let bookings = [];
  
      if (req.user.type == "admin") {
        bookings = await Booking.find();
      } else {
        bookings = await Booking.find({ email: req.user.email });
      }
  
      res.status(200).json({
        success: true,
        bookings: bookings,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  }
  
