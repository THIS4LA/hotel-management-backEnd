import express from 'express';

const app= express();

app.get("/",(req,res)=>{
    console.log("this is get request");
})

app.listen(5000,(req,res)=>{
    console.log('Server is running on port 5000')
});
