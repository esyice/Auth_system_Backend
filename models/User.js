import { Mongoose } from "mongoose";   
import validator from "validator"; 

const userSchema =  new Mongoose.Schema ({
    name : {
        type : String,
        required : [true , "Name is required"],
        trim : true,
        minlength: [2, "Name must be at least 2 characters"],
    },
    email : {
        type : String,
        required : [true , "Email is required"],
        trim : true,
        unique : true,
        validate : [validator.isEmail , "Please provide a valid email address"],
    },
    password : {
        type : String,
        required : [true , "Password is required"], 
        minlength: [6, "Password must be at least 6 characters"],
    },
}
, { timestamps : true });

export const User = Mongoose.model("User" , userSchema);