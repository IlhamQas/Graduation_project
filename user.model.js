import { Types, Schema, model } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0 
    },
    role: {
        type: String,
        enum: ['maneger', 'specialist', 'guardian', 'admin', 'marketing_agents', 'guest'],
        default: 'guest'
    },
    image:{
    type:String
    },
    status: {
        type: String,
        enum: ['pending ', 'active', 'reject']
    },
    createdAt: {
        type: Date,
        default: Date.now

    },

    confirmEmail: {
        type: Boolean,
        default: false
    },
    
 
    sendCode: {
        type: String,
        default: null
    },
}, { timestamps: true })
const userModel = model('user', userSchema)
export { userModel } 