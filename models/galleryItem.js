import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const galleryItemSchema = new mongoose.Schema({
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

galleryItemSchema.plugin(mongoosePaginate);
const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);
export default GalleryItem;
