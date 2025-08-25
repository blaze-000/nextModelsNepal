import { FonepayLogModel } from '../models/fonepayLog.model';

interface LogFonepayResponseParams {
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
  req?: any; // Express request object for IP and user agent extraction
}

export async function logFonepayResponse(params: LogFonepayResponseParams) {
  try {
    let ipAddress = null;
    if (params.req) {
      ipAddress = 
        params.req.ip ||
        (params.req.headers['x-forwarded-for'] && 
         params.req.headers['x-forwarded-for'].split(',')[0].trim()) ||
        params.req.headers['x-real-ip'] ||
        params.req.headers['cf-connecting-ip'] ||
        params.req.headers['x-client-ip'] ||
        params.req.connection?.remoteAddress ||
        params.req.socket?.remoteAddress ||
        params.req.remoteAddress ||
        'unknown';
      
      if (ipAddress === '::1') {
        ipAddress = '127.0.0.1';
      }
      
      if (ipAddress && ipAddress.startsWith('::ffff:')) {
        ipAddress = ipAddress.substring(7);
      }
    }

    const userAgent = params.req?.get('User-Agent') || params.req?.headers['user-agent'] || null;

    const logEntry = new FonepayLogModel({
      prn: params.prn,
      requestData: params.requestData,
      responseData: params.responseData,
      responseStatus: params.responseStatus,
      success: params.success,
      errorMessage: params.errorMessage,
      bankCode: params.bankCode,
      accountNumber: params.accountNumber,
      rc: params.rc,
      p_amt: params.p_amt,
      ipAddress,
      userAgent,
      timestamp: new Date()
    });

    await logEntry.save();
  } catch (error) {
    // Don't throw error to avoid breaking the payment flow
  }
}

export async function getFonepayLogs(filters: {
  prn?: string;
  success?: boolean;
  limit?: number;
  skip?: number;
}) {
  try {
    const query: any = {};
    
    if (filters.prn) {
      query.prn = filters.prn;
    }
    
    if (filters.success !== undefined) {
      query.success = filters.success;
    }

    const limit = Math.min(filters.limit || 100, 1000);
    const skip = filters.skip || 0;

    const logs = await FonepayLogModel
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    return {
      success: true,
      logs,
      total: await FonepayLogModel.countDocuments(query),
      limit,
      skip
    };
  } catch (error) {
    throw new Error('Failed to retrieve logs');
  }
}