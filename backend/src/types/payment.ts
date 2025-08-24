export type FonepayRequestParams = {
  PID: string;
  MD: 'P';
  PRN: string;
  AMT: string;
  CRN: 'NPR';
  DT: string;     // MM/DD/YYYY
  R1: string;     // <=50
  R2: string;     // <=50
  RU: string;
  DV: string;
};

export type FonepayReturnParams = {
  PRN: string;
  PID: string;
  PS: string;      // "true" | "false" or other?
  RC: string;      // response code
  UID: string;     // trace id
  BC?: string;
  INI?: string;
  'P_AMT'?: string;
  'R_AMT'?: string;
  DV: string;
  [k: string]: any;
};

export type TxnVerificationBody = {
  prn: string;
  merchantCode: string;
  amount: string;
};
