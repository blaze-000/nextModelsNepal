"use client";

import { useEffect, useState, useRef } from 'react';
import type React from "react";
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Axios from '@/lib/axios-instance';
import { normalizeImagePath } from '@/lib/utils';
import { paymentMethods } from '@/lib/payment-methods';
import { useCart } from '@/context/cartContext';
import VotingCartPopup from '@/components/molecules/voting-cart-popup';
import { toast } from 'sonner';
import { createPayment, createPaymentForm } from '@/lib/payment.service';

type Contestant = {
  _id: string;
  name: string;
  intro: string;
  gender: string;
  address: string;
  uniqueId: string;
  image: string;
  status: "Eliminated" | "Not Eliminated",
  seasonId: {
    _id: string;
    pricePerVote: number;
  }
}

const ModelVoting: React.FC = () => {
  const { contestant_id } = useParams() as { contestant_id: string };
  const inputRef = useRef<HTMLInputElement>(null);
  const [votes, setVotes] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [contestant, setContestant] = useState<Contestant | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, removeFromCart, isInCart, getTotalVotes } = useCart();

  const handleVoteChange = (increment: boolean) => {
    if (increment) {
      setVotes(votes + 5);
    } else if (votes > 0) {
      setVotes(votes - 5);
    }
  };

  const handlePayment = async () => {
    if (!contestant || !selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Prepare payment data
      const paymentData = {
        amount: votes * (contestant.seasonId.pricePerVote || 1),
        vote: votes,
        contestant_Id: contestant_id,
        description: `Vote for ${contestant.name} - ${votes} votes`,
        purpose: `Vote payment for contestant ${contestant.name}`
      };

      // Create payment session
      const paymentResponse = await createPayment(paymentData);
      
      // Store PRN for status checking
      sessionStorage.setItem('last_prn', paymentResponse.prn);
      
      // Close modal
      setShowModal(false);
      
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

  useEffect(() => {
    if (!contestant_id) return;
    
    const fetchContestant = async () => {
      setIsLoading(true);
      try {
        const response = await Axios.get(`/api/contestants/${contestant_id}`);
        const data = response.data;
        setContestant(data.data);
      } catch (error) {
        console.error('Error fetching contestant data:', error);
        toast.error('Failed to load contestant information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContestant();
  }, [contestant_id]);

  return (
    <main>
      {isLoading && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      <section className='w-full bg-background2 py-20'>
        <div className='max-w-7xl mx-auto px-6 grid mdplus:grid-cols-2 justify-between gap-20 mdplus:gap-12 lg:gap-28'>

          {/* Left side - Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8"
          >
            {/* Intro */}
            <div>
              <h2 className='font-newsreader text-3xl mdplus:text-6xl font-extralight mb-3 tracking-tighter'>
                {contestant?.name}
              </h2>
              <span className='text-base mdplus:text-xl'>
                Contestant ID : {contestant?.uniqueId}
              </span>
              <p className="text-lg mdplus:text-base mt-6">
                {contestant?.intro}
              </p>
            </div>

            {/* Vote the Model */}
            <div>
              <h4 className='flex gap-2 py-4 items-baseline font-newsreader text-2xl'>
                <Image src="/svg-icons/small_star.svg" alt='' width={40} height={0} className='object-cover w-4 h-4' />
                <span>Vote the Model</span>
              </h4>
              <div
                onClick={() => inputRef.current?.focus()}
                className="flex items-center bg-muted-background overflow-hidden mb-6 max-w-[85vw] mdplus:max-w-lg">
                <button onClick={() => handleVoteChange(false)} className="p-5 px-6 bg-[#4d4d4d] transition-colors cursor-pointer">
                  <i className="ri-subtract-line text-primary" />
                </button>
                <div className="flex-1 text-center py-4">
                  <div className="text-sm w-fit">
                    <input
                      ref={inputRef}
                      type="number"
                      value={votes}
                      onChange={(e) => setVotes(Number(e.target.value))}
                      className='text-right outline-none input-number-no-arrows ml-2'
                    />
                    {" "}votes
                  </div>
                </div>
                <button onClick={() => handleVoteChange(true)} className="p-5 px-6 bg-[#4d4d4d] transition-colors cursor-pointer">
                  <i className="ri-add-line text-primary" />
                </button>
              </div>
              <div className='flex justify-start gap-8 items-center flex-wrap'>
                <span className='text-xl font-semibold'>
                  Rs. {votes * (contestant?.seasonId?.pricePerVote ?? 0)}
                </span>
                <Button variant="default" className='px-4 mdplus:px-14 py-3' onClick={() => setShowModal(true)}>
                  Vote
                  <i className='ri-arrow-right-up-line' />
                </Button>
                <button
                  onClick={() => {
                    if (isInCart(contestant?.seasonId?._id || '', contestant_id)) {
                      // Remove from cart
                      removeFromCart(contestant?.seasonId?._id || '', contestant_id);
                      toast.success(`${contestant?.name} removed from cart!`);
                    } else {
                      // Add to cart
                      addToCart(
                        contestant?.seasonId?._id || '',
                        contestant_id,
                        votes
                      );
                      toast.success(`${contestant?.name} added to cart with ${votes} votes!`);
                    }
                  }}
                  className={`border-primary border-[2px] rounded-full w-10 h-10 cursor-pointer transition-colors ${isInCart(contestant?.seasonId?._id || '', contestant_id)
                    ? 'bg-primary text-black' : ''}`}
                >
                  <i className="ri-shopping-cart-2-line text-xl" />
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className='flex items-baseline gap-2 font-newsreader text-2xl mb-8 mt-20'>
                <Image src="/svg-icons/small_star.svg" height={20} width={20} alt="" className='w-4 h-4 object-cover' />
                <span>Available Payment Method{paymentMethods.length > 1 ? "s" : ""}</span>
              </h4>
              <div className='flex gap-6 items-center'>
                {paymentMethods.map(item => (
                  <Image
                    key={item?.name}
                    src={item?.icon}
                    alt={item?.name}
                    width={100}
                    height={100}
                    className='h-10 w-auto object-cover cursor-pointer'
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Section - Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative mx-auto max-w-[440px] max-h-[548px] lg:w-[440px] lg:h-[548px] overflow-visible"
          >
            <Image
              src={normalizeImagePath(contestant?.image)}
              alt={contestant?.name ?? ""}
              width={440}
              height={548}
              className="h-full w-full object-cover p-[1px]"
            />
            <div className="h-[115%] absolute right-0 -top-[7.5%] w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
            <div className="h-[115%] absolute left-0 -top-[7.5%] w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
            <div className="w-[115%] absolute top-0 -left-[7.5%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="w-[115%] absolute bottom-0 -right-[7.5%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
          </motion.div>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background p-8 border-stone-600 border w-9/10 mdplus:w-1/2 h-1/2 flex flex-col justify-between relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className='absolute -top-3 -right-3 bg-white rounded-full h-8 w-8 text-[#FF3636] flex justify-center items-center z-10 cursor-pointer'
              >
                <i className="ri-close-line text-lg" />
              </button>

              <div>
                <h2 className="text-lg text-primary font-semibold mb-4">Select your payment method</h2>
                <p className="mb-6">
                  Total price
                  <span className='ml-2 text-2xl text-primary font-newsreader'>Rs. {votes * (contestant?.seasonId?.pricePerVote ?? 0)}</span>
                </p>
                <div className="flex gap-6 items-center flex-wrap">
                  {paymentMethods.map(item => (
                    <div
                      key={item.name}
                      onClick={() => setSelectedMethod(item.id)}
                      className={`cursor-pointer w-[45%] border py-2 px-4 rounded-md transition-all ${
                        selectedMethod === item.id 
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
            </motion.div>
          </div>
        )}

      </section>

      {/* Cart Popup */}
      {contestant && getTotalVotes(contestant.seasonId._id) > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <VotingCartPopup seasonId={contestant.seasonId._id} pricePerVote={contestant.seasonId.pricePerVote} />
        </div>
      )}
    </main>

  );
};

export default ModelVoting;
