import { appointmentModel } from "../../../../DB/models/appointment.model.js";
import { pendingAppointmentModel } from "../../../../DB/models/pendingAppointment.model.js";
//HTM3AFJ7CGASQAGFY1RDPJAY
import { sendEmail } from "../../../Servicess/email.js";
import { userModel } from "../../../../DB/models/user.model.js";
export const controlPending = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const findPending = await pendingAppointmentModel.findById(id);
        if (!findPending) {
            return res.status(404).json({ message: "Appointment request not found" });
        }

        findPending.specialistId = req.user._id;

        if (status === "approved") {
            
            const newAppointment = new appointmentModel({
                status: status,
                notes: findPending.notes,
            
                guardianId: findPending.guardianId,
                specialistId: req.user._id,
                date: findPending.date,
                createdAt: findPending.createdAt,
                createdBy: findPending.createdBy
            });

            await newAppointment.save();
            const finduser=await userModel.findById(findPending.guardianId)
     
           
            await sendEmail(
                finduser.email,
                "موعد الحجز",
                `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>تأكيد حجز الموعد</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            text-align: center;
                        }
                        .container {
                            background-color: #ffffff;
                            width: 80%;
                            max-width: 600px;
                            margin: 30px auto;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                        }
                        h2 {
                            color: #4CAF50;
                        }
                        p {
                            font-size: 16px;
                            color: #333;
                            line-height: 1.6;
                        }
                        .appointment-details {
                            background-color: #f9f9f9;
                            padding: 15px;
                            border-radius: 8px;
                            margin-top: 15px;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 14px;
                            color: #666;
                        }
                        .btn {
                            display: inline-block;
                            padding: 10px 20px;
                            margin-top: 15px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-size: 16px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>📅 تأكيد حجز الموعد</h2>
                        <p>عزيزي <strong>${finduser.name}</strong>,</p>
                        <p>يسرنا إبلاغك بأن طلب حجز الموعد الخاص بك قد تمت الموافقة عليه.</p>
                        <div class="appointment-details">
                            <p><strong>📅 تاريخ الموعد:</strong> ${findPending.date}</p>
                      
                        </div>
                        <p>نشكرك على استخدام منصتنا، ونتمنى لك تجربة سلسة ومفيدة.</p>
                    
                        <p class="footer">🚀 فريق العمل | نظام إدارة المواعيد</p>
                    </div>
                </body>
                </html>
                `
            );
           
            await pendingAppointmentModel.findByIdAndDelete(id);
            return res.status(200).json({ message: "Success: Appointment Accepted" });
        } 
        
        else if (status === "cancelled") {
            const findPending = await pendingAppointmentModel.findById(id);
            if (!findPending) {
                return res.status(404).json({ message: "Appointment request not found" });
            }
    const finduser=await userModel.findById(findPending. guardianId)
         
            await sendEmail(
                finduser.email,
                "إشعار رفض الموعد",
                `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>إشعار رفض الموعد</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            text-align: center;
                        }
                        .container {
                            background-color: #ffffff;
                            width: 80%;
                            max-width: 600px;
                            margin: 30px auto;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                        }
                        h2 {
                            color: #d9534f;
                        }
                        p {
                            font-size: 16px;
                            color: #333;
                            line-height: 1.6;
                        }
                        .appointment-details {
                            background-color: #f9f9f9;
                            padding: 15px;
                            border-radius: 8px;
                            margin-top: 15px;
                            color: #d9534f;
                            font-weight: bold;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 14px;
                            color: #666;
                        }
                        .btn {
                            display: inline-block;
                            padding: 10px 20px;
                            margin-top: 15px;
                            background-color: #d9534f;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-size: 16px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>❌ إشعار رفض الموعد</h2>
                        <p>عزيزي <strong>${finduser.name}</strong>,</p>
                        <p>نأسف لإبلاغك بأن طلب حجز الموعد الخاص بك قد تم رفضه.</p>
                
                        <p>يمكنك محاولة حجز موعد جديد في وقت لاحق.</p>
                      
                        <p class="footer">🚀 فريق العمل | نظام إدارة المواعيد</p>
                    </div>
                </body>
                </html>
                `
            );
            await pendingAppointmentModel.findByIdAndDelete(id);
            return res.status(200).json({ message: "Success: Appointment Rejected" });
        } 
        
        else {
            return res.status(400).json({ message: "Invalid status value" });
        }

    } catch (error) {
        return res.status(500).json({ message: `Error: ${error.message}` });
    }
};

export const deleteAppintment=async(req,res)=>{
    const {id}=req.params;
    try{
        const findAppointment=await appointmentModel.findById(id);
        if(!findAppointment){
            return res.status(400).json({message:"not found"})
        } else{
            const deleteUserAppointment=await appointmentModel.findByIdAndDelete(id)
            return res.status(200).json({message:"succsses", deleteUserAppointment})
        }

    }catch(error){
        return res.status(500).json({message:`error ${error}`}) 
    }
}




export const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;

    try {
      
        const findAppointment = await appointmentModel.findById(id);

        if (!findAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

       
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            id,
            { date: date ?? findAppointment.date }, 
            { new: true }
        );
        const finduser=await userModel.findById(findAppointment.guardianId)
        await sendEmail(
            finduser.email,
            "🔄 تعديل موعد الحجز",
            `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>تعديل موعد الحجز</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        text-align: center;
                    }
                    .container {
                        background-color: #ffffff;
                        width: 80%;
                        max-width: 600px;
                        margin: 30px auto;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    }
                    h2 {
                        color: #f0ad4e;
                    }
                    p {
                        font-size: 16px;
                        color: #333;
                        line-height: 1.6;
                    }
                    .appointment-details {
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-radius: 8px;
                        margin-top: 15px;
                        color: #f0ad4e;
                        font-weight: bold;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #666;
                    }
                    .btn {
                        display: inline-block;
                        padding: 10px 20px;
                        margin-top: 15px;
                        background-color: #f0ad4e;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 16px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>🔄 تعديل موعد الحجز</h2>
                    <p>عزيزي <strong>${finduser.name}</strong>,</p>
                    <p>تم تعديل موعد الحجز الخاص بك. يرجى الاطلاع على التفاصيل الجديدة أدناه:</p>
                    <div class="appointment-details">
                        <p>📅 <strong>التاريخ الجديد:</strong> ${date}</p>
                  
                    </div>
                    <p>إذا كنت بحاجة إلى مزيد من التعديلات، يمكنك تعديل الموعد من خلال حسابك.</p>
                    <a href="https://your-website.com/appointments" class="btn">عرض الموعد</a>
                    <p class="footer">🚀 فريق العمل | نظام إدارة المواعيد</p>
                </div>
            </body>
            </html>
            `
        );
        

        return res.status(200).json({ message: "Update successful", updatedAppointment });
    } catch (error) {
        return res.status(500).json({ message: `Error: ${error.message}` });
    }
};
export const showAll=async(req , res)=>{
    try{
        const findAll=await appointmentModel.find({})
        if(!findAll){
            return res.status(400).json({message:"not found"})
        }else{
            return res.status(200).json({message:"succsses", findAll})
        }


    }catch(error){
        return res.status(500).json({ message: `Error: ${error.message}` });
    }
}
export const showById=async(req,res)=>{
    const {id}=req.params;
    const find=await appointmentModel.findById(id);
    if(!find){
        return res.status(400).json({message:"not found"})

    }else{
        return res.status(200).json({message:"succsses", find})

    }
}