'use client';
import { Spinner } from '@geist-ui/react';
import { Button } from '../ui/button';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

const NewsLetterBox: React.FC<NewsletterSubscriptionProps> = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // await onSubmit(email);
      toast.success('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-[#382806] px-6 py-4 sm:px-16 sm:py-10 shadow-lg w-full mx-auto}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        {/* Newsletter Title */}
        <div className="flex-shrink-0">
          <span className="text-white text-xl sm:text-2xl lg:text-3xl font-newsreader font-normal tracking-tight">
            Subscribe to our{' '}
            <span className="text-gold-500">NewsLetter</span>
          </span>
        </div>

        {/* Input and Submit */}
        <div className="flex flex-col sm:flex-row items-center gap-4 lg:ml-auto flex-1 lg:max-w-2xl">

          {/* Email Input */}
          <div className="w-full flex-1 min-w-0">
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="e.g johndoe@example.com"
              className={`w-full px-6 py-4 rounded-full bg-white text-gray-800 placeholder-gray-500 outline-none focus:ring-2 transition-all duration-200 text-base ${error ? 'focus:ring-red-500' : 'focus:ring-gold-400'
                }`}
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-50 flex items-center gap-2 justify-center"
            >
              {isSubmitting ? (
                <>
                  <Spinner scale={0.5} color="white" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit</span>
                  <i className="group-hover:scale-110 ri-arrow-right-up-line" />
                </>
              )}
            </Button>
          </div>

        </div>
      </div>
    </form>
  );
};

export default NewsLetterBox;
