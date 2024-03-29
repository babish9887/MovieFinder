const mongoose=require('mongoose');
const db=mongoose.connection;


const connectmongo=()=>{
    mongoose.connect('mongodb://localhost:27017/MovieFinder');
}

db.on('connected', ()=>{
    console.log("Connected To database Successfully");
})

module.exports=connectmongo;