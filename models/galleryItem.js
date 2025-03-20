import mongoose from "mongoose";

const galleryItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});

const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);
export default GalleryItem;
