const express=require('express');
const app=express();
const connectmongo=require('./db')
const cors=require('cors');
require('dotenv').config();

connectmongo();

app.use(express.json());
app.use(cors());


app.use('/api/',require('./routes/users'));
app.use('/api/movie',require('./routes/movies'));

app.listen(process.env.PORT, ()=>{
    console.log("listening in port 4000")
})