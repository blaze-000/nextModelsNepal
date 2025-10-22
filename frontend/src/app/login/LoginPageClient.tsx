"use client";

import { FormInputField } from "@/components/form/FormInputField";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { orpc } from "@/lib/orpc-client";
import { Spinner } from "@geist-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPageClient() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();
    const auth = useAuth();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
    } = useForm<LoginForm>({
        // @ts-expect-error - Zod 4.x type compatibility with @hookform/resolvers
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    // ORPC mutation for login
    const loginMutation = useMutation({
        mutationFn: async (data: LoginForm) => await orpc.auth.login(data),
        onSuccess: async () => {
            await auth?.refreshAuth();
            reset();
            router.push("/admin/dashboard");
        },
        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : "Login failed";
            setError("root", { message });
        },
    });

    const onSubmit = (data: LoginForm) => {
        loginMutation.mutate(data);
    };

    return (
        <main className="fixed inset-0 flex min-h-screen w-screen items-center justify-center">
            <div className="w-full max-w-md transform rounded-2xl p-8 shadow-lg transition-all duration-300">
                <header className="mb-6 px-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full">
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
                    <h1 className="font-newsreader mt-4 text-2xl font-semibold">
                        Welcome back,
                    </h1>
                    <p className="text-sm">
                        Sign in to continue to your account
                    </p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormInputField
                        label="Email"
                        name="email"
                        register={register}
                        error={errors.email}
                        type="email"
                        placeholder="johndoe@example.com"
                        className="bg-muted-background border-gray-200 px-4 py-3"
                    />

                    <div className="relative">
                        <FormInputField
                            label="Password"
                            name="password"
                            register={register}
                            error={errors.password}
                            type={showPassword ? "text" : "password"}
                            placeholder="⁕⁕⁕⁕⁕⁕⁕⁕"
                            className={
                                !showPassword
                                    ? "pr-12 font-extrabold tracking-widest"
                                    : "pr-12"
                            }
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute top-9 right-2 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md focus:outline-none"
                        >
                            {showPassword ? (
                                <i className="ri-eye-off-line" />
                            ) : (
                                <i className="ri-eye-line" />
                            )}
                        </button>
                    </div>

                    {errors.root?.message && (
                        <p
                            className="text-center text-sm text-red-500"
                            role="alert"
                            aria-live="assertive"
                        >
                            {errors.root.message}
                        </p>
                    )}

                    <div className="mt-10 flex items-center justify-center">
                        <Button
                            variant="default"
                            type="submit"
                            className="mx-auto active:scale-95"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <>
                                    <Spinner /> Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}
