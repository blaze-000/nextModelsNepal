import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { AuthService, AuthServiceError } from "../../services/auth.service.js";
import { baseProcedure } from "../base.js";

const LoginInputSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

const LoginOutputSchema = z.object({
    success: z.literal(true),
    user: z.object({
        role: z.literal("admin"),
        email: z.email(),
    }),
});

const VerifyOutputSchema = z.object({
    user: z.object({
        role: z.literal("admin"),
        email: z.email(),
    }),
});

export const authRouter = {
    login: baseProcedure
        .input(LoginInputSchema)
        .output(LoginOutputSchema)
        .handler(async ({ context, input }) => {
            try {
                const result = await AuthService.authenticateAdmin(
                    input.email,
                    input.password,
                );
                AuthService.setAuthCookies(context.res, result);
                return {
                    success: true as const,
                    user: result.payload,
                };
            } catch (error) {
                if (error instanceof AuthServiceError) {
                    const code =
                        error.statusCode === 400
                            ? "BAD_REQUEST"
                            : error.statusCode === 401
                              ? "UNAUTHORIZED"
                              : "INTERNAL_SERVER_ERROR";

                    throw new ORPCError(code, {
                        message: error.message,
                        cause: error,
                    });
                }

                console.error("Auth login failed", error);
                throw new ORPCError("INTERNAL_SERVER_ERROR", {
                    message: "Failed to login",
                    cause: error instanceof Error ? error : undefined,
                });
            }
        }),

    verify: baseProcedure
        .output(VerifyOutputSchema)
        .handler(async ({ context }) => {
            // Context automatically extracts and verifies token from cookies
            if (!context.admin) {
                throw new ORPCError("UNAUTHORIZED", {
                    message: "Not authenticated",
                });
            }

            return {
                user: {
                    role: context.admin.role as "admin",
                    email: context.admin.email,
                },
            };
        }),
};

export type AuthRouter = typeof authRouter;
