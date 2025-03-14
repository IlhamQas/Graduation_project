import {userModel} from "../../../../DB/models/user.model.js";
import profileModel from "../../../../DB/models/profileModel.js";
import medicalReportModel from "../../../../DB/models/medicalReportModel.js";
import {appointmentModel} from "../../../../DB/models/appointment.model.js";
import financialRecordModel from "../../../../DB/models/financialRecordModel.js";
import productModel from "../../../../DB/models/product.model.js";


export const addProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { phone, address, bio,  specialization, workplace } = req.body;

       
        const existingProfile = await profileModel.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({ message: "تم إنشاء البروفايل مسبقًا، يمكنك فقط تحديثه." });
        }

      
        const newProfile = new profileModel({
            userId,
            phone,
            address,
            bio,
            
            specialization,
            workplace
        });

        await newProfile.save();

        res.status(201).json({ message: "تمت إضافة البروفايل بنجاح", profile: newProfile });
    } catch (error) {
        res.status(500).json({ message: `خطأ: ${error.message}` });
    }
};


export const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            profile = new profileModel({ userId });
            await profile.save();
        }

        let extraData = {};

        if (user.role === "guardian") {
            const appointments = await appointmentModel.find({ guardianId: userId });
            const medicalReports = await medicalReportModel.find({ id: userId });
            const financialRecords = await financialRecordModel.find({ id:userId });
            extraData = { appointments, medicalReports, financialRecords };
        }

        if (user.role === "specialist") {
            const createdReports = await medicalReportModel.find({ specialistId: userId });
            extraData = { createdReports };
        }

        if (user.role === "maneger") {
            
            const allUsers = await userModel.find().select("-password");
            const allAppointments = await appointmentModel.find({specialistId:userId});
            const allMedicalReports = await medicalReportModel.find({specialistId:userId});
        

            extraData = { allUsers, allAppointments, allMedicalReports };
        }
        if (user.role === "admin") {
            const allUsers = await userModel.find().select("-password");
            const allAppointments = await appointmentModel.find();
            const allMedicalReports = await medicalReportModel.find();
            const allFinancialRecords = await financialRecordModel.find();
            const allProfiles = await profileModel.find();

            extraData = { allUsers, allAppointments, allMedicalReports, allFinancialRecords, allProfiles };
        }
        if (user.role === "marketing_agents") {
            const myProducts = await productModel.find({ createdBy: userId });
            extraData = { myProducts };
        }


        res.status(200).json({ user, profile, ...extraData });
    } catch (error) {
        res.status(500).json({ message: `خطأ: ${error.message}` });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { phone, address, bio, specialization, workplace } = req.body;

        const updatedProfile = await profileModel.findOneAndUpdate(
            { userId },
            { phone, address, bio,  specialization, workplace },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "البروفايل غير موجود" });
        }

        res.status(200).json({ message: "تم تحديث البروفايل بنجاح", updatedProfile });
    } catch (error) {
        res.status(500).json({ message: `خطأ: ${error.message}` });
    }
};
