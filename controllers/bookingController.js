import Booking from "../models/booking.js";
import Room from "../models/room.js";
import { v4 as uuidv4 } from "uuid";

export async function createBooking(req, res) {
  // const allowed = isLogged(req, res);
  // if (!allowed) return;

  try {
    console.log("Request body:", req.body);
    req.body.bookingId = `BKG-${uuidv4().slice(0, 8)}`;

    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error("booking creation error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Failed to create room" });
  }
}

export async function getAvailableRooms(req, res) {
  try {
    const { startDate, endDate, currentBookingId } = req.query;
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const overlappingBookings = await Booking.find({
      bookingId: { $ne: currentBookingId }, // ignore the current booking being edited
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
    }).select("rooms");
    console.log("Overlapping bookings:", overlappingBookings);
    const bookedRoomIds = overlappingBookings.flatMap((b) => b.rooms);
    console.log("Booked room IDs:", bookedRoomIds);
    const availableRooms = await Room.find({
      _id: { $nin: bookedRoomIds },
    }).select("roomName category price features capacity");
    console.log("Available rooms:", availableRooms);
    res.status(200).json({ availableRooms });
  } catch (error) {
    console.error("Error fetching available rooms:", error);
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
  const {
    page = 1,
    limit = 10,
    sortBy = "startDate",
    order = "asc",
    startDate,
    endDate,
  } = req.query;

  const filter = {};

  if (startDate && endDate) {
    filter.startDate = { $gte: new Date(startDate) };
    filter.endDate = { $lte: new Date(endDate) };
  }

  const parsedLimit = parseInt(limit) || 10;
  const parsedPage = parseInt(page) || 1;

  const options = {
    page: parsedPage,
    limit: parsedLimit,
    sort: { [sortBy]: order === "desc" ? -1 : 1 },
    populate: {
      path: "rooms",
      select: "roomName category price", // only fetch needed fields
    },
  };

  try {
    const result = await Booking.paginate(filter, options);

    return res.status(200).json({
      success: true,
      bookings: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings" });
  }
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
      { bookingId: id },
      req.body,
      { new: true }
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
