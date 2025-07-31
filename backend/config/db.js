import mongoose from "mongoose";

const connectdb = async() => {
    try {
       await mongoose.connect(process.env.MONGODB_URL);
        console.log("CONNECTED DATABAS...")
    } catch (e) {
        console.log("error in db")
    }
}
export default connectdb;
