import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  ],
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  reason: {
    type: String,
    default: "",
  },
  guests: {
    type: String,
    default: "",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    default: "",
  },
});

bookingSchema.plugin(mongoosePaginate);
const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
