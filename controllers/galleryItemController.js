import GalleryItem from "../models/galleryItem.js";

export function getGalleryItems(req, res) {
  GalleryItem.find().then((galleryItems) => {
    res.status(200).json({
      galleryItemList: galleryItems,
    });
  });
}

export function postGalleryItems(req, res) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Please Login" });
  }
  else if(user.type == "admin") {
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
  else {
    return res.status(403).json({ message: "Unauthorized" });
  }
}

export function putGalleryItems(req, res) {}

export function deleteGalleryItems(req, res) {
  const itemName = req.body.name;
  GalleryItem.deleteOne({ name: itemName })
    .then(() => {
      res.status(200).json({ message: "GalleryItem deleted successfully" });
    })
    .catch(() => {
      res.status(404).json({ message: "GalleryItem not found" });
    });
}
