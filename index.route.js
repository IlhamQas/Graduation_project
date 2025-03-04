import adminRouter from "./Admin/Admin.route.js";
import AppointmentRouter from "./Appointment/Appointment.route.js";
import authRouter from "./auth/auth.route.js";
import ContactRouter from "./contact/contact.route.js";
import financialRouter from "./financialRecord/financialRecord.route.js";
import medicalReportRouter from "./medicalReport/medicalReport.route.js";
import orderRouter from "./order/order.route.js";
import pendingRouter from "./pending/pending.route.js";
import pendingAppointmentRouter from "./pendingAppointment/pendingAppointment.route.js";
import productRouter from "./product/product.route.js";
import profileRouter from "./profile/profile.route.js";
import salesRouter from "./sales/sales.route.js";


export{
    authRouter,
    pendingRouter,
    adminRouter,
    AppointmentRouter,
    pendingAppointmentRouter,
    productRouter,
    orderRouter,
    financialRouter,
    salesRouter,
    medicalReportRouter,
    profileRouter,
    ContactRouter

 
}
