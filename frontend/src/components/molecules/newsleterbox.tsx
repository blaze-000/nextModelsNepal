'use client';
import type React from 'react';
import { useState } from 'react';

interface NewsletterSubscriptionProps {
  onSubmit?: (email: string) => Promise<void> | void;
  className?: string;
}

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

    <div className={`bg-[#382806] px-6 py-4 sm:px-16 sm:py-10 shadow-lg w-full mx-auto ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Newsletter Title  */}
        <div className="flex-shrink-0">
          <span className="text-white text-xl sm:text-2xl lg:text-3xl font-newsreader font-normal tracking-tight">
            Subscribe to our{' '}
            <span className="text-amber-500 text-xl sm:text-2xl lg:text-3xl font-newsreader font-normal tracking-tight">NewsLetter</span>
          </span>
        </div>

        {/* Email Input Container - Takes remaining space */}
        <div className="flex flex-col sm:flex-row items-center gap-4 lg:ml-auto flex-1 lg:max-w-2xl">
          {/* Email Input - Now properly flexible */}
          <div className="w-full flex-1 min-w-0">
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g johndoe@example.com"
              className="w-full px-6 py-4 rounded-full bg-white text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200 text-base"
              required
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !email.trim()}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 disabled:hover:scale-100 flex items-center gap-2 shadow-lg whitespace-nowrap"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>

  );
};

export default NewsLetterBox;