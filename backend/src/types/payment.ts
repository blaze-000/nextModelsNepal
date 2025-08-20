export type FonepayRequestParams = {
  RU: string;
  PID: string;
  PRN: string;
  AMT: string;
  CRN: 'NPR';
  DT: string;     // MM/DD/YYYY
  RI: string;     // <=160
  R1: string;     // <=50
  R2: string;     // <=50
  MD: 'P';
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
