import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    roomName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Standard", "Deluxe", "Luxury"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    capacity: {
      type: Number,
      default: 1,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdBi-6xt7I5uwI751cgv1S2JOTKohnNX7cfA&s",
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.plugin(mongoosePaginate);
const Room = mongoose.model("Room", roomSchema);
export default Room;
