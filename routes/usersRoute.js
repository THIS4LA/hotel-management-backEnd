import express from 'express';
import {getUsers,postUsers,putUsers,deleteUsers,loginUser} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/',getUsers);

userRouter.post('/',postUsers);

userRouter.put('/',putUsers);

userRouter.delete('/',deleteUsers);

userRouter.post('/login',loginUser);

export default userRouter;