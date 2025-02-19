import express from 'express';

const userRouter = express.Router();

userRouter.get('/',(req,res)=>{
    res.json({
        message: "get request",
    })
});

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