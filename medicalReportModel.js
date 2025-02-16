import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, 
    specialistId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    diagnosis: { type: String, required: true }, 
    treatmentPlan: { type: String, required: true },
    notes: { type: String, default: "" }, 
    createdAt: { type: Date, default: Date.now } 
});

const medicalReportModel = mongoose.model("MedicalReport", medicalReportSchema);
export default medicalReportModel;
