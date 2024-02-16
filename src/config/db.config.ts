import mongoose from "mongoose";
import { dbName, dbUrl } from "./initial.config";

const connectDB = async () :Promise<void> => {
    try {
        await mongoose.connect(dbUrl,{
            dbName : dbName,
        });
        console.log("Connected to database");
    } catch (error) {
        console.log("Error connecting to database",error);
    }
}

export default connectDB;