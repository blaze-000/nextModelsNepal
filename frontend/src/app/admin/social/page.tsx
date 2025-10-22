"use client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { FormInputField } from "@/components/form/FormInputField";
import { orpc } from "@/lib/orpc-client";
import { orpcQuery } from "@/lib/orpc-tanstack-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
    useFieldArray,
    useForm,
    type Path,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/**
 * Form Validation Schema
 *
 * Matches backend ORPC validation with additional client-side rules
 */
const socialFormSchema = z
    .object({
        instagram: z.string(),
        x: z.string(),
        fb: z.string(),
        linkdln: z.string(),
        phone: z
            .array(z.string())
            .min(1, "At least one phone number is required"),
        mail: z.email("Must be a valid email"),
        location: z.string().min(1, "Location is required"),
    })
    .refine((data) => data.instagram || data.x || data.fb || data.linkdln, {
        message: "At least one social media link is required",
        path: ["instagram"],
    });

type SocialFormData = z.infer<typeof socialFormSchema>;

// Uses shared <FormInputField /> for all inputs

export default function SocialAdminPage() {
    const queryClient = useQueryClient();

    // Fetch social settings with TanStack Query
    const { data: social, isLoading } = useQuery(
        orpcQuery.social.get.queryOptions(),
    );

    // Initialize react-hook-form with Zod validation
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<SocialFormData>({
        // @ts-expect-error - Zod 4.x type compatibility issue with @hookform/resolvers
        resolver: zodResolver(socialFormSchema),
        defaultValues: {
            instagram: "https://www.instagram.com/",
            x: "https://x.com/",
            fb: "https://www.facebook.com/",
            linkdln: "https://www.linkedin.com/",
            phone: [],
            mail: "",
            location: "",
        },
    });

    // Dynamic phone array management
    const { fields, append, remove } = useFieldArray({
        control,
        // @ts-expect-error - react-hook-form array field type inference issue
        name: "phone",
    });

    // Update form when social data is loaded
    useEffect(() => {
        if (social) {
            reset({
                instagram: social.instagram || "https://www.instagram.com/",
                x: social.x || "https://x.com/",
                fb: social.fb || "https://www.facebook.com/",
                linkdln: social.linkdln || "https://www.linkedin.com/",
                phone:
                    social.phone && social.phone.length > 0 ? social.phone : [],
                mail: social.mail || "",
                location: social.location || "",
            });
        }
    }, [social, reset]);

    // Create or update mutation
    const createOrUpdateMutation = useMutation({
        mutationFn: async (input: SocialFormData) => {
            // Clean up phone numbers before submission
            const cleanedInput = {
                ...input,
                phone: input.phone.filter(Boolean).map((p) => p.trim()),
            };
            return await orpc.social.createOrUpdate(cleanedInput);
        },
        onSuccess: () => {
            toast.success("Social settings saved successfully");
            queryClient.invalidateQueries({ queryKey: ["social", "get"] });
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to save social settings";
            toast.error(errorMessage);
        },
    });

    // Form submission handler
    const onSubmit = (data: SocialFormData) => {
        createOrUpdateMutation.mutate(data);
    };

    return (
        <div className="mx-auto max-w-3xl space-y-6 p-6">
            <PageHeader
                title="Social Settings"
                description="Manage social links and contact info for the site footer."
            />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-muted-background space-y-4 rounded border border-gray-700 p-6"
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormInputField
                        label="Instagram URL"
                        name="instagram"
                        register={register}
                        error={errors.instagram}
                        placeholder="https://www.instagram.com/"
                    />
                    <FormInputField
                        label="X (Twitter) URL"
                        name="x"
                        register={register}
                        error={errors.x}
                        placeholder="https://x.com/"
                    />
                    <FormInputField
                        label="Facebook URL"
                        name="fb"
                        register={register}
                        error={errors.fb}
                        placeholder="https://www.facebook.com/"
                    />
                    <FormInputField
                        label="LinkedIn URL"
                        name="linkdln"
                        register={register}
                        error={errors.linkdln}
                        placeholder="https://www.linkedin.com/"
                    />
                    <div className="flex flex-col md:col-span-2">
                        <span className="text-foreground/70 text-sm">
                            Phone Numbers
                        </span>
                        <div className="mt-1 space-y-2">
                            {fields.map((field, index) => {
                                const phoneFieldName = `phone.${index}` as Path<SocialFormData>;
                                return (
                                    <div key={field.id} className="flex gap-2">
                                        <FormInputField
                                            label={`Phone number ${index + 1}`}
                                            name={phoneFieldName}
                                            register={register}
                                            type="tel"
                                            inputMode="numeric"
                                            placeholder="Enter phone number"
                                            containerClassName="flex-1"
                                            labelHidden
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => remove(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                );
                            })}
                            {errors.phone && (
                                <p className="text-sm text-red-500">
                                    {errors.phone.message}
                                </p>
                            )}
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => append("")}
                                className="mt-2"
                            >
                                + Add Phone
                            </Button>
                        </div>
                    </div>
                    <FormInputField
                        label="Email"
                        name="mail"
                        register={register}
                        error={errors.mail}
                        type="email"
                        placeholder="hello@nextmodelsnepal.com"
                    />
                    <FormInputField
                        label="Location"
                        name="location"
                        register={register}
                        error={errors.location}
                        containerClassName="md:col-span-2"
                        placeholder="Kathmandu, Nepal"
                    />
                </div>

                <div className="flex items-center justify-end">
                    <Button
                        type="submit"
                        disabled={
                            isSubmitting ||
                            isLoading ||
                            createOrUpdateMutation.isPending
                        }
                    >
                        {isSubmitting || createOrUpdateMutation.isPending
                            ? "Saving..."
                            : "Save"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
