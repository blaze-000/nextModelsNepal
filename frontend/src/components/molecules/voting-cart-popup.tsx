"use client";
import { Button } from "../ui/button";
import { useCart } from "@/context/cartContext";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import Axios from "@/lib/axios-instance";
import { createBulkPayment, createPaymentForm } from "@/lib/payment.service";

interface VotingCartPopupProps {
  seasonId: string;
  pricePerVote: number;
  paylink?: string;
}

interface Contestant {
  _id: string;
  name: string;
  status: string;
}

export default function VotingCartPopup({
  seasonId,
  pricePerVote,
}: VotingCartPopupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [manuallyCollapsed, setManuallyCollapsed] = useState(false);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { getCartItems, getTotalPrice, updateVotes, removeFromCart, filterEliminatedContestants } = useCart();

  // Fetch contestants data and filter eliminated ones
  useEffect(() => {
    const fetchContestants = async () => {
      try {
        setIsLoading(true);
        const response = await Axios.get(`/api/contestants/season/${seasonId}`);
        if (response.data.success) {
          const allContestants = response.data.data;
          setContestants(allContestants);

          // Filter out eliminated contestants from cart
          const eliminatedContestantIds = allContestants
            .filter((contestant: Contestant) => contestant.status.toLowerCase() === "eliminated")
            .map((contestant: Contestant) => contestant._id);

          if (eliminatedContestantIds.length > 0) {
            filterEliminatedContestants(seasonId, eliminatedContestantIds);
          }
        }
      } catch (error) {
        console.error("Error fetching contestants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContestants();
  }, [seasonId, filterEliminatedContestants]);

  const items = getCartItems(seasonId);
  const totalPrice = getTotalPrice(seasonId, pricePerVote);


  // Auto-expand cart when items are added (only if not manually collapsed)
  useEffect(() => {
    if (items.length > 0 && !isExpanded && !manuallyCollapsed) {
      setIsExpanded(true);
    }
  }, [items.length, isExpanded, manuallyCollapsed]);


  // Helper function to get contestant name by ID
  const getContestantName = useCallback((contestantId: string) => {
    const contestant = contestants.find(c => c._id === contestantId);
    return contestant?.name || `Contestant ${contestantId}`;
  }, [contestants]);

  // Handle payment processing
  const handlePayment = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Prepare bulk payment data
      const totalVotes = items.reduce((sum, item) => sum + item.votes, 0);
      const totalAmount = totalVotes * pricePerVote;
      
      // Use the first contestant as primary for the payment request
      const primaryContestant = items[0];
      
      // Create items array for R1 parameter
      const paymentItems = items.map(item => ({
        id: item.contestant_id, // Use full ID instead of truncated version
        v: item.votes // Use short field name
      }));
      
      // Create a minimal representation to avoid length limitations
      const r1Data = {
        i: paymentItems, // Short field name for items
        c: items.length, // Short field name for count
        t: totalVotes // Short field name for total
      };
      
      const bulkPaymentData = {
        amount: totalAmount,
        vote: totalVotes,
        contestant_Id: primaryContestant.contestant_id,
        description: `Bulk vote for ${items.length} contestant${items.length > 1 ? 's' : ''}`,
        purpose: 'Bulk vote payment',
        r1: JSON.stringify(r1Data), // Pass all items in r1 for backend processing
      };

      // Create payment session
      const paymentResponse = await createBulkPayment(bulkPaymentData);
      
      // Store PRN for status checking
      sessionStorage.setItem('last_prn', paymentResponse.prn);
      
      // Create and submit payment form
      createPaymentForm(paymentResponse.redirectUrl, true);
      
      toast.success('Redirecting to payment gateway...');
      
      // The form will auto-submit and redirect to FonePay
    } catch (error: unknown) {
      console.error('Payment initiation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment';
      toast.error(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Don't render if loading or no items
  if (isLoading || items.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-[1018px] mx-auto">
      {isExpanded ? (
        // Expanded State
        <div className="px-6 py-9 bg-muted-background rounded-xl border border-neutral-600">
          <div className="flex flex-col gap-6">
            {/* Header with collapse button */}
            <div className="flex justify-between items-center">
              <h3 className="text-white text-lg font-normal font-urbanist">
                Your Cart ({items.length} items)
              </h3>
              <button
                onClick={() => {
                  setIsExpanded(false);
                  setManuallyCollapsed(true);
                }}
                className="cursor-pointer text-white hover:text-primary transition-colors"
                title="Collapse cart"
              >
                <i className="ri-arrow-down-line text-xl bg-primary/10 p-2 rounded-full" />
              </button>
            </div>

            {/* Table and Pay Now Button Row */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-base">
              {/* Table */}
              <div className="flex-1">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-600">
                      <th className="text-left py-1 px-2">
                        <span className="text-white font-normal font-urbanist leading-loose tracking-tight">
                          Action
                        </span>
                      </th>
                      <th className="text-left py-1 px-2">
                        <span className="text-white font-normal font-urbanist leading-loose tracking-tight">
                          Model Name
                        </span>
                      </th>
                      <th className="text-center py-1 px-2">
                        <span className="text-white font-normal font-urbanist leading-loose tracking-tight">
                          Total Votes
                        </span>
                      </th>
                      <th className="text-right py-1 px-2">
                        <span className="text-white font-normal font-urbanist leading-loose tracking-tight">
                          Price
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.contestant_id} className="border-b border-neutral-700">
                        <td className="py-2 px-2">
                          <button
                            onClick={() => {
                              removeFromCart(seasonId, item.contestant_id);
                              toast.success(`${getContestantName(item.contestant_id)} removed from cart`);
                            }}
                            className="cursor-pointer text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10 transition-colors"
                            title="Remove from cart"
                          >
                            <i className="ri-close-line" />
                          </button>
                        </td>
                        <td className="py-2 px-2">
                          <span className="text-white font-normal font-newsreader tracking-tight">
                            {getContestantName(item.contestant_id)}
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <div className="flex justify-center items-center gap-3">
                            <span className="text-white font-normal font-newsreader tracking-tight">
                              {item.votes}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateVotes(seasonId, item.contestant_id, item.votes + 1)}
                                className="cursor-pointer p-1 rounded-full transition-colors"
                              >
                                <i className="ri-add-line text-primary text-sm bg-primary/15 p-1 rounded-full hover:bg-primary/30 transition-colors" />
                              </button>
                              <button
                                onClick={() => {
                                  if (item.votes <= 1) {
                                    removeFromCart(seasonId, item.contestant_id);
                                    toast.success(`${getContestantName(item.contestant_id)} removed from cart`);
                                  } else {
                                    updateVotes(seasonId, item.contestant_id, item.votes - 1);
                                  }
                                }}
                                className="cursor-pointer p-1 rounded-full transition-colors"
                              >
                                <i className="ri-subtract-line text-primary text-sm bg-primary/15 p-1 rounded-full hover:bg-primary/30 transition-colors" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <span className="text-primary font-normal font-newsreader tracking-tight">
                            Rs. {pricePerVote * item.votes}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total Price Row */}
                <div className="flex justify-center items-center gap-4 pt-4 border-neutral-600 text-lg">
                  <span className="text-white font-normal font-urbanist leading-loose tracking-tight">
                    Total Price
                  </span>
                  <span className="text-primary font-normal font-newsreader tracking-tight">
                    Rs. {totalPrice}
                  </span>
                </div>
              </div>

              {/* Pay Now Button */}
              <div className="flex-shrink-0">
                <Button 
                  variant="default" 
                  onClick={handlePayment}
                  disabled={isProcessingPayment || items.length === 0}
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay Now
                      <i className="ri-arrow-right-up-line" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Collapsed State - Thin rectangular box
        <div
          className="px-6 py-3 bg-muted-background rounded-t-[20px] border border-neutral-600 cursor-pointer hover:bg-muted-background/80 transition-colors"
          onClick={() => {
            setIsExpanded(true);
            setManuallyCollapsed(false);
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-white font-normal font-urbanist">
                Cart ({items.length} items)
              </span>
              <span className="text-primary font-normal font-newsreader">
                Rs. {totalPrice}
              </span>
            </div>
            <div className="flex items-center gap-3">

              <Button 
                variant="default" 
                size="sm"
                onClick={handlePayment}
                disabled={isProcessingPayment || items.length === 0}
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Pay Now
                    <i className="ri-arrow-right-up-line" />
                  </>
                )}

              </Button>
              <div
                className="cursor-pointer text-white hover:text-primary transition-colors"
                title="Expand cart"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                  setManuallyCollapsed(false);
                }}
              >
                <i className="ri-arrow-up-line text-xl bg-primary/10 p-2 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
