import mongoose from "mongoose";
import { DB_NAME } from '../constants.js';

const connectDB=async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL.replace('<db_password>',process.env.MONGODB_PASSWORD)}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.error('MongoDB connection FAILED : ',error);
        process.exit(1);
    }
}

export default connectDB