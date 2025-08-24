"use client";

import React, { useEffect, useState } from 'react';

export default function PaymentStatusPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [prn, setPrn] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // read prn from querystring or sessionStorage
    const params = new URLSearchParams(window.location.search);
    const qp = params.get('prn');
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
        const res = await fetch(`/api/fonepay/payment/status/${encodeURIComponent(stored)}`);
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          setStatus('error');
          setLoading(false);
          return;
        }
        const j = await res.json();
        const s = j.status;
        if (!cancelled) {
          setStatus(s);
          setLoading(false);
          if (s === 'pending' || s === 'created' || s === 'sent') {
            // poll again
            setTimeout(poll, 3000);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setStatus('error');
          setLoading(false);
        }
      }
    };

    poll();
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-4">Payment status</h1>
      {!prn && <p>No payment identifier found. If you just paid, try returning from the gateway or check your browser session.</p>}

      {loading && <p>Checking payment status...</p>}

      {!loading && status === 'success' && (
        <div>
          <h2 className="text-xl font-semibold text-green-600">Payment successful</h2>
          <p>Thank you. Your votes have been credited.</p>
        </div>
      )}

      {!loading && (status === 'failed' || status === 'error') && (
        <div>
          <h2 className="text-xl font-semibold text-red-600">Payment failed or could not be verified</h2>
          <p>If you were charged, contact support with your PRN: <code>{prn}</code></p>
        </div>
      )}

      {!loading && status === 'pending' && (
        <div>
          <h2 className="text-xl font-semibold">Payment pending</h2>
          <p>Your payment verification is in progress. This page will refresh automatically.</p>
        </div>
      )}

      {!loading && status === 'missing_prn' && (
        <div>
          <h2 className="text-xl font-semibold">No payment information</h2>
          <p>We couldn't find the payment identifier. If you started a payment recently, please return to the gateway or contact support.</p>
        </div>
      )}
    </main>
  );
}
