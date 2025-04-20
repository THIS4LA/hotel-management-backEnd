import GalleryItem from "../models/galleryItem.js";
import { isAdmin } from "../utils/userValidation.js";

export function getGalleryItems(req, res) {
  GalleryItem.find().then((galleryItems) => {
    res.status(200).json({
      galleryItemList: galleryItems,
    });
  });
}

export function postGalleryItems(req, res) {
  const allowed = isAdmin(req, res);
  if (!allowed) return;
  const galleryItem = req.body;
  const newGallery = new GalleryItem(galleryItem);
  newGallery
    .save()
    .then(() => {
      res.status(201).json({ message: "item saved successfully" });
    })
    .catch(() => {
      res.status(400).json({ message: "Failed to save item" });
    });
}

export function putGalleryItems(req, res) {
  const allowed = isAdmin(req, res);
  if (!allowed) return; // Exit if not admin

  const itemName = req.params.name;

  GalleryItem.findOneAndUpdate(
    { name: itemName }, // Filter by name
    req.body, // Update data
    { new: true } // Return the UPDATED document
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return res.status(404).json({ message: "GalleryItem not found" });
      }
      res.status(200).json({
        message: "GalleryItem updated successfully",
        data: updatedItem, // Optional: Send back the updated item
      });
    })
    .catch((error) => {
      console.error("Update error:", error); // Log for debugging
      res.status(500).json({ message: "Failed to update GalleryItem" });
    });
}

export function deleteGalleryItems(req, res) {
  const allowed = isAdmin(req, res);
  if (!allowed) return;
  const itemName = req.params.name;
  GalleryItem.deleteOne({ name: itemName })
    .then(() => {
      res.status(200).json({ message: "GalleryItem deleted successfully" });
    })
    .catch(() => {
      res.status(404).json({ message: "GalleryItem not found" });
    });
}
