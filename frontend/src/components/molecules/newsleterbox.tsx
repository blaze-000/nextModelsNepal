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
    <div className={`bg-gradient-to-r from-amber-900 via-amber-800 to-yellow-800 px-8 py-6 rounded-lg shadow-lg ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        {/* Newsletter Title */}
        <div className="flex-shrink-0">
          <span className="text-white text-lg font-medium">
            Subscribe to our{' '}
            <span className="text-yellow-300 font-semibold">NewsLetter</span>
          </span>
        </div>

        {/* Email Input */}
        <div className="flex-grow">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g johndoe@example.com"
            className="w-full px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 border-none outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-200"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <div className="flex-shrink-0">
          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center gap-2 shadow-lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                Submit
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
      </form>
    </div>
  );
};

export default NewsLetterBox;