'use client';
import type React from 'react';
import { useState } from 'react';

const NewsLetterBox: React.FC<NewsletterSubscriptionProps> = ({
  onSubmit,
  className = ""
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(email);
      } else {
        // Default behavior - you can replace this with your API call
        console.log('Newsletter subscription:', email);
        alert('Thank you for subscribing!');
      }
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl w-6xl h-[117px] bg-yellow-950 overflow-hidden relative">
      <div className="absolute left-[53px] top-[35px] w-[921px] flex justify-between items-center">
        <div className="text-center">
          <span className="text-white text-2xl font-normal font-newsreader tracking-tight">
            Subscribe to our{" "}
          </span>
          <span className="text-amber-500 text-2xl font-normal font-newsreader tracking-tight">
            NewsLetter
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. johndoe@example.com"
            className="pl-6 pr-48 py-3 text-zinc-500 text-base font-urbanist leading-loose tracking-tight rounded-full bg-white outline-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-40 h-10 bg-amber-500 rounded-full relative flex items-center justify-center gap-1.5"
          >
            <span className="text-yellow-950 text-base font-bold font-urbanist leading-loose tracking-tight">
              Submit
            </span>
            <span className="w-2 h-2 bg-black" />
          </button>
        </form>
      </div>
    </div>

  );
};

export default NewsLetterBox;