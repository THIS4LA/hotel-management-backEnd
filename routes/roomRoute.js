import express from 'express';
import {getAllRooms,postRoom,updateRoom,deleteRoom} from '../controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.get('/',getAllRooms);
roomRouter.post('/',postRoom);
roomRouter.put('/:id',updateRoom);
roomRouter.delete('/:id',deleteRoom);

export default roomRouter;