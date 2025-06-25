import { Server } from 'http'
import app from './app';
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

let server: Server;

const PORT = 5000;

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI !)
        console.log("Connected to Mongodb");

        server = app.listen(PORT, ()=>{
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error: any) {
        console.log("Server error:",error.message)
    }
}
main();