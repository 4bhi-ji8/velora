import mongoose from "mongoose";

const wishlistSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    products : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

export default mongoose.model('Wishlist', wishlistSchema)