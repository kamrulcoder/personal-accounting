import { Schema, model } from "mongoose";


const transactorSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        // bd phone number match
        match: [/^\+8801[3-9]\d{8}$/, "Please enter a valid Bangladeshi phone number"]
    },
    email: {
        type: String,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    address: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },


},{
    timestamps: true
});

const Transactor = model('Transactor', transactorSchema);

export default Transactor;