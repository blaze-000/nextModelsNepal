"use client";
import { Button } from "../ui/button";
import { useCart } from "@/context/cartContext";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import Axios from "@/lib/axios-instance";
import { createBulkPayment } from "@/lib/payment.service";
import { paymentMethods } from "@/lib/payment-methods";
import Image from "next/image";

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
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
  }, [filterEliminatedContestants, seasonId]);

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
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Prepare bulk payment data
      const totalVotes = items.reduce((sum, item) => sum + item.votes, 0);
      const totalAmount = totalVotes * pricePerVote;
      
      // Use the first contestant as primary for the payment request
      const primaryContestant = items[0];
      
      // Use an even more compact delimiter-based format to avoid length limitations
      // Format: "id1:votes1,id2:votes2,id3:votes3|count|totalVotes"
      let r1String = '';
      if (items.length <= 5) {
        // For fewer items, use the array format
        const compactItems = items.map(item => [
          item.contestant_id.substring(0, 12), // Truncate to 12 characters
          item.votes
        ]);
        
        const r1Data = {
          i: compactItems, // Ultra-compact array format
          c: items.length, // Count
          t: totalVotes // Total votes
        };
        
        r1String = encodeURIComponent(JSON.stringify(r1Data));
      } else {
        // For many items, use delimiter-based format to save even more space
        // Format: "id1:votes1,id2:votes2,id3:votes3|count|totalVotes"
        const itemStrings = items.map(item => 
          `${item.contestant_id.substring(0, 12)}:${item.votes}`
        );
        r1String = `${itemStrings.join(',')}|${items.length}|${totalVotes}`;
      }
      
      const bulkPaymentData = {
        amount: totalAmount,
        vote: totalVotes,
        contestant_Id: primaryContestant.contestant_id,
        description: `Bulk vote: ${items.length} contestants`, // Shorter description
        purpose: 'Bulk vote', // Shorter purpose
        r1: r1String, // Pass all items in r1 for backend processing
      };

      // Create payment session
      const paymentResponse = await createBulkPayment(bulkPaymentData);
      
      // Store PRN for status checking
      sessionStorage.setItem('last_prn', paymentResponse.prn);
      
      // Close modal
      setShowPaymentModal(false);
      
      // Show loading toast with a specific ID so we can dismiss it later
      const toastId = toast.loading('Redirecting to payment gateway...');
      
      // Small delay to ensure toast is visible before opening new tab
      setTimeout(() => {
        // Open payment in a new tab
        const newWindow = window.open(paymentResponse.redirectUrl, '_blank');
        
        // If popup is blocked, show error
        if (!newWindow) {
          toast.error('Popup blocked! Please allow popups for this site.', { id: toastId });
        } else {
          // Dismiss the loading toast after a short delay
          setTimeout(() => {
            toast.dismiss(toastId);
          }, 1000);
        }
      }, 500);
      
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
                            className="text-red-500 hover:text-red-400 transition-colors"
                            title="Remove from cart"
                          >
                            <i className="ri-delete-bin-line" />
                          </button>
                        </td>
                        <td className="py-2 px-2">
                          <span className="text-white font-normal font-urbanist leading-loose tracking-tight">
                            {getContestantName(item.contestant_id)}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => updateVotes(seasonId, item.contestant_id, Math.max(1, item.votes - 1))}
                              className="w-6 h-6 flex items-center justify-center bg-primary rounded-full text-white"
                              disabled={isProcessingPayment}
                            >
                              <i className="ri-subtract-line text-sm" />
                            </button>
                            <span className="text-white font-normal font-urbanist leading-loose tracking-tight min-w-[30px] text-center">
                              {item.votes}
                            </span>
                            <button
                              onClick={() => updateVotes(seasonId, item.contestant_id, item.votes + 1)}
                              className="w-6 h-6 flex items-center justify-center bg-primary rounded-full text-white"
                              disabled={isProcessingPayment}
                            >
                              <i className="ri-add-line text-sm" />
                            </button>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <span className="text-white font-normal font-urbanist leading-loose tracking-tight">
                            NPR {item.votes * pricePerVote}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pay Now Button */}
              <div className="md:w-64 flex flex-col gap-4">
                <div className="bg-[#1A1A1A] rounded-xl p-4 border border-neutral-600">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-normal font-urbanist leading-loose tracking-tight">
                      Total
                    </span>
                    <span className="text-white font-semibold font-urbanist leading-loose tracking-tight">
                      NPR {totalPrice}
                    </span>
                  </div>
                  <Button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={isProcessingPayment}
                    className="w-full bg-primary hover:bg-primary/90 text-black font-semibold font-urbanist leading-loose tracking-tight"
                  >
                    {isProcessingPayment ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Pay Now"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Collapsed State
        <div 
          className="px-6 py-4 bg-muted-background rounded-xl border border-neutral-600 cursor-pointer"
          onClick={() => {
            setIsExpanded(true);
            setManuallyCollapsed(false);
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <i className="ri-shopping-cart-2-line text-xl text-white" />
              <span className="text-white text-base font-normal font-urbanist leading-loose tracking-tight">
                Your Cart ({items.length} items)
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white text-base font-semibold font-urbanist leading-loose tracking-tight">
                NPR {totalPrice}
              </span>
              <i className="ri-arrow-up-line text-xl text-white bg-primary/10 p-2 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Selection Modal */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-background p-8 border-stone-600 border w-9/10 mdplus:w-1/2 h-1/2 flex flex-col justify-between relative"
          >
            <button
              onClick={() => setShowPaymentModal(false)}
              className='absolute -top-3 -right-3 bg-white rounded-full h-8 w-8 text-[#FF3636] flex justify-center items-center z-10 cursor-pointer'
            >
              <i className="ri-close-line text-lg" />
            </button>

            <div>
              <h2 className="text-lg text-primary font-semibold mb-4">Select your payment method</h2>
              <p className="mb-6">
                Total price
                <span className='ml-2 text-2xl text-primary font-newsreader'>NPR {totalPrice}</span>
              </p>
              <div className="flex gap-6 items-center flex-wrap">
                {paymentMethods.map(item => (
                  <div
                    key={item.name}
                    onClick={() => setSelectedMethod(item.name)}
                    className={`cursor-pointer w-[45%] border py-2 px-4 rounded-md transition-all ${selectedMethod === item.name
                      ? 'border-primary ring-1 ring-primary bg-primary/5'
                      : 'border-stone-600 hover:border-stone-400'
                      }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="h-22 w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex mt-4">
              <Button 
                variant="default" 
                disabled={!selectedMethod || isProcessingPayment}
                onClick={handlePayment}
                className="flex items-center gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Continue
                    <i className='ri-arrow-right-up-line' />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}