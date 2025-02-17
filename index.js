import express from 'express';
import bodyParser from 'body-parser';

const app= express();

app.use(bodyParser.json());

app.get("/",(req,res)=>{
    const name = req.body.name;
    const school = req.body.school;
    const age = req.body.age;

    res.status(200).json({
        message: `Welcome, ${name}! You are studying at ${school} when you are ${age} years old`
    })
})

app.post("/",(req,res)=>{
    console.log("this is post request");
});

app.put("/",(req,res)=>{
    const name = req.body.name;
    console.log(`Hi ${name}`);
    res.json({
        message: `Welcome, ${name}!`
    })
});
app.listen(5000,(req,res)=>{
    console.log('Server is running on port 5000')
});
