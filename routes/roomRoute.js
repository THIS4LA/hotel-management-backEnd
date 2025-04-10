import express from 'express';
import {getAllRooms,postRoom,updateRoom} from '../controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.get('/',getAllRooms);
roomRouter.post('/',postRoom);
roomRouter.put('/:id',updateRoom);

export default roomRouter;