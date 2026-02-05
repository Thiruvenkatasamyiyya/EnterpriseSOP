// mongodb+srv://javid:javid123@ecommerce.wutpy.mongodb.net/

import mongoose from "mongoose";

export const connectDatabase = () => {

    mongoose.connect((process.env.MONGODBURL)).then((con) => {

        console.log(`MongoDB Database connected with ${con.connection.host}`)
        
    })


}