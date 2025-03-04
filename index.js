import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import * as indexRouter from './src/modules/index.route.js'
import connectDB from './DB/connection.js'
const app = express();
app.use(express.json())
dotenv.config()
connectDB()
app.use(cors())
app.use('/api/v1/auth', indexRouter.authRouter)
app.use('/api/v1/pending', indexRouter.pendingRouter)
app.use('/api/v1/admin', indexRouter.adminRouter)
app.use('/api/v1/appointment', indexRouter.AppointmentRouter)
app.use('/api/v1/pendingAppointment', indexRouter.pendingAppointmentRouter)
app.use('/api/v1/product',indexRouter.productRouter)
app.use('/api/v1/order',indexRouter.orderRouter)
app.use('/api/v1/financial', indexRouter.financialRouter)
app.use('/api/v1/sale', indexRouter.salesRouter)
app.use('/api/v1/medical', indexRouter.medicalReportRouter)
app.use('/api/v1/profile', indexRouter.profileRouter)
app.use('/api/v1/contact',indexRouter.ContactRouter)
app.use('*', (req, res) => {
    res.status(500).json({ message: "invalid page" })
})
app.listen(process.env.port, (req, res) => {
    console.log(`Running Server ${process.env.port}`)
})
