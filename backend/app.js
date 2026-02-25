import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDatabase } from "./config/dbConnect.js";
import uploadRouter from "./routers/uploadRouter.js"
const app = express();


dotenv.config({ path : "./config/config.env"})

connectDatabase();
app.use(cors())
app.use(express.json());


app.use('/api/v1',uploadRouter)
app.listen(process.env.PORT,()=>{
    console.log(`Running on port ${process.env.PORT}`);
    
})