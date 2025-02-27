import express from 'express';
import {getUsers,postUsers,putUsers,deleteUsers} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/',getUsers);

userRouter.post('/',(req,res)=>{
    res.status(200).json({
        message: "post request"
    })
})

userRouter.put('/',(req,res)=>{
    res.status(200).json({
        message: "put request"
    })
})

export default userRouter;