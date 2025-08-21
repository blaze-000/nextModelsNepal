'use client';

import Axios from "@/lib/axios-instance";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from '@geist-ui/react';
import { Spinner as SPINNER } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import NotFound from "../not-found";
import { isAxiosError } from "axios";

export default function AdminInit() {
  const [loading, setLoading] = useState(true);
  const [superAdminExists, setSuperAdminExists] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        const res = await Axios.get('/api/auth/init');
        const data: boolean = res.data.message;
        setSuperAdminExists(data);
      } catch {
        toast.error("Try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <main className="h-screen grid place-content-center">
        <SPINNER color="var(--primary)" size={50} />
      </main>
    );
  }

  if (!superAdminExists) {
    return <SignUpForm />;
  }

  if (superAdminExists) {
    return <NotFound />;
  }
}

function SignUpForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setIsSubmitting(true);
      // await new Promise(resolve => setTimeout(resolve, 2000));
      await Axios.post("/api/auth/register", { email: email.trim(), password });
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      toast.success("Signup successful.");
      router.push('/admin/');
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const responseData = err.response?.data;
        if (responseData?.errors) {
          // Join all field errors into one string
          const fieldErrors = Object.values(responseData.errors)
            .flat()
            .join(", ");
          setError(fieldErrors || responseData.message || "Signup failed");
        } else {
          setError(responseData?.message || "Signup failed");
        }
      } else {
        setError("Signup failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="max-w-md mx-auto mt-10 space-y-4 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Sign Up as Super Admin</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2.5 top-2.5 align-middle cursor-pointer text-muted-foreground"
          onClick={() => setShowPassword(prev => !prev)}
        >
          {showPassword ? <i className="ri-eye-off-fill" /> : <i className="ri-eye-fill" />}
        </button>
      </div>

      <div className="relative">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2.5 top-2.5 align-middle cursor-pointer text-muted-foreground"
          onClick={() => setShowConfirm(prev => !prev)}
        >
          {showConfirm ? <i className="ri-eye-off-fill" /> : <i className="ri-eye-fill" />}
        </button>
      </div>

      <Button
        variant="default"
        type="submit"
        disabled={isSubmitting}
        className="flex"
      >
        {isSubmitting ?
          <div className="flex gap-2">
            <Spinner />
            Signing Up...
          </div>
          :
          "Sign Up"
        }
      </Button>

    </form>
  );
}