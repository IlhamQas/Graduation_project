import mongoose, { Types, Schema , model } from "mongoose";
const appointmentSchema=new Schema({
    guardianId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },

    date:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:['pending', 'approved', 'cancelled'],
        default:'pending'
    },
    notes:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    specialistId:{
                type:mongoose.Schema.Types.ObjectId,
           
                ref:'user'
            },
})
const appointmentModel=model('appointment', appointmentSchema)
export {appointmentModel}