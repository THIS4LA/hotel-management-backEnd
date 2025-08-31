import Room from "../models/room.js";
import { isAdmin } from "../utils/validation.js";
import { v4 as uuidv4 } from "uuid";

export async function getRooms(req, res) {
  const {
    page = 1,
    limit = 10,
    sortBy = "roomId",
    order = "asc",
    startPrice,
    endPrice,
  } = req.query;

  const filter = {};

  if (startPrice && endPrice) {
    filter.price = {};
    if (startPrice) filter.price.$gte = parseFloat(startPrice);
    if (endPrice) filter.price.$lte = parseFloat(endPrice);
  }

  const parsedLimit = parseInt(limit) || 10;
  const parsedPage = parseInt(page) || 1;

  const options = {
    page: parsedPage,
    limit: parsedLimit,
    sort: { [sortBy]: order === "desc" ? -1 : 1 },
  };

  try {
    const result = await Room.paginate(filter, options);

    return res.status(200).json({
      success: true,
      rooms: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings" });
  }
}

export async function getRoomById(req, res) {
  const roomId = req.params.id; // same as /api/rooms/:id

  try {
    const room = await Room.findOne({ roomId: roomId });

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    return res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Error fetching room by ID:", error);

    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid room ID format" });
    }

    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch room" });
  }
}

export async function postRoom(req, res) {
  // const allowed = isAdmin(req, res);
  // if (!allowed) return;

  try {
    const count = await Room.countDocuments();
    req.body.roomId = `BKG-${uuidv4()}`;
    const newRoom = new Room(req.body);
    await newRoom.save();

    return res.status(201).json({
      message: "Room created successfully",
      roomId: newRoom._id,
    });
  } catch (error) {
    console.error("Room creation error:", error);

    if (error.code === 11000) {
      return res.status(409).json({ message: "Room already exists" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Failed to create room" });
  }
}

export async function updateRoom(req, res) {
  const roomId = req.params.id;
  // const allowed = isAdmin(req, res);
  // if (!allowed) return;
  try {
    const result = await Room.findOneAndUpdate({ roomId: roomId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({
      message: "Room updated successfully",
      result: result,
    });
  } catch (error) {
    console.error("Room update error:", error);

    if (error.code === 11000) {
      return res.status(409).json({ message: "Room name already exists" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid room ID format" });
    }

    return res.status(500).json({ message: "Failed to update room" });
  }
}

// export async function deleteRoom(req, res) {
//   const roomId = req.params.id;

//   const allowed = isAdmin(req, res);
//   if (!allowed) return;

//   try {
//     // 2. Correct query filter (use _id instead of roomId)
//     const deletedRoom = await Room.findOneAndDelete({ roomId: roomId });

//     if (!deletedRoom) {
//       return res.status(404).json({ message: "Room not found" });
//     }

//     // 3. Success response (avoid sending full document)
//     return res.status(200).json({
//       message: "Room deleted successfully",
//       deletedRoomId: deletedRoom._id, // Only send the ID
//     });
//   } catch (error) {
//     console.error("Room deletion error:", error);

//     // 4. Handle specific errors
//     if (error.name === "CastError") {
//       return res.status(400).json({ message: "Invalid room ID format" });
//     }

//     return res.status(500).json({ message: "Failed to delete room" });
//   }
// }

export async function deleteRoom(req, res) {
  const roomId = req.params.id;

  try {
    const deletedRoom = await Room.findOneAndDelete({ roomId: roomId });

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({
      message: "Room deleted successfully",
      deletedRoomId: deletedRoom._id,
    });
  } catch (error) {
    console.error("Room deletion error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid room ID format" });
    }

    return res.status(500).json({ message: "Failed to delete room" });
  }
}
