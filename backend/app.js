import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDatabase } from "./config/dbConnect.js";
import uploadRouter from "./routers/uploadRouter.js"
import authRouter from "./routers/auth.js"
import cookieParser from "cookie-parser";
import error from "./middlewares/error.js";
const app = express();


dotenv.config({ path : "./config/config.env"})

connectDatabase();
app.use(cors({
    origin : [
        'https://enterprisesop.netlify.app',
        "http://localhost:5173"],
     credentials: true,
}))
app.use(express.json());
app.use(cookieParser())

app.use('/api/v1',uploadRouter)
app.use('/api/v1',authRouter)

app.use(error)
app.listen(process.env.PORT,()=>{
    console.log(`Running on port ${process.env.PORT}`);
    
})