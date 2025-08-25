"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPaymentStatus } from '@/lib/payment.service';
import { useCart } from '@/context/cartContext';

interface ContestantInfo {
  id: string;
  name: string;
  votes: number;
}

interface PaymentResult {
  message: string;
  isSuccess: boolean;
  status: string;
  prn: string;
  contestants?: ContestantInfo[];
  amount: number;
  event?: string;
  bankCode?: string;
  accountNumber?: string;
}

export default function PaymentStatusContent() {
  const [status, setStatus] = useState<string | null>(null);
  const [prn, setPrn] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for error parameter first
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      setStatus(errorParam);
      setLoading(false);
      return;
    }

    // read prn from querystring or sessionStorage
    const qp = searchParams?.get('prn');
    const stored = qp || sessionStorage.getItem('last_prn');
    if (!stored) {
      setLoading(false);
      setStatus('missing_prn');
      return;
    }
    setPrn(stored);

    let cancelled = false;
    const poll = async () => {
      try {
        const result = await getPaymentStatus(stored);
        if (!cancelled) {
          setStatus(result.status || 'unknown');

          // If payment was successful, extract payment details and clear cart
          if (result.success && result.payment) {
            setPaymentResult(result.payment);
            // Clear cart for successful payments
            if (result.payment.event) {
              clearCart(result.payment.event);
            }
          }

          setLoading(false);

          // Continue polling ONLY for pending statuses, stop for all other statuses including success
          if (result.status === 'pending' || result.status === 'created' || result.status === 'sent') {
            setTimeout(poll, 3000);
          }
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setStatus((error as Error).message);
          setLoading(false);
        }
      }
    };

    poll();
    return () => { cancelled = true; };
  }, [searchParams, clearCart]);

  // Function to go back to voting page
  const goToVotingPage = () => {
    if (paymentResult?.contestants && paymentResult.contestants.length > 0) {
      // Redirect to first contestant's voting page
      router.push(`/voting/event/${paymentResult.contestants[0].id}`);
    } else {
      // Fallback to events page
      router.push('/events');
    }
  };

  // Function to download payment statement as PDF
  const downloadReceipt = async () => {
    if (!receiptRef.current) return;

    setIsDownloading(true);

    try {
      // Create a simplified version of the receipt for PDF generation
      const printContent = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0f2d1f; font-size: 24px; margin-bottom: 10px;">Payment Successful!</h1>
            <p style="color: #0f2d1f; font-size: 16px;">Thank you! Your votes have been credited successfully.</p>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #22c55e; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <h2 style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
              Payment Details
            </h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                  <span style="color: #666; font-weight: 500;">Payment Status:</span>
                  <span style="font-weight: 600; color: #16a34a; background: #f0fdf4; padding: 4px 10px; border-radius: 20px; font-size: 12px;">
                    Successful
                  </span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                  <span style="color: #666; font-weight: 500;">Transaction ID:</span>
                  <span style="font-family: monospace; font-size: 14px;">${paymentResult?.prn || ''}</span>
                </div>
                
                ${paymentResult?.contestants && paymentResult.contestants.length > 0 ? `
                  <div style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                    <span style="color: #666; font-weight: 500; display: block; margin-bottom: 8px;">Contestants:</span>
                    <div style="background: #f9f9f9; padding: 10px; border-radius: 5px;">
                      ${paymentResult.contestants.map(contestant => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                          <div>
                            <div style="font-weight: 500;">${contestant.name}</div>
                            <div style="font-size: 12px; color: #888;">ID: ${contestant.id}</div>
                          </div>
                          <div style="font-weight: 600; color: #2563eb;">${contestant.votes} votes</div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
                
                ${paymentResult?.event ? `
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                    <span style="color: #666; font-weight: 500;">Event Name:</span>
                    <span style="font-weight: 500;">${paymentResult.event}</span>
                  </div>
                ` : ''}
              </div>
              
              <div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                  <span style="color: #666; font-weight: 500;">Total Votes:</span>
                  <span style="font-weight: 600; color: #2563eb; font-size: 16px;">
                    ${paymentResult?.contestants
          ? paymentResult.contestants.reduce((total, contestant) => total + contestant.votes, 0)
          : 0} votes
                  </span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                  <span style="color: #666; font-weight: 500;">Amount Paid:</span>
                  <span style="font-weight: 600; font-size: 16px;">Rs. ${paymentResult?.amount ? paymentResult.amount.toFixed(2) : '0.00'}</span>
                </div>
                
                ${paymentResult?.bankCode ? `
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                    <span style="color: #666; font-weight: 500;">Bank Code:</span>
                    <span>${paymentResult.bankCode}</span>
                  </div>
                ` : ''}
                
                ${paymentResult?.accountNumber ? `
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                    <span style="color: #666; font-weight: 500;">Account Number:</span>
                    <span>${paymentResult.accountNumber}</span>
                  </div>
                ` : ''}
                
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <span style="color: #666; font-weight: 500;">Payment Method:</span>
                  <span>FonePay</span>
                </div>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Next Models Nepal - www.nextmodelsnepal.com</p>
          </div>
        </div>
      `;

      // Create a temporary element for PDF generation
      const tempElement = document.createElement('div');
      tempElement.innerHTML = printContent;
      tempElement.style.position = 'absolute';
      tempElement.style.left = '-9999px';
      document.body.appendChild(tempElement);

      // Dynamically import html2pdf only when needed
      const html2pdf = (await import('html2pdf.js')).default;

      const opt = {
        margin: 10,
        filename: `payment-receipt-${paymentResult?.prn || 'next-models-nepal'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf(tempElement, opt);

      // Clean up
      document.body.removeChild(tempElement);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Render error message based on error type
  const renderErrorMessage = () => {
    const errorParam = searchParams?.get('error');

    switch (errorParam) {
      case 'missing_fields':
        return (
          <div className="bg-gradient-to-br from-red-900/30 to-red-950/30 border border-red-800/50 rounded-xl p-5 md:p-6 shadow-lg backdrop-blur-sm">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-900/30 mb-3 border border-red-800/50">
                <i className="ri-error-warning-fill text-red-500 text-2xl"></i>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-1">Missing Required Fields</h2>
              <p className="text-red-300 text-sm">The payment request is missing required information. Please try again.</p>
            </div>

            <div className="bg-red-900/20 rounded-lg p-3 mb-5 border border-red-800/30">
              <div className="flex justify-between items-center py-1.5 border-b border-red-800/30">
                <span className="text-red-300 font-medium text-sm">Error Code:</span>
                <span className="font-mono text-red-400 font-medium text-sm">MISSING_FIELDS</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-red-300 font-medium text-sm">Timestamp:</span>
                <span className="text-red-200 text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={goToVotingPage}
                className="bg-primary text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-colors shadow-md text-sm"
              >
                Back to Voting
              </button>
              <button
                onClick={() => router.push('/events')}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <i className="ri-list-check-line"></i>
                View All Events
              </button>
            </div>
          </div>
        );

      case 'unknown_prn':
        return (
          <div className="bg-gradient-to-br from-red-900/30 to-red-950/30 border border-red-800/50 rounded-xl p-5 md:p-6 shadow-lg backdrop-blur-sm">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-900/30 mb-3 border border-red-800/50">
                <i className="ri-error-warning-fill text-red-500 text-2xl"></i>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-1">Unknown Payment Reference</h2>
              <p className="text-red-300 text-sm">We couldn&apos;t find your payment reference. Please try again or contact support.</p>
            </div>

            <div className="bg-red-900/20 rounded-lg p-3 mb-5 border border-red-800/30">
              <div className="flex justify-between items-center py-1.5 border-b border-red-800/30">
                <span className="text-red-300 font-medium text-sm">Error Code:</span>
                <span className="font-mono text-red-400 font-medium text-sm">UNKNOWN_PRN</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-red-300 font-medium text-sm">Timestamp:</span>
                <span className="text-red-200 text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={goToVotingPage}
                className="bg-primary text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-colors shadow-md text-sm"
              >
                Back to Voting
              </button>
              <button
                onClick={() => router.push('/events')}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <i className="ri-list-check-line"></i>
                View All Events
              </button>
            </div>
          </div>
        );

      case 'prn_mismatch':
        return (
          <div className="bg-gradient-to-br from-red-900/30 to-red-950/30 border border-red-800/50 rounded-xl p-5 md:p-6 shadow-lg backdrop-blur-sm">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-900/30 mb-3 border border-red-800/50">
                <i className="ri-error-warning-fill text-red-500 text-2xl"></i>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-1">Payment Reference Mismatch</h2>
              <p className="text-red-300 text-sm">There was a mismatch with your payment reference. Please try again or contact support.</p>
            </div>

            <div className="bg-red-900/20 rounded-lg p-3 mb-5 border border-red-800/30">
              <div className="flex justify-between items-center py-1.5 border-b border-red-800/30">
                <span className="text-red-300 font-medium text-sm">Error Code:</span>
                <span className="font-mono text-red-400 font-medium text-sm">PRN_MISMATCH</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-red-300 font-medium text-sm">Timestamp:</span>
                <span className="text-red-200 text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={goToVotingPage}
                className="bg-primary text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-colors shadow-md text-sm"
              >
                Back to Voting
              </button>
              <button
                onClick={() => router.push('/events')}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <i className="ri-list-check-line"></i>
                View All Events
              </button>
            </div>
          </div>
        );

      case 'invalid_contestant':
        return (
          <div className="bg-gradient-to-br from-red-900/30 to-red-950/30 border border-red-800/50 rounded-xl p-5 md:p-6 shadow-lg backdrop-blur-sm">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-900/30 mb-3 border border-red-800/50">
                <i className="ri-error-warning-fill text-red-500 text-2xl"></i>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-1">Invalid Contestant</h2>
              <p className="text-red-300 text-sm">The contestant you&apos;re trying to vote for is not valid. Please try again with a different contestant.</p>
            </div>

            <div className="bg-red-900/20 rounded-lg p-3 mb-5 border border-red-800/30">
              <div className="flex justify-between items-center py-1.5 border-b border-red-800/30">
                <span className="text-red-300 font-medium text-sm">Error Code:</span>
                <span className="font-mono text-red-400 font-medium text-sm">INVALID_CONTESTANT</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-red-300 font-medium text-sm">Timestamp:</span>
                <span className="text-red-200 text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={goToVotingPage}
                className="bg-primary text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-colors shadow-md text-sm"
              >
                Back to Voting
              </button>
              <button
                onClick={() => router.push('/events')}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <i className="ri-list-check-line"></i>
                View All Events
              </button>
            </div>
          </div>
        );

      case 'pid_mismatch':
        return (
          <div className="bg-gradient-to-br from-red-900/30 to-red-950/30 border border-red-800/50 rounded-xl p-5 md:p-6 shadow-lg backdrop-blur-sm">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-900/30 mb-3 border border-red-800/50">
                <i className="ri-error-warning-fill text-red-500 text-2xl"></i>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-1">Merchant ID Mismatch</h2>
              <p className="text-red-300 text-sm">There was an issue with the merchant identification. Please try again or contact support.</p>
            </div>

            <div className="bg-red-900/20 rounded-lg p-3 mb-5 border border-red-800/30">
              <div className="flex justify-between items-center py-1.5 border-b border-red-800/30">
                <span className="text-red-300 font-medium text-sm">Error Code:</span>
                <span className="font-mono text-red-400 font-medium text-sm">PID_MISMATCH</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-red-300 font-medium text-sm">Timestamp:</span>
                <span className="text-red-200 text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={goToVotingPage}
                className="bg-primary text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-colors shadow-md text-sm"
              >
                Back to Voting
              </button>
              <button
                onClick={() => router.push('/events')}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <i className="ri-list-check-line"></i>
                View All Events
              </button>
            </div>
          </div>
        );

      case 'dv_mismatch':
        return (
          <div className="bg-gradient-to-br from-red-900/30 to-red-950/30 border border-red-800/50 rounded-xl p-5 md:p-6 shadow-lg backdrop-blur-sm">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-900/30 mb-3 border border-red-800/50">
                <i className="ri-error-warning-fill text-red-500 text-2xl"></i>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-1">Digital Verification Failed</h2>
              <p className="text-red-300 text-sm">Payment verification failed due to a security mismatch. Please try again or contact support.</p>
            </div>

            <div className="bg-red-900/20 rounded-lg p-3 mb-5 border border-red-800/30">
              <div className="flex justify-between items-center py-1.5 border-b border-red-800/30">
                <span className="text-red-300 font-medium text-sm">Error Code:</span>
                <span className="font-mono text-red-400 font-medium text-sm">DV_MISMATCH</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-red-300 font-medium text-sm">Timestamp:</span>
                <span className="text-red-200 text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={goToVotingPage}
                className="bg-primary text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-colors shadow-md text-sm"
              >
                Back to Voting
              </button>
              <button
                onClick={() => router.push('/events')}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <i className="ri-list-check-line"></i>
                View All Events
              </button>
            </div>
          </div>
        );

      case 'amount_mismatch':
      case 'amount_manipulation':
      case 'amount_mismatch_s2s':
        return (
          <div className="bg-gradient-to-br from-red-900/30 to-red-950/30 border border-red-800/50 rounded-xl p-5 md:p-6 shadow-lg backdrop-blur-sm">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-900/30 mb-3 border border-red-800/50">
                <i className="ri-error-warning-fill text-red-500 text-2xl"></i>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-1">Payment Amount Error</h2>
              <p className="text-red-300 text-sm">There was an issue with the payment amount. Please try again or contact support.</p>
            </div>

            <div className="bg-red-900/20 rounded-lg p-3 mb-5 border border-red-800/30">
              <div className="flex justify-between items-center py-1.5 border-b border-red-800/30">
                <span className="text-red-300 font-medium text-sm">Error Code:</span>
                <span className="font-mono text-red-400 font-medium text-sm">AMOUNT_MISMATCH</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-red-300 font-medium text-sm">Timestamp:</span>
                <span className="text-red-200 text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-5 border border-red-800/50">
              <p className="text-red-200 text-sm">
                If you were charged despite this error, please contact support with your transaction ID: <code className="bg-red-900/50 px-2 py-1 rounded text-xs">{prn}</code>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={goToVotingPage}
                className="bg-primary text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-colors shadow-md text-sm"
              >
                Back to Voting
              </button>
              <button
                onClick={() => router.push('/events')}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <i className="ri-list-check-line"></i>
                View All Events
              </button>
            </div>
          </div>
        );

      case 'missing_prn':
        return (
          <div className="bg-gradient-to-br from-amber-900/30 to-amber-950/30 border border-amber-800/50 rounded-xl p-5 md:p-6 shadow-lg backdrop-blur-sm">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-900/30 mb-3 border border-amber-800/50">
                <i className="ri-error-warning-fill text-amber-500 text-2xl"></i>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-amber-400 mb-1">Payment Reference Missing</h2>
              <p className="text-amber-300 text-sm">No payment reference was found. This can happen if you refreshed the page or there was an issue with the payment process.</p>
            </div>

            <div className="bg-amber-900/20 rounded-lg p-3 mb-5 border border-amber-800/30">
              <div className="flex justify-between items-center py-1.5 border-b border-amber-800/30">
                <span className="text-amber-300 font-medium text-sm">Error Code:</span>
                <span className="font-mono text-amber-400 font-medium text-sm">MISSING_PRN</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-amber-300 font-medium text-sm">Timestamp:</span>
                <span className="text-amber-200 text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-amber-900/30 rounded-lg p-3 mb-5 border border-amber-800/50">
              <p className="text-amber-200 text-sm">
                Please check your payment history or contact support with any transaction details you have.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={goToVotingPage}
                className="bg-primary text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-colors shadow-md text-sm"
              >
                Back to Voting
              </button>
              <button
                onClick={() => router.push('/events')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <i className="ri-list-check-line"></i>
                View All Events
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gradient-to-br from-red-900/30 to-red-950/30 border border-red-800/50 rounded-xl p-5 md:p-6 shadow-lg backdrop-blur-sm">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-900/30 mb-3 border border-red-800/50">
                <i className="ri-error-warning-fill text-red-500 text-2xl"></i>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-1">Payment Error</h2>
              <p className="text-red-300 text-sm">An error occurred during payment processing. Please try again or contact support.</p>
            </div>

            <div className="bg-red-900/20 rounded-lg p-3 mb-5 border border-red-800/30">
              <div className="flex justify-between items-center py-1.5 border-b border-red-800/30">
                <span className="text-red-300 font-medium text-sm">Error Code:</span>
                <span className="font-mono text-red-400 font-medium text-sm">PAYMENT_ERROR</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-red-300 font-medium text-sm">Timestamp:</span>
                <span className="text-red-200 text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-red-900/30 rounded-lg p-3 mb-5 border border-red-800/50">
              <p className="text-red-200 text-sm">
                If you were charged despite this error, please contact support with your transaction ID: <code className="bg-red-900/50 px-2 py-1 rounded text-xs">{prn}</code>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={goToVotingPage}
                className="bg-primary text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-colors shadow-md text-sm"
              >
                Back to Voting
              </button>
              <button
                onClick={() => router.push('/events')}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <i className="ri-list-check-line"></i>
                View All Events
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-5 text-center">Payment Status</h1>

      {!prn && (
        <div className="bg-gradient-to-br from-amber-900/30 to-amber-950/30 border border-amber-800/50 rounded-xl p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="ri-information-fill text-amber-500 text-xl"></i>
            </div>
            <div className="ml-2.5">
              <h2 className="text-lg font-semibold text-amber-400">No Payment Information</h2>
              <p className="text-amber-300 text-sm">No payment identifier found. If you just paid, try returning from the gateway or check your browser session.</p>

              <div className="mt-3">
                <button
                  onClick={() => router.push('/events')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 text-sm"
                >
                  <i className="ri-list-check-line"></i>
                  Back to Events
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-xl shadow-lg backdrop-blur-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
          <span className="text-base">Checking payment status...</span>
        </div>
      )}

      {!loading && status === 'success' && (
        <div
          className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 md:p-6 shadow-lg"
          ref={receiptRef}
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-3">
              <i className="ri-checkbox-circle-fill text-green-600 text-2xl"></i>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-green-800 mb-1">Payment Successful!</h2>
            <p className="text-green-700 text-base">Thank you! Your votes have been credited successfully.</p>
          </div>

          {paymentResult && (
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-200">Payment Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left Column */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start pb-2.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium text-sm">Payment Status:</span>
                    <span className="font-semibold text-green-600 bg-green-100 px-2.5 py-1 rounded-full text-xs">Successful</span>
                  </div>

                  <div className="flex justify-between items-start pb-2.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium text-sm">Transaction ID:</span>
                    <span className="font-mono text-gray-800 break-all text-right text-sm">{paymentResult.prn}</span>
                  </div>

                  {paymentResult.contestants && paymentResult.contestants.length > 0 && (
                    <div className="pb-2.5 border-b border-gray-100">
                      <span className="text-gray-600 font-medium text-sm block mb-2">Contestants:</span>
                      <div className="space-y-2">
                        {paymentResult.contestants.map((contestant, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <div>
                              <span className="font-medium text-gray-800 text-sm">{contestant.name}</span>
                              <br />
                              <span className="text-gray-500 text-xs">ID: {contestant.id}</span>
                            </div>
                            <span className="font-semibold text-blue-600 text-sm">{contestant.votes} votes</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {paymentResult.event && (
                    <div className="flex justify-between items-start pb-2.5 border-b border-gray-100">
                      <span className="text-gray-600 font-medium text-sm">Event Name:</span>
                      <span className="font-medium text-gray-800 text-sm">{paymentResult.event}</span>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start pb-2.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium text-sm">Total Votes:</span>
                    <span className="font-semibold text-blue-600 text-base">
                      {paymentResult.contestants
                        ? paymentResult.contestants.reduce((total, contestant) => total + contestant.votes, 0)
                        : 0} votes
                    </span>
                  </div>

                  <div className="flex justify-between items-start pb-2.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium text-sm">Amount Paid:</span>
                    <span className="font-semibold text-gray-800 text-base">Rs. {paymentResult.amount.toFixed(2)}</span>
                  </div>

                  {paymentResult.bankCode && (
                    <div className="flex justify-between items-start pb-2.5 border-b border-gray-100">
                      <span className="text-gray-600 font-medium text-sm">Bank Code:</span>
                      <span className="font-medium text-gray-800 text-sm">{paymentResult.bankCode}</span>
                    </div>
                  )}

                  {paymentResult.accountNumber && (
                    <div className="flex justify-between items-start pb-2.5 border-b border-gray-100">
                      <span className="text-gray-600 font-medium text-sm">Account Number:</span>
                      <span className="font-medium text-gray-800 text-sm">{paymentResult.accountNumber}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 font-medium text-sm">Payment Method:</span>
                    <span className="font-medium text-gray-800 text-sm">FonePay</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={downloadReceipt}
              disabled={isDownloading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <i className="ri-file-download-line"></i>
                  Download Receipt
                </>
              )}
            </button>
            <button
              onClick={goToVotingPage}
              className="bg-primary text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-colors shadow-md text-sm"
            >
              Back to Voting
            </button>
          </div>
        </div>
      )}

      {!loading && status !== 'success' && status !== null && renderErrorMessage()}

      {!loading && status === null && !prn && (
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-950/30 border border-blue-800/50 rounded-xl p-5 shadow-lg backdrop-blur-sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-900/30 mb-3 border border-blue-800/50">
              <i className="ri-time-line text-blue-400 text-2xl"></i>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-blue-300 mb-2">Waiting for Payment</h2>
            <p className="text-blue-200 text-base mb-5">Please complete your payment through FonePay to continue.</p>

            <div className="bg-blue-900/20 rounded-lg p-4 mb-5 border border-blue-800/30 max-w-md mx-auto">
              <div className="flex items-center text-blue-200 text-sm mb-2">
                <i className="ri-information-line mr-2"></i>
                <span>Having trouble with payment?</span>
              </div>
              <p className="text-blue-300 text-xs">
                If you&rsquo;ve already paid but this page isn&rsquo;t updating, please check your payment history or contact support with your transaction details.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => router.push('/events')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <i className="ri-list-check-line"></i>
                View All Events
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}