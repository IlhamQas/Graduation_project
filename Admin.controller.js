import { userModel } from "../../../../DB/models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import { sendEmail } from "../../../Servicess/email.js";
export const addUser=async(req,res)=>{
    const {name , email , password , role}=req.body;
    try{
const findUser=await userModel.findOne({email:email})
if(findUser){
    return res.status(400).json({message:"هذا البيد مسجل مسبقا"})
}
    if (!req.file) {
      return res.status(400).json({ message: "الصورة مطلوبة" });
  }

  const { secure_url } = await cloudenary.uploader.upload(req.file.path, {
      folder: "user/image/",
  });
const hashPassword=await bcrypt.hash(password, parseInt(process.env.saltRound))
const newUser=new userModel({
    name:name,
    email:email,
    password:hashPassword,
  
    role,
    image: secure_url,

})
const token=jwt.sign({id:newUser._id , name},process.env.confirmEmailToken,{expiresIn:'24h'})
let message=`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Email Confirmation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
        a {
            color: #1a82e2;
        }
        img {
            height: auto;
        }
    </style>
</head>
<body style="background-color: #e9ecef;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" bgcolor="#e9ecef">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 36px 24px;">
                            <a href="https://www.example.com" target="_blank" style="display: inline-block;">
                             
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center" bgcolor="#e9ecef">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0;">
                            <h1>Confirm Your Email Address</h1>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center" bgcolor="#e9ecef">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="left" bgcolor="#ffffff">
                             <a href="${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #fff; text-decoration: none; border-radius: 6px;background-color:hsl(94, 59%, 35%)">verify Email</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                            <p style="margin: 0;">maneger Project</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
const inf=await sendEmail(email , 'verify email', message)
if(inf.accepted.length){
    const saveUser=await newUser.save()
    return res.status(200).json({ message: "sucsses", saveUser });
}else{
    return res.status(400).json({message:"خطأ في المعلومات المدخلة"})
}
    }catch(error){ 
        return res.status(500).json({ message: `حدث خطأ أثناء إنشاء المستخدم: ${error.message}` });
    }

}

export const showAllUser=async(req,res)=>{
    try{
const find=await userModel.find({});
res.status(200).json({message:"sucsses", find})
    }catch(error){
return res.status(500).json({message:`خطا في عرض المستخدمين: ${error.message}`})
    }
}
export const showUserById=async(req,res)=>{
    try{
const {id}=req.params;
const findUser=await userModel.findById(id);
if(!findUser){
    res.status(404).json({message:"مش موجود"})
}else{
    res.status(200).json({message:"succsses", findUser})
}
    }catch(error){
        return res.status(500).json({message:`خطا في عرض المستخدم : ${error.message}`})
    }
}
export const deleteUser=async(req,res)=>{
    const {id}=req.params;
    try{
     const findUser=await userModel.findById(id);
     if(!findUser){
        return res.status(404).json({message:"المستخدم مش موجود"})
     } else{
        const deleteUser=await userModel.findByIdAndDelete(id);
        if(!deleteUser){
            res.status(400).json({message:"خطا في الحذف"})
        } else{
            res.status(200).json({message:"succsses", deleteUser})
        }
     }
    }catch(error){
        return res.status(500).json({message:`حدث خطا ${error.message}`})
    }
}
export const updateUser=async(req,res)=>{
    const {id}=req.params;
    const {name , password , email , role }=req.body;
    try{
        const findUser=await userModel.findById(id)
        if(!findUser){
            return res.status(404).json({message:'المستخدم مش موجود'})
        }else{
            const finduserAndUpdate=await userModel.findByIdAndUpdate(id , {
                name:name || findUser.name,
                email:email || findUser.email,
                password:password|| findUser.password,
                role:role || findUser.role,
              
            },{new:true})
            res.status(200).json({message:"succsses", finduserAndUpdate})
        }

    }catch(error){
        return res.status(500).json({message:`حدث خطا ${error.message}`}) 
    }
}