"use client";

import { Button } from "@/components/ui/button";
import Axios from "@/lib/axios-instance";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { Spinner } from "@geist-ui/react";
import { isAxiosError } from "axios";
import useAuth from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const auth = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (auth?.user && !auth.loading) {
      router.push("/admin/dashboard");
    }
  }, [auth?.user, auth?.loading, router]);

  // Show loading while checking authentication
  if (auth?.loading) {
    return (
      <main className="min-h-screen w-screen fixed inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Spinner />
          <p className="text-sm text-gray-500">Checking authentication...</p>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // reset error on submit

    try {
      setIsSubmitting(true);

      await Axios.post("/api/auth/login", { email, password });

      // Check for the new session cookie and update auth state
      auth?.refreshAuth();

      setEmail("");
      setPassword("");
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const responseData = err.response?.data;
        if (responseData?.errors) {
          const fieldErrors = Object.values(responseData.errors)
            .flat()
            .join(", ");
          setError(fieldErrors || responseData.message || "Login failed");
        } else {
          setError(responseData?.message || "Login failed");
        }
      } else {
        setError("Login failed");
      }
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-screen fixed inset-0 flex items-center justify-center">
      <div className="max-w-md w-full rounded-2xl shadow-lg p-8 transform transition-all duration-300">
        <header className="mb-6 text-center px-6">
          <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="white"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-semibold font-newsreader">Welcome back,</h1>
          <p className="text-sm">Sign in to continue to your account</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setError(null);
                setEmail(e.target.value);
              }}
              required
              placeholder="johndoe@example.com"
              className="w-full px-4 py-3 rounded-lg border bg-muted-background border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setError(null);
                setPassword(e.target.value);
              }}
              required
              placeholder="⁕⁕⁕⁕⁕⁕⁕⁕"
              className={`w-full px-4 py-3 rounded-lg border bg-muted-background border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition pr-12 ${showPassword ? "" : "font-extrabold tracking-widest"
                }`}
            />

            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-9 inline-flex items-center justify-center h-8 w-8 rounded-md focus:outline-none cursor-pointer"
            >
              {showPassword ? <i className="ri-eye-off-line" /> : <i className="ri-eye-line" />}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm text-center" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <div className="flex justify-center items-center mt-10">
            <Button
              variant="default"
              type="submit"
              className="active:scale-95 mx-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ?
                <>
                  <Spinner /> Signing in...
                </>
                :
                "Sign in"
              }
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};
