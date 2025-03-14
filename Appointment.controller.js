import { pendingAppointmentModel } from "../../../../DB/models/pendingAppointment.model.js";

 export const addApointment=async(req , res)=>{
    const {date , notes }=req.body;
    try{
        const addNewAppointment=new pendingAppointmentModel({
            date:date,
            notes:notes,
            createdBy:req.user._id,
            guardianId:req.user._id


        })
        const save=await addNewAppointment.save();
        return res.status(200).json({message:"succsses", save})

    }catch(error){
        return res.status(500).json({message:`error ${error}`})
    }
 }