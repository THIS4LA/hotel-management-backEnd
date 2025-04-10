import Room from "../models/room.js";

export async function getAllRooms(req, res) {
  try {
    const rooms = await Room.find(); // Wait for the query to complete
    res.status(200).json({ roomlist: rooms }); // Send the response
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Failed to fetch rooms" }); // Handle errors
  }
}

export async function postRoom(req, res) {
  const user = req.user;

  // Early return if user is not authenticated
  if (!user) {
    return res.status(401).json({
      message: "You must be logged in to create a room",
    });
  }

  // Early return if user is not an admin
  if (user.type !== "admin") {
    // Fixed: "admin" should be a string
    return res.status(403).json({
      message: "You must be an admin to create a room",
    });
  }

  try {
    const newRoom = new Room(req.body);
    await newRoom.save();

    // Success response (avoid sending full room data for security)
    return res.status(201).json({
      message: "Room created successfully",
      roomId: newRoom._id, // Only send necessary data
    });
  } catch (error) {
    console.error("Room creation error:", error);

    // Handle duplicate key errors (e.g., unique room names)
    if (error.code === 11000) {
      return res.status(409).json({ message: "Room already exists" });
    }

    // Handle validation errors (e.g., missing required fields)
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    // Generic server error
    return res.status(500).json({ message: "Failed to create room" });
  }
}

export async function updateRoom(req, res) {
  const roomId = req.params.id; // Missing 'const' declaration
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      message: "You must be logged in to update a room",
    });
  }

  if (user.type !== "admin") {
    // Ensure "admin" is a string
    return res.status(403).json({
      message: "You must be an admin to update a room",
    });
  }

  try {
    // Fix: Use { _id: roomId } and capture the result
    const result = await Room.findOneAndUpdate(
      { roomId : roomId }, // Correct query filter
      req.body,
      { new: true, runValidators: true } // Added runValidators
    );

    if (!result) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({
      // Use 200 (not 201) for updates
      message: "Room updated successfully",
      result: result, // Minimal response
    });
  } catch (error) {
    console.error("Room update error:", error); // Fixed log message

    if (error.code === 11000) {
      return res.status(409).json({ message: "Room name already exists" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    if (error.name === "CastError") {
      // Handle invalid ObjectId
      return res.status(400).json({ message: "Invalid room ID format" });
    }

    return res.status(500).json({ message: "Failed to update room" });
  }
}
