import express from 'express';
import {getGalleryItems,postGalleryItems,putGalleryItems,deleteGalleryItems} from '../controllers/galleryItemController.js';

const galleryItemRouter=express.Router();

galleryItemRouter.get('/',getGalleryItems);

galleryItemRouter.post('/',postGalleryItems);

galleryItemRouter.put('/:name',putGalleryItems);

galleryItemRouter.delete('/:name',deleteGalleryItems);

export default galleryItemRouter;