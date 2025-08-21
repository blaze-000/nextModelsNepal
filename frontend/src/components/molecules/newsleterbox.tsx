'use client';
import { Spinner } from '@geist-ui/react';
import { Button } from '../ui/button';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { validateEmail } from '@/lib/utils';
import Axios from "@/lib/axios-instance";

// API Function
const subscribeToNewsletter = async (email: string) => {
  const response = await Axios.post("/api/newsletter", { email });
  return response.data;
};

interface NewsletterBoxProps {
  className?: string;
}

export default function NewsLetterBox() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Email is required.');
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await subscribeToNewsletter(trimmedEmail);
      if (response.success) {
        toast.success('Thank you for subscribing!');
        setEmail('');
      } else {
        toast.error(response.message || 'Something went wrong. Please try again.');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      if (errorMessage.includes("already subscribed")) {
        toast.success(errorMessage);
        setEmail('');
        return;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gold-900 lg:rounded-none rounded-3xl px-6 py-6 sm:px-16 py-10 shadow-lg w-full mx-auto"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Newsletter Title */}
        <div className="w-full lg:flex-shrink-0 lg:w-auto">
          <h2 className="text-white text-2xl sm:text-3xl lg:text-3xl font-newsreader font-normal text-center lg:text-left">
            Subscribe to our{' '}
            <span className="text-gold-500">NewsLetter</span>
          </h2>
        </div>

        {/* Responsive Input and Button Layout */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 flex-1 lg:max-w-2xl relative">
          <div className="flex-1 min-w-0 relative">
            <input
              value={email}
              autoComplete="email"
              onChange={handleInputChange}
              placeholder="e.g johndoe@example.com"
              className={`w-full px-5 sm:px-6 py-5 sm:py-4 pr-16 sm:pr-6 rounded-full bg-white text-gray-800 placeholder-gray-500 outline-none focus:ring-2 transition-all duration-200 text-base ${error ? 'focus:ring-red-500' : 'focus:ring-gold-400'}`}
              disabled={isSubmitting}
              aria-label="Email address"
              aria-invalid={!!error}
            />
            {/* Mobile Submit Button (absolute positioned) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute right-0 top-0 w-16 h-16 rounded-full bg-gold-500 hover:bg-gold-400 text-white flex items-center justify-center transition-colors duration-200 sm:hidden"
              aria-label={isSubmitting ? 'Submitting subscription' : 'Submit subscription'}
            >
              {isSubmitting ? (
                <Spinner scale={0.5} color="white" />
              ) : (
                <i className="ri-arrow-right-up-line text-lg" />
              )}
            </button>
          </div>

          {/* Desktop Submit Button */}
          <Button
            variant="default"
            type="submit"
            disabled={isSubmitting}
            className="hidden sm:flex items-center justify-center gap-2 w-full sm:w-auto sm:px-6 sm:py-4 min-w-[120px] group"
            aria-label={isSubmitting ? 'Submitting subscription' : 'Submit subscription'}
          >
            {isSubmitting ? (
              <>
                <Spinner scale={0.5} color="white" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit</span>
                <i className="ri-arrow-right-up-line transition-transform group-hover:scale-110" />
              </>
            )}
          </Button>

          {error && (
            <p className="text-red-400 text-sm mt-2 px-2 absolute top-full left-0" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};