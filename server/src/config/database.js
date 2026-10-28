import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log("mongoDB connected successfully")
    }
    catch (error) {
        console.log("databse connection failed",error.message);
        throw error;
        
    }
}

export default connectDB;