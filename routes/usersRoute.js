import express from 'express';
import {getUsers,postUsers,deleteUsers,loginUser,getUser, disableUser} from '../controllers/userController.js';

const userRouter = express.Router();

// userRouter.get('/',getUsers);

userRouter.get('/',getUsers);

userRouter.post('/',postUsers);

userRouter.put('/:id',disableUser);

userRouter.delete('/',deleteUsers);

userRouter.post('/login',loginUser);

export default userRouter;