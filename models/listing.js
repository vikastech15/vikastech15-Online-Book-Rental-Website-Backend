const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users');

//book kardo name
const listingSchema = new Schema({
    title: {
        type : String,
        required: true,
    },
    images :[
         {
        url : String,
        filename: String,
    }
],
    description: {
        type: String,
    },
    author: {
        type: String,
        required: true,
    },
    pages:{
        type: Number,
        required: true,
    },
    price : Number,
    owner : {
        type: Schema.Types.ObjectId,
        ref: User,
    },
    isbn : {
        type: Number,
        required: true,
    },
    genre : [String],
    condition : {
         type: String,
         enum: ['New', 'Good', 'Average'],
    },
    forRent: {
        type: Boolean,
        default: true,
    },
    forSale: {
        type: Boolean,
        default: false,
    },
    
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;