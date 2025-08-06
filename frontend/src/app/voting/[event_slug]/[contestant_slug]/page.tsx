"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const contestant = {
  name: "Bishesh Khadgi",
  id: 12345678,
  intro: 'This bio is supposed to be a simple introduction to the following model: bishesh khadgi, Young 21 y/o lad fit and tall, now i hope the bio is enough.',
}
const PRICE_PER_VOTE = 100;

const PAYMENT_METHODS = [
  { name: "eSewa", icon: '/esewa.png' },
  { name: "Khalti", icon: '/khalti.png' }
];

const paymentLinks: Record<string, string> = {
  eSewa: "/payment/esewa",
  Khalti: "/payment/khalti",
};

const ModelVoting: React.FC = () => {
  const [votes, setVotes] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleVoteChange = (increment: boolean) => {
    if (increment) {
      setVotes(votes + 5);
    } else if (votes > 0) {
      setVotes(votes - 5);
    }
  };

  return (
    <main>
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
                Contestant ID: {contestant?.id}
              </span>
              <p className="text-lg mdplus:text-base mt-6">
                This bio is supposed to be a simple introduction to the following model: bishesh khadgi, Young 21 y/o lad fit and tall, now i hope the bio is enouh.
              </p>
            </div>

            {/* Vote the Model */}
            <div>
              <h4 className='flex gap-2 py-4 items-baseline font-newsreader text-2xl'>
                <Image src="/small_star.svg" alt='' width={40} height={0} className='object-cover w-4 h-4' />
                <span>Vote the Model</span>
              </h4>
              <div className="flex items-center bg-muted-background overflow-hidden mb-6 max-w-[85vw] mdplus:max-w-lg">
                <button onClick={() => handleVoteChange(false)} className="p-5 px-6 bg-[#4d4d4d] transition-colors cursor-pointer">
                  <i className="ri-subtract-line text-primary" />
                </button>
                <div className="flex-1 text-center py-4">
                  <span className="text-sm">{votes} votes</span>
                </div>
                <button onClick={() => handleVoteChange(true)} className="p-5 px-6 bg-[#4d4d4d] transition-colors cursor-pointer">
                  <i className="ri-add-line text-primary" />
                </button>
              </div>
              <div className='flex justify-start gap-8 items-center flex-wrap'>
                <span className='text-xl font-semibold'>Rs. {votes * PRICE_PER_VOTE}</span>
                <Button variant="default" className='px-4 mdplus:px-14 py-3' onClick={() => setShowModal(true)}>
                  Vote
                  <i className='ri-arrow-right-up-line' />
                </Button>
                <button className='border-primary border-[2px] rounded-full w-10 h-10 cursor-pointer'>
                  <i className="ri-shopping-cart-2-line text-primary text-xl" />
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className='flex items-baseline gap-2 font-newsreader text-2xl mb-8 mt-20'>
                <Image src="/small_star.svg" height={20} width={20} alt="" className='w-4 h-4 object-cover' />
                <span>Available Payment Methods</span>
              </h4>
              <div className='flex gap-6 items-center'>
                {PAYMENT_METHODS.map(item => (
                  <Image
                    key={item?.name}
                    src={item?.icon}
                    alt={item?.name}
                    width={100}
                    height={100}
                    className='h-10 w-auto object-cover'
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
              src="/bro_1.png"
              alt="Mr. Nepal 2025"
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
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowModal(false)}>
            <div className="bg-background p-8 border-stone-600 border w-9/10 mdplus:w-1/2 h-1/2 flex flex-col justify-between relative" onClick={(e) => e.stopPropagation()}>
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
                  <span className='ml-2 text-2xl text-primary font-newsreader'>Rs. {votes * PRICE_PER_VOTE}</span>
                </p>
                <div className="flex gap-6 items-center flex-wrap">
                  {PAYMENT_METHODS.map(item => (
                    <div
                      key={item.name}
                      onClick={() => setSelectedMethod(item.name)}
                      className={`cursor-pointer w-[45%] border py-2 px-4 rounded-md ${selectedMethod === item.name ? 'border-primary ring-1 ring-primary' : 'border-stone-600'}`}
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

              <Link href={selectedMethod ? paymentLinks[selectedMethod] : "#"} className="flex mt-4 pointer-events-auto"
                title={!selectedMethod ? "Select payment" : ""}
              >
                <Button variant="default" disabled={!selectedMethod}>
                  Continue
                  <i className='ri-arrow-right-up-line' />
                </Button>
              </Link>
            </div>
          </div>
        )}

      </section>
    </main>
  );
};

export default ModelVoting;
