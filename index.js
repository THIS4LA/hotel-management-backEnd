import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/usersRoute.js';

const app= express();

app.use(bodyParser.json());

app.use('/users',userRouter);

app.listen(5000,(req,res)=>{
    console.log('Server is running on port 5000')
});
