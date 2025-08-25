import mongoose, { Schema, Document } from 'mongoose';

export interface IFonepayLog extends Document {
  prn: string;
  requestData?: any;
  responseData?: any;
  responseStatus?: number;
  success: boolean;
  errorMessage?: string;
  
  // FonePay specific fields
  bankCode?: string;
  accountNumber?: string;
  rc?: string;
  p_amt?: string;
  
  // Metadata
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const FonepayLogSchema: Schema = new Schema({
  prn: {
    type: String,
    required: true,
    index: true
  },
  requestData: {
    type: Schema.Types.Mixed,
    default: null
  },
  responseData: {
    type: Schema.Types.Mixed,
    default: null
  },
  responseStatus: {
    type: Number,
    default: null
  },
  success: {
    type: Boolean,
    required: true,
    default: false
  },
  errorMessage: {
    type: String,
    default: null
  },
  
  // FonePay specific fields
  bankCode: {
    type: String,
    default: null
  },
  accountNumber: {
    type: String,
    default: null
  },
  rc: {
    type: String,
    default: null
  },
  p_amt: {
    type: String,
    default: null
  },
  
  // Metadata
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
FonepayLogSchema.index({ prn: 1, timestamp: -1 });
FonepayLogSchema.index({ success: 1, timestamp: -1 });

export const FonepayLogModel = mongoose.model<IFonepayLog>('FonepayLog', FonepayLogSchema);