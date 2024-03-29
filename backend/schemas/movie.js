const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required: true
    },
    imdbID: {
        type: String,
        unique: true
    },
    imdbRating: {
        type: Number,
    },
    poster: {
        type: String,
    },
    runtime: {
        type: Number,
    },
    title: {
        type: String,
        required: true
    },
    userRating: {
        type: Number,
    },
    year: {
        type: String,
    }
});

// Index to ensure uniqueness of user and movieid combination
// movieSchema.index({ user: 1, movieid: 1 }, { unique: true });

module.exports = mongoose.model('Movie', movieSchema);
