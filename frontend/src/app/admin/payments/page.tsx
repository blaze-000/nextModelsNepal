"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Axios from '@/lib/axios-instance';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

interface ContestantInfo {
  id: string;
  name: string;
  votes: number;
}

interface Payment {
  _id: string;
  prn: string;
  contestant_Id: string;
  contestant_Name: string;
  vote: number;
  amount: number;
  currency: string;
  status: string;
  ps?: string;
  rc?: string;
  uid?: string;
  bc?: string;
  p_amt?: string;
  r_amt?: string;
  createdAt: string;
  updatedAt: string;
  contestants?: ContestantInfo[];
}

interface PaymentStats {
  totalPayments: number;
  totalRevenue: number;
  totalVotes: number;
  statusCounts: Record<string, number>;
  recentPayments: Payment[];
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'single' | 'all' | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, []);

  useEffect(() => {
    // Filter payments based on search term and status
    let filtered = payments;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(payment => 
        payment.prn.toLowerCase().includes(term) ||
        (payment.contestants && payment.contestants.some(c => c.name.toLowerCase().includes(term))) ||
        payment.status.toLowerCase().includes(term) ||
        (payment.contestant_Id && payment.contestant_Id.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }
    
    setFilteredPayments(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, payments]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await Axios.get('/api/fonepay/payment');
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      setStatsLoading(true);
      const response = await Axios.get('/api/fonepay/payment/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch payment stats:', error);
      toast.error('Failed to load payment statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const deletePayment = async (id: string) => {
    try {
      setDeleting(true);
      await Axios.delete(`/api/fonepay/payment/${id}`);
      toast.success('Payment deleted successfully');
      fetchPayments();
      fetchPaymentStats();
    } catch (error) {
      console.error('Failed to delete payment:', error);
      toast.error('Failed to delete payment');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      setPaymentToDelete(null);
    }
  };

  const deleteAllPayments = async () => {
    try {
      setDeleting(true);
      await Axios.delete('/api/fonepay/payment');
      toast.success('All payments deleted successfully');
      fetchPayments();
      fetchPaymentStats();
    } catch (error) {
      console.error('Failed to delete all payments:', error);
      toast.error('Failed to delete all payments');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const handleDeleteClick = (type: 'single' | 'all', id?: string) => {
    setDeleteTarget(type);
    if (id) {
      setPaymentToDelete(id);
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteTarget === 'single' && paymentToDelete) {
      deletePayment(paymentToDelete);
    } else if (deleteTarget === 'all') {
      deleteAllPayments();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      created: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      error: 'bg-purple-100 text-purple-800',
      sent: 'bg-indigo-100 text-indigo-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Get current payments for pagination
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  // Render contestant information
  const renderContestantInfo = (payment: Payment) => {
    if (payment.contestants && payment.contestants.length > 1) {
      // Bulk payment with multiple contestants
      return (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Bulk Payment:</div>
          <div className="space-y-1">
            {payment.contestants.map((contestant, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="font-medium">{contestant.name}</span>
                <span>{contestant.votes} votes</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-bold border-t pt-1 mt-1">
              <span>Total:</span>
              <span>{payment.contestants.reduce((total, c) => total + c.votes, 0)} votes</span>
            </div>
          </div>
        </div>
      );
    } else if (payment.contestants && payment.contestants.length === 1) {
      // Single contestant payment
      const contestant = payment.contestants[0];
      return (
        <div className="font-medium">
          {contestant.name} ({contestant.votes} votes)
        </div>
      );
    } else {
      // Fallback to original data
      return (
        <div className="font-medium">
          {payment.contestant_Name} ({payment.vote} votes)
        </div>
      );
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-newsreader">
            Payment Management
          </h1>
          <p className="text-foreground/70 mt-1 text-sm sm:text-base">
            Manage and track all payment transactions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="destructive"
            onClick={() => handleDeleteClick('all')}
            disabled={deleting || payments.length === 0}
          >
            {deleting ? (
              <Spinner className="w-4 h-4 mr-2" />
            ) : (
              <i className="ri-delete-bin-line mr-2"></i>
            )}
            Delete All
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-muted-background border border-gold-900/20 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gold-900/30 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gold-900/30 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-muted-background border border-gold-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm">Total Payments</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.totalPayments}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-exchange-dollar-line text-blue-500"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-muted-background border border-gold-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-green-500"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-muted-background border border-gold-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm">Total Votes</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.totalVotes.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-bar-chart-grouped-line text-purple-500"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-muted-background border border-gold-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.totalPayments > 0 
                    ? Math.round(((stats.statusCounts.success || 0) / stats.totalPayments) * 100) 
                    : 0}%
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-percent-line text-yellow-500"></i>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Filters and Search */}
      <div className="bg-muted-background border border-gold-900/20 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by PRN, contestant name, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-background border border-gold-900/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="created">Created</option>
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="error">Error</option>
              <option value="sent">Sent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-muted-background border border-gold-900/20 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Spinner className="w-8 h-8 mx-auto" />
            <p className="mt-2 text-foreground/70">Loading payments...</p>
          </div>
        ) : currentPayments.length === 0 ? (
          <div className="p-8 text-center">
            <i className="ri-folder-2-line text-4xl text-foreground/30 mb-3"></i>
            <h3 className="text-lg font-medium text-foreground mb-1">No payments found</h3>
            <p className="text-foreground/70">
              {searchTerm || statusFilter !== 'all' 
                ? 'No payments match your search criteria' 
                : 'No payments have been processed yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gold-900/10">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground/70 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground/70 uppercase tracking-wider">
                      Contestant(s)
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground/70 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground/70 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground/70 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-foreground/70 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-900/10">
                  {currentPayments.map((payment) => (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gold-900/5"
                    >
                      <td className="py-3 px-4">
                        <div className="font-mono text-sm text-foreground/80">
                          {payment.prn}
                        </div>
                        {payment.ps && (
                          <div className="text-xs text-foreground/60 mt-1">
                            PS: {payment.ps}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {renderContestantInfo(payment)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          {formatCurrency(payment.amount)}
                        </div>
                        {payment.p_amt && payment.p_amt !== payment.amount.toString() && (
                          <div className="text-xs text-foreground/60">
                            Paid: {formatCurrency(parseFloat(payment.p_amt))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground/70">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPayment(payment);
                          }}
                        >
                          <i className="ri-eye-line"></i>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick('single', payment._id)}
                          disabled={deleting}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gold-900/10 px-4 py-3 flex items-center justify-between">
                <div className="text-sm text-foreground/70">
                  Showing {indexOfFirstPayment + 1} to {Math.min(indexOfLastPayment, filteredPayments.length)} of {filteredPayments.length} payments
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <i className="ri-arrow-left-line"></i>
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = currentPage <= 3 
                      ? i + 1 
                      : currentPage >= totalPages - 2 
                        ? totalPages - 4 + i 
                        : currentPage - 2 + i;
                    
                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                    return null;
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <i className="ri-arrow-right-line"></i>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Payment Details</h3>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-foreground/50 hover:text-foreground"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/60">Transaction ID</p>
                    <p className="font-mono text-sm break-all">{selectedPayment.prn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Status</p>
                    <p>{getStatusBadge(selectedPayment.status)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Amount</p>
                    <p className="font-medium">{formatCurrency(selectedPayment.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Date</p>
                    <p className="text-sm">{formatDate(selectedPayment.createdAt)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-foreground/60 mb-2">Contestant(s)</p>
                  {selectedPayment.contestants && selectedPayment.contestants.length > 0 ? (
                    <div className="space-y-2">
                      {selectedPayment.contestants.map((contestant, index) => (
                        <div key={index} className="flex justify-between items-center bg-muted-background p-3 rounded">
                          <div>
                            <p className="font-medium">{contestant.name}</p>
                            <p className="text-xs text-foreground/60">ID: {contestant.id}</p>
                          </div>
                          <span className="font-medium">{contestant.votes} votes</span>
                        </div>
                      ))}
                      {selectedPayment.contestants.length > 1 && (
                        <div className="flex justify-between items-center bg-gold-900/10 p-3 rounded font-bold">
                          <span>Total Votes</span>
                          <span>
                            {selectedPayment.contestants.reduce((total, c) => total + c.votes, 0)} votes
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-muted-background p-3 rounded">
                      <p className="font-medium">{selectedPayment.contestant_Name}</p>
                      <p className="text-sm text-foreground/60">{selectedPayment.vote} votes</p>
                    </div>
                  )}
                </div>
                
                {selectedPayment.ps && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-foreground/60">Payment Status (PS)</p>
                      <p className="font-medium">{selectedPayment.ps}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Response Code (RC)</p>
                      <p className="font-medium">{selectedPayment.rc || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">User ID (UID)</p>
                      <p className="font-medium">{selectedPayment.uid || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Bank Code (BC)</p>
                      <p className="font-medium">{selectedPayment.bc || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Paid Amount (P_AMT)</p>
                      <p className="font-medium">
                        {selectedPayment.p_amt 
                          ? formatCurrency(parseFloat(selectedPayment.p_amt)) 
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Refund Amount (R_AMT)</p>
                      <p className="font-medium">
                        {selectedPayment.r_amt 
                          ? formatCurrency(parseFloat(selectedPayment.r_amt)) 
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                <i className="ri-delete-bin-line text-red-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-center mb-2">
                {deleteTarget === 'all' ? 'Delete All Payments?' : 'Delete Payment?'}
              </h3>
              <p className="text-foreground/70 text-center mb-6">
                {deleteTarget === 'all' 
                  ? 'Are you sure you want to delete all payments? This action cannot be undone.' 
                  : 'Are you sure you want to delete this payment? This action cannot be undone.'}
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTarget(null);
                    setPaymentToDelete(null);
                  }}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}