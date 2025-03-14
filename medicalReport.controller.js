import medicalReportModel from "../../../../DB/models/medicalReportModel.js";
import { userModel } from "../../../../DB/models/user.model.js";
export const addMedicalReport = async (req, res) => {
    try {
        const {id}=req.params;
        const { diagnosis, treatmentPlan, notes } = req.body;
        const specialistId = req.user._id;

        
        const patient = await userModel.findById(id);
       


        if (!patient || patient.role !== "guardian") {
            return res.status(404).json({ message: "المريض غير موجود." });
        }

        const newReport = new medicalReportModel({
            id,
            specialistId,
            diagnosis,
            treatmentPlan,
            notes
        });

        await newReport.save();
        res.status(201).json({ message: "تمت إضافة التقرير الطبي بنجاح", report: newReport });
    } catch (error) {
        res.status(500).json({ message: `خطأ: ${error.message}` });
    }
};

export const getAllMedicalReports = async (req, res) => {
    try {
        const reports = await medicalReportModel.find()
         

        res.status(200).json({ reports });
    } catch (error) {
        res.status(500).json({ message: `خطأ: ${error.message}` });
    }
};

export const getMedicalReportsByUser = async (req, res) => {
    try {
        const userId = req.user._id;
        
        let reports;
        if (req.user.role === "guardian") {
          
            reports = await medicalReportModel.find({ id: userId });
        } else if (req.user.role === "Specialist") {
            reports = await medicalReportModel.find({ id: userId });
        } else {
            return res.status(403).json({ message: "ليس لديك صلاحية للوصول إلى التقارير." });
        }

        if (!reports.length) {
            return res.status(404).json({ message: "لا توجد تقارير متاحة لك." });
        }

        res.status(200).json({ reports });
    } catch (error) {
        res.status(500).json({ message: `خطأ: ${error.message}` });
    }
};
export const updateMedicalReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { diagnosis, treatmentPlan, notes } = req.body;

        let report;
        if (req.user.role === "manager") {
            report = await medicalReportModel.findById(id);
        } else {
            report = await medicalReportModel.findOne({ _id: id, specialistId: req.user._id });
        }

        if (!report) {
            return res.status(403).json({ message: "لا يمكنك تعديل هذا التقرير." });
        }

        report.diagnosis = diagnosis ?? report.diagnosis;
        report.treatmentPlan = treatmentPlan ?? report.treatmentPlan;
        report.notes = notes ?? report.notes;

        await report.save();
        res.status(200).json({ message: "تم تحديث التقرير بنجاح", report });
    } catch (error) {
        res.status(500).json({ message: `خطأ: ${error.message}` });
    }
};
export const deleteMedicalReport = async (req, res) => {
    try {
        const { id } = req.params;

        let report;

        if (req.user.role === "manager") {
            
            report = await medicalReportModel.findById(id);
        } else {
           
            report = await medicalReportModel.findOne({ _id: id, specialistId: req.user._id });
        }

        if (!report) {
            return res.status(403).json({ message: "لا يمكنك حذف هذا التقرير." });
        }

        await medicalReportModel.findByIdAndDelete(id);
        res.status(200).json({ message: "تم حذف التقرير بنجاح" });
    } catch (error) {
        res.status(500).json({ message: `خطأ: ${error.message}` });
    }
};
