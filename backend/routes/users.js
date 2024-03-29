const express=require('express');
const router=express.Router();
const User=require('../schemas/user')
const bc=require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('./mail');
const secret="babishisagoodboy"
const signToken = id => {
  return jwt.sign({ id: id }, secret, {
    expiresIn: '3d'
  });
};

const  createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode)
  .json({
    status: 'success',
    message: "Logged In successfully!",
    token
  });
};


router.post('/signup', async (req, res)=>{

  const {name, email, password}=req.body
  const salt = await bc.genSalt(10);
  const hashedPassword=await bc.hash(password, salt)
  const user=await User.findOne({email: email})
  if(user){
    return  res.status(400).json({
      status: "Fail",
      message: "User already Exists"
    })
  }
  const newUser=new User({
    name, 
    email,
    password: hashedPassword
  })
  if(await newUser.save()){
    sendEmail({email: newUser.email,
      subject: "Welcome to MovieFinder!",
      message:"Your gateway to discovering your next favorite film! For any Query you can mail at babish9887@gmail.com"
   })
    res.status(200).json({
      status: "Success",
      message: "User Signed Up successfully!"
    })
  }
})



router.post('/login', async (req, res)=>{
 try{
  const { email, password}=req.body
  console.log(email, password);
  const user=await User.findOne({email: email})
  if(!user){
    return  res.status(400).json({
      status: "Fail",
      message: "User doesnot Exists"
    })
  }
  console.log(user);
  if(await bc.compare(password, user.password)){
    createSendToken(user, 200, res);
  }
 } catch(e){
  res.status(400).json({
    status: "Fail",
    message: e.message
  })
 }
})

router.get('/getUser', async (req, res) => {
  try{
  const header = req.headers.authorization;
  const jwtCookie=header.split(' ')[1];
  console.log(jwtCookie)
  if (!jwtCookie) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: JWT cookie not found',
    });
  }
    const decodedToken=jwt.verify(jwtCookie, 'babishisagoodboy');
    const userId=decodedToken.id;
    console.log("UserId", userId)
    const user=await  User.findOne({_id: userId})
    console.log(user);
    if(!user){
      res.status(400).json({
        status: "fail",
        message:"No user"
      })
    }
    res.status(200).json({
      status: 'success',
      user
    });
  } catch(e){
    console.log(e.message);
  }
});


module.exports=router;