"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import PageHeader from "@/components/admin/PageHeader";
import PhotoUpload from "@/components/admin/form/photo-upload";

import { Button } from "@/components/ui/button";
import { orpc } from "@/lib/orpc-client";
import { orpcQuery } from "@/lib/orpc-tanstack-query";
import { normalizeImagePath } from "@/lib/utils";

// ORPC-inferred types (automatic type inference from backend)
type HeroLandingData = Awaited<ReturnType<typeof orpc.hero.getLanding>>;
type HeroData = NonNullable<HeroLandingData['hero']>;

interface HeroFormData {
    titleImage: File[];
    images: (File | null)[];
    removedExistingIndices: Set<number>;
    removedTitleImage: boolean;
}

const initialFormData: HeroFormData = {
    titleImage: [],
    images: [null, null, null, null],
    removedExistingIndices: new Set<number>(),
    removedTitleImage: false,
};

export default function HeroAdminPage() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<HeroFormData>(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch hero data with ORPC + TanStack Query
    const { data: heroLandingData, isLoading } = useQuery(
        orpcQuery.hero.getLanding.queryOptions()
    );

    // Extract hero from landing data (ORPC returns { hero, upcoming, ongoing })
    const hero = heroLandingData?.hero ?? null;

    // Mutation for creating hero
    const createMutation = useMutation({
        mutationFn: async (input: {
            titleImage: File;
            image_1?: File;
            image_2?: File;
            image_3?: File;
            image_4?: File;
        }) => await orpc.hero.create(input),
        onSuccess: () => {
            toast.success("Hero section created successfully");
            // Reset form
            setFormData(initialFormData);
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['hero', 'getLanding'] });
        },
        onError: (error: unknown) => {
            console.error("Create error:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to create hero section";
            toast.error(errorMessage);
        },
    });

    // Mutation for updating hero
    const updateMutation = useMutation({
        mutationFn: async (input: {
            titleImage?: File;
            image_1?: File;
            image_2?: File;
            image_3?: File;
            image_4?: File;
            removedTitleImage?: boolean;
            removedExistingIndices?: number[];
        }) => await orpc.hero.update(input),
        onSuccess: () => {
            toast.success("Hero section updated successfully");
            // Reset form
            setFormData(initialFormData);
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['hero', 'getLanding'] });
        },
        onError: (error: unknown) => {
            console.error("Update error:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to update hero section";
            toast.error(errorMessage);
        },
    });

    const submitting = createMutation.isPending || updateMutation.isPending;

    const handleImageChange = (index: number, file: File | null) => {
        setFormData((prev) => {
            const newImages = [...prev.images];
            const newRemovedIndices = new Set(prev.removedExistingIndices);

            // Cleanup old URL if replacing a file
            if (newImages[index] instanceof File) {
                URL.revokeObjectURL(
                    URL.createObjectURL(newImages[index] as File),
                );
            }

            if (file === null) {
                // Removing image - mark for removal if it exists in database
                newImages[index] = null;
                const existingImageField = `image_${index + 1}` as keyof HeroData;
                const existingImage = hero?.[existingImageField] as string;
                if (existingImage?.trim()) {
                    newRemovedIndices.add(index);
                }
            } else {
                // Adding new image - unmark for removal
                newImages[index] = file;
                newRemovedIndices.delete(index);
            }

            return {
                ...prev,
                images: newImages,
                removedExistingIndices: newRemovedIndices,
            };
        });

        // Clear validation errors
        if (errors[`image_${index}`]) {
            setErrors((prev) => ({ ...prev, [`image_${index}`]: "" }));
        }
    };

    const handleTitleImageChange = (files: File[]) => {
        setFormData((prev) => ({
            ...prev,
            titleImage: files,
            removedTitleImage: files.length === 0 && !!hero?.titleImage,
        }));
        if (errors.titleImage) {
            setErrors((prev) => ({ ...prev, titleImage: "" }));
        }
    };

    const handleRemoveTitleImage = () => {
        setFormData((prev) => ({
            ...prev,
            titleImage: [],
            removedTitleImage: true,
        }));
        if (errors.titleImage) {
            setErrors((prev) => ({ ...prev, titleImage: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Check if titleImage exists (new file uploaded or existing not removed)
        const hasTitleImage =
            formData.titleImage.length > 0 ||
            (hero?.titleImage && !formData.removedTitleImage);
        if (!hasTitleImage) {
            newErrors.titleImage = "Title image is required";
        }

        // Check if at least one image exists (new files or existing not all removed)
        const hasNewImages = formData.images.some((img) => img !== null);
        const existingImages = [
            hero?.image_1,
            hero?.image_2,
            hero?.image_3,
            hero?.image_4,
        ];
        const hasExistingImages = existingImages.some(
            (img, idx) =>
                img &&
                img.trim() !== "" &&
                !formData.removedExistingIndices.has(idx),
        );

        if (!hasNewImages && !hasExistingImages) {
            newErrors.images = "At least one image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!validateForm()) return;

        // Build input object for ORPC (pass File objects directly)
        if (hero) {
            // Update existing hero
            const updateInput: {
                titleImage?: File;
                image_1?: File;
                image_2?: File;
                image_3?: File;
                image_4?: File;
                removedTitleImage?: boolean;
                removedExistingIndices?: number[];
            } = {};

            // Add title image if uploaded
            if (formData.titleImage.length > 0) {
                updateInput.titleImage = formData.titleImage[0];
            }

            // Add images
            formData.images.forEach((image, index) => {
                if (image) {
                    const key = `image_${index + 1}` as 'image_1' | 'image_2' | 'image_3' | 'image_4';
                    updateInput[key] = image;
                }
            });

            // Add removal tracking
            if (formData.removedTitleImage) {
                updateInput.removedTitleImage = true;
            }
            if (formData.removedExistingIndices.size > 0) {
                updateInput.removedExistingIndices = Array.from(formData.removedExistingIndices);
            }

            updateMutation.mutate(updateInput);
        } else {
            // Create new hero
            const createInput: {
                titleImage: File;
                image_1?: File;
                image_2?: File;
                image_3?: File;
                image_4?: File;
            } = {
                titleImage: formData.titleImage[0],
            };

            // Add images
            formData.images.forEach((image, index) => {
                if (image) {
                    const key = `image_${index + 1}` as 'image_1' | 'image_2' | 'image_3' | 'image_4';
                    createInput[key] = image;
                }
            });

            createMutation.mutate(createInput);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="border-gold-500 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
                    <p className="text-gray-400">Loading hero data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Home page - Hero"
                description="Manage the hero section content for your homepage."
            />
            <form
                onSubmit={handleSubmit}
                className="space-y-8 rounded-lg border border-gray-600 p-6"
            >
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Left Column - Title Image */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="flex items-center gap-2 text-lg font-medium text-gray-200">
                                <div className="bg-gold-500 h-2 w-2 rounded-full"></div>
                                Title Image
                            </h3>
                        </div>

                        <PhotoUpload
                            label=""
                            name="titleImage"
                            mode="single"
                            onImageChange={handleTitleImageChange}
                            error={errors.titleImage}
                            selectedFiles={formData.titleImage}
                            existingImages={
                                hero?.titleImage && !formData.removedTitleImage
                                    ? [normalizeImagePath(hero.titleImage)]
                                    : []
                            }
                            onRemoveExisting={handleRemoveTitleImage}
                            required={true}
                            acceptedTypes={["image/*"]}
                            maxFileSize={5}
                            className="[&_.relative]:mx-auto [&_>div:nth-child(2)]:min-h-[160px] [&_img]:h-16 [&_img]:w-40 [&_img]:rounded-full [&_img]:border [&_img]:border-stone-300 [&_img]:shadow-lg"
                        />
                    </div>

                    {/* Right Column - Hero Images */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="flex items-center gap-2 text-lg font-medium text-gray-200">
                                <div className="bg-gold-500 h-2 w-2 rounded-full"></div>
                                Hero Grid Images
                            </h3>
                        </div>

                        <PhotoUpload
                            label=""
                            name="heroImages"
                            mode="fixed"
                            fixedSlots={4}
                            selectedFiles={formData.images}
                            existingImages={[
                                hero?.image_1,
                                hero?.image_2,
                                hero?.image_3,
                                hero?.image_4,
                            ].map((img, idx) => {
                                const isRemoved =
                                    formData.removedExistingIndices.has(idx);
                                return isRemoved || !img?.trim()
                                    ? ""
                                    : normalizeImagePath(img);
                            })}
                            onImageChange={handleImageChange}
                            error={errors.images}
                            required={false}
                            acceptedTypes={["image/*"]}
                            maxFileSize={5}
                            className="pt-10 [&_.aspect-square]:h-28 [&_.aspect-square]:w-28 [&_.grid]:grid-cols-4 [&_.grid]:gap-2"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between border-t border-gray-700 pt-6">
                    <Button
                        variant="default"
                        disabled={submitting}
                        className="px-8"
                    >
                        {submitting
                            ? "Saving..."
                            : hero
                              ? "Update Hero Section"
                              : "Create Hero Section"}
                    </Button>
                </div>
            </form>

            {/* Live Preview Section */}
            <div className="bg-muted-background rounded-lg border border-gray-600">
                <h3 className="mb-6 px-6 pt-6 text-lg font-semibold text-gray-100">
                    Live Preview
                </h3>

                {/* Hero Section Preview */}
                <section className="from-background2 to-background w-full rounded-b-lg bg-gradient-to-b">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.5fr]">
                            {/* Left Content */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="-mb-8 space-y-2 pt-8 md:mb-0 lg:pt-20 lg:pb-[7.5rem]"
                            >
                                <div className="justify-center self-stretch">
                                    <span className="text-2xl leading-loose tracking-wide text-white">
                                        We are{" "}
                                    </span>
                                    <span className="text-gold-500 text-2xl leading-loose font-normal tracking-wide">
                                        Next Models Nepal
                                    </span>
                                </div>
                                <div className="space-y-2 text-6xl md:text-7xl lg:text-8xl">
                                    <div>
                                        <span className="font-newsreader font-extralight tracking-tighter text-white">
                                            Nepal&rsquo;s{" "}
                                        </span>
                                        <span className="text-gold-500 font-newsreader font-extralight tracking-tighter">
                                            No.1
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <div className="relative h-16 w-40">
                                            {/* Title Image Preview */}
                                            {formData.titleImage.length > 0 ||
                                            (hero?.titleImage &&
                                                !formData.removedTitleImage) ? (
                                                <Image
                                                    src={
                                                        formData.titleImage
                                                            .length > 0
                                                            ? URL.createObjectURL(
                                                                  formData
                                                                      .titleImage[0],
                                                              )
                                                            : normalizeImagePath(
                                                                  hero?.titleImage ||
                                                                      "",
                                                              )
                                                    }
                                                    alt="Title image"
                                                    fill
                                                    className="rounded-full border border-stone-300 object-cover shadow-[-10px_8px_20px_10px_rgba(179,131,0,0.19)]"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center rounded-full border border-stone-300 bg-gray-700">
                                                    <i className="ri-image-line text-sm text-gray-500"></i>
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-newsreader leading-px font-extralight tracking-tighter text-white">
                                            Modeling
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-newsreader pt-4 pr-2 font-extralight tracking-tighter text-white italic">
                                            Agency
                                        </span>
                                        <div className="border-gold-500 h-16 w-40 rounded-full border-2" />
                                    </div>
                                </div>
                                <p className="pt-6 text-base leading-relaxed font-light text-white">
                                    Next Models Nepal is a team of seasoned
                                    professionals dedicated to talent
                                    management, elite training, and launching
                                    aspiring models.
                                </p>
                                <div className="flex flex-col items-start gap-4 pt-4 lg:flex-row lg:items-center lg:gap-10">
                                    <button className="bg-primary text-primary-foreground group relative inline-flex cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-full px-9 py-4 text-base font-bold tracking-[0.02em] transition-colors hover:bg-white">
                                        <span className="relative">
                                            <span className="flex items-center gap-1.5 transition-transform duration-400 group-hover:translate-x-[200%]">
                                                Hire a model{" "}
                                                <i className="group-hover:scale-1.2 ri-arrow-right-up-line" />
                                            </span>
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute top-0 left-0 flex h-full w-full translate-x-[-200%] items-center justify-center gap-1.5 transition-transform duration-400 group-hover:translate-x-0"
                                            >
                                                Hire a model{" "}
                                                <i className="group-hover:scale-1.2 ri-arrow-right-up-line" />
                                            </span>
                                        </span>
                                    </button>
                                    <button className="text-gold-500 group flex cursor-pointer items-center gap-1 rounded-full px-4 py-4 text-base font-semibold -tracking-tight transition-colors hover:text-white">
                                        <span className="underline underline-offset-4">
                                            Upcoming Events
                                        </span>
                                        <i className="ri-arrow-right-up-line text-xl font-extralight transition-transform duration-400 group-hover:scale-130" />
                                    </button>
                                </div>
                            </motion.div>

                            {/* Right side - Image Grid */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="relative w-full overflow-x-hidden overflow-y-hidden py-32 md:py-0"
                            >
                                <div className="relative top-1/2 left-1/2 z-10 grid aspect-square w-[80%] max-w-[390px] -translate-x-1/2 -translate-y-1/2 grid-cols-2 grid-rows-2 gap-6">
                                    {[0, 1, 2, 3].map((index) => {
                                        const newFile = formData.images[index];
                                        const existingImages = [
                                            hero?.image_1,
                                            hero?.image_2,
                                            hero?.image_3,
                                            hero?.image_4,
                                        ];
                                        const existingImage =
                                            existingImages[index];
                                        const isRemoved =
                                            formData.removedExistingIndices.has(
                                                index,
                                            );

                                        // Determine image source: new file > existing (if not removed) > null
                                        let imageSrc: string | null = null;
                                        if (newFile) {
                                            imageSrc =
                                                URL.createObjectURL(newFile);
                                        } else if (
                                            existingImage?.trim() &&
                                            !isRemoved
                                        ) {
                                            imageSrc =
                                                normalizeImagePath(
                                                    existingImage,
                                                );
                                        }

                                        return (
                                            <div
                                                key={index}
                                                className="relative overflow-hidden rounded-xl"
                                            >
                                                {imageSrc ? (
                                                    <Image
                                                        src={imageSrc}
                                                        alt={`Preview ${index + 1}`}
                                                        fill
                                                        className="object-cover transition-transform duration-500 hover:scale-110"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-700">
                                                        <i className="ri-image-line text-lg text-gray-500 md:text-xl"></i>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Background grid lines */}
                                    <div className="absolute -top-5 -left-[50%] h-[1px] w-[200%] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                                    <div className="absolute top-1/2 -left-[50%] h-[1px] w-[200%] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                                    <div className="absolute -bottom-5 -left-[50%] h-[1px] w-[200%] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                                    <div className="absolute -bottom-[50%] -left-5 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
                                    <div className="absolute -bottom-[50%] left-1/2 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
                                    <div className="absolute -right-5 -bottom-[50%] h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
                                </div>

                                {/* Center decorative element */}
                                <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform">
                                    <Image
                                        src="/svg-icons/small_star.svg"
                                        alt=""
                                        width={25}
                                        height={25}
                                        priority
                                        className="h-14 w-14 object-cover"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
