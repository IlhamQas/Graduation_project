
import mongoose from "mongoose";
const contactSchema=new mongoose.Schema({
    name:{
        type:String , 
        required:true
    },
    email:{
        type:String , 
        required:true  
    },
    location:{
        type:String , 
        required:true  
    }
})
const contactModel=mongoose.model('contact',contactSchema)
export default contactModel
