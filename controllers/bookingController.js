import Booking from "../models/booking.js";
import { v4 as uuidv4 } from "uuid";
import { isLogged } from "../utils/validation.js";

export async function createBooking(req, res) {
  // const allowed = isLogged(req, res);
  // if (!allowed) return;

  try {
    const count = await Booking.countDocuments();
    req.body.bookingId = `BKG-${uuidv4()}`;

    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({
      message: "Booking created successfully",
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

// export async function getBookings(req, res) {
//   const allowed = isLogged(req);
//   if (allowed) {
//     try {
//       let bookings = [];

//       if (req.user.type === "admin") {
//         bookings = await Booking.find();
//       } else {
//         bookings = await Booking.find({ email: req.user.email });
//       }

//       res.status(200).json({ success: true, bookings });
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Failed to fetch bookings" });
//     }
//   }
// }

export async function getBookings(req, res) {
  let bookings = [];
  const sortBy = req.query.sortBy || "startDate";
  const order = req.query.order === "desc" ? -1 : 1;
  bookings = await Booking.find().sort({ [sortBy]: order });

  res.status(200).json({ success: true, bookings });
}

export async function getBookingsByDate(req, res) {
  const { startDate, endDate } = req.query;
  let bookings = [];
  bookings = await Booking.find({startDate: { $gte: new Date(startDate) }, endDate: { $lte: new Date(endDate) } });

  res.status(200).json({ success: true, bookings });
}

export function deleteBooking(req, res) {
  const itemId = req.params.id;
  Booking.deleteOne({ bookingId: itemId })
    .then(() => {
      res.status(200).json({ message: "GalleryItem deleted successfully" });
    })
    .catch(() => {
      res.status(404).json({ message: "GalleryItem not found" });
    });
}

export async function updateBooking(req, res) {
  const { id } = req.params;

  try {
    const updatedBooking = await Booking.findOneAndUpdate(
      { bookingId: id }, // Query: find booking by bookingId
      req.body, // Data to update
      { new: true } // Option: return the updated document
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("booking update error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Failed to update booking" });
  }
}
