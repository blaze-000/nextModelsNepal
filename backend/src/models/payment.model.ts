import mongoose, { Schema, model } from 'mongoose';

export type PaymentStatus = 'created' | 'sent' | 'success' | 'failed' | 'pending' | 'error';

const PaymentSchema = new Schema(
    {
        prn: { type: String, unique: true, required: true, index: true },
        pid: { type: String, required: true },
        contestant_Id: {type: Schema.Types.ObjectId, ref:"Contestant", required: true},
        contestant_Name: {type: String, required: true},
        vote: {type: Number, required: true},
        currency: { type: String, default: 'NPR' },
        amount: { type: Number, required: true },
        purpose: { type: String, required: false },

        // request payload
        ru: String,
        ri: String,
        r1: String,
        r2: String,
        md: { type: String, default: 'P' },
        dt: String,
        requestDv: String,

        // response from RU
        ps: String,
        rc: String,
        uid: String,
        bc: String,
        ini: String,
        p_amt: String,
        r_amt: String,
        responseDv: String,

        status: { type: String, default: 'created' },
        apiVerificationStatus: { type: String, default: 'pending' },
        apiResponse: Schema.Types.Mixed,
    },
    { timestamps: true }
);

export const Payment = model('Payment', PaymentSchema);
