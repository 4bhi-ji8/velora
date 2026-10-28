import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        required: true
    },
    quantity : {
        type : Number,
        required : true,
        min : 1
    }

});

const cartSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
        unique : true
    },
    items : [itemSchema]
})

export default mongoose.model('Cart', cartSchema);