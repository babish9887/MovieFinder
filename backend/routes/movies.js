const express=require('express')
const router=express.Router();
const Movie=require('../schemas/movie');
const User = require('../schemas/user');

router.post('/addmovie/:id', async (req, res)=>{
    try{
        console.log(req.body);
        const  {imdbID,imdbRating, title, year, poster, runtime, userRating}=req.body;
        const newmovie=new Movie({
            user: req.params.id,
            imdbID,
            imdbRating,
            title, 
            year, 
            poster,
            runtime,
            userRating
        })

        if(await newmovie.save()){
            res.status(200).json({
                status: 'success',
                message: "Added to WatchList"
            })
        }
    }catch(e){
        res.status(400).json({
            status: 'fail',
            message: e.message
        })
    }
})


router.get('/mymovies/:id',async (req, res)=>{
    try{
        const movies=await Movie.find({user: req.params.id})
        res.status(200).json({
            status: 'success',
            movies
        })

    }catch(e){
        res.status(400).json({
            status: 'fail',
            message: e.message
        })
    }
})


router.delete('/deletemovie/:id',async (req, res)=>{
    try{
        await Movie.findOneAndDelete({imdbID: req.params.id})
        res.status(200).json({
            status: 'success'
        })
        

    }catch(e){
        res.status(400).json({
            status: 'fail',
            message: e.message
        })
    }
})

module.exports=router;
