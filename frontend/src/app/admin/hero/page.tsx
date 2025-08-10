"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";

import PageHeader from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/admin/AdminButton";
import PhotoUpload from "@/components/admin/form/photo-upload";

import { apiClient } from "@/lib/api";
import { Hero } from "@/types/admin";

interface CustomHeroFormData {
  images: (File | null)[];
}

const initialFormData: CustomHeroFormData = {
  images: [null, null, null, null],
};

const getImageUrl = (imagePath: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return `${baseUrl}/${imagePath}`;
};

export default function HeroAdminPage() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CustomHeroFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Hero>("/hero");
      if (response.success && response.data && response.data[0]) {
        const heroData = response.data[0];
        setHero(heroData);
        setFormData({
          images: [null, null, null, null],
        });
        // Images will be handled by PhotoUpload component preview
      }
    } catch (error) {
      toast.error("Failed to fetch hero data");
      console.error("Error fetching hero:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index: number, file: File | null) => {
    const newImages = [...formData.images];
    newImages[index] = file;
    setFormData((prev: CustomHeroFormData) => ({ ...prev, images: newImages }));

    if (errors[`image_${index}`]) {
      setErrors((prev) => ({ ...prev, [`image_${index}`]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Only validate images
    const hasImages =
      formData.images.some((img: File | null) => img !== null) ||
      (hero?.images?.length ?? 0) > 0;
    if (!hasImages) {
      for (let i = 0; i < 4; i++) {
        newErrors[`image_${i}`] = "At least one image is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    const submitFormData = new FormData();

    formData.images.forEach((image: File | null) => {
      if (image) {
        submitFormData.append("images", image);
      }
    });

    try {
      const response = hero
        ? await apiClient.update("/hero", hero._id, submitFormData)
        : await apiClient.create("/hero", submitFormData);

      if (response.success) {
        toast.success(
          `Hero section ${hero ? "updated" : "created"} successfully`
        );
        fetchHero();
      } else {
        toast.error(`Failed to ${hero ? "update" : "create"} hero section`);
      }
    } catch (error) {
      toast.error(`Failed to ${hero ? "update" : "create"} hero section`);
      console.error("Error submitting hero:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    if (hero) {
      setFormData({
        images: [null, null, null, null],
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading hero data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Home page - Hero Section" />

      {/* Image Upload Section */}
      <div className="bg-muted-background rounded-lg border border-gray-600 p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-6">
          Upload Hero Section Images
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PhotoUpload
            label="Hero Section Images"
            name="heroImages"
            mode="fixed"
            fixedSlots={4}
            selectedFiles={formData.images.filter(
              (img): img is File => img !== null
            )}
            existingImages={hero?.images.map((img) => getImageUrl(img)) || []}
            onImageChange={handleImageChange}
            error={Object.values(errors).find((err) => err) || ""}
            required={true}
            acceptedTypes={["image/*"]}
            maxFileSize={5}
          />

          <div className="flex gap-3 pt-4">
            <AdminButton type="submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : hero
                ? "Update Images"
                : "Upload Images"}
            </AdminButton>
            <AdminButton
              variant="ghost"
              onClick={resetForm}
              type="button"
              disabled={submitting}
            >
              Reset
            </AdminButton>
          </div>
        </form>
      </div>

      {/* Live Preview Section */}
      <div className="bg-muted-background rounded-lg border border-gray-600">
        <h3 className="text-lg font-semibold text-gray-100 mb-6 px-6 pt-6">
          Live Preview
        </h3>

        {/* Hero Section Preview - Exact Frontend Match */}
        <section className="bg-gradient-to-b from-background2 to-background rounded-b-lg w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-2 pt-8 lg:pt-20 lg:pb-[7.5rem] -mb-8 md:mb-0"
              >
                {/* We are Next Models Nepal */}
                <div className="self-stretch justify-center">
                  <span className="text-white text-2xl leading-loose tracking-wide">
                    We are{" "}
                  </span>
                  <span className="text-gold-500 text-2xl font-normal leading-loose tracking-wide">
                    Next Models Nepal
                  </span>
                </div>
                {/* Main Title with Badge */}
                <div className="space-y-2 text-6xl md:text-7xl lg:text-8xl">
                  <div>
                    <span className="text-white font-extralight font-newsreader tracking-tighter">
                      Nepal&rsquo;s{" "}
                    </span>
                    <span className="text-gold-500 font-extralight font-newsreader tracking-tighter">
                      No.1
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    {/* Badge image with soft layered shadow */}
                    <div className="w-40 h-16 relative">
                      <Image
                        src="/span-image.jpg"
                        alt=""
                        fill
                        className="rounded-full object-cover border border-stone-300 shadow-[-10px_8px_20px_10px_rgba(179,131,0,0.19)]"
                      />
                    </div>
                    {/* Label */}
                    <span className="text-white font-extralight font-newsreader tracking-tighter leading-px">
                      Modeling
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-extralight font-newsreader tracking-tighter italic pt-4 pr-2">
                      Agency
                    </span>
                    {/* Empty oval outline */}
                    <div className="w-40 h-16 rounded-full border-2 border-gold-500" />
                  </div>
                </div>
                {/* Description */}
                <p className="text-white text-base leading-relaxed font-light pt-6">
                  Next Models Nepal is a team of seasoned professionals
                  dedicated to
                  <br />
                  talent management, elite training, and launching aspiring
                  models.
                </p>
                {/* Buttons */}
                <div className="flex flex-col items-start gap-4 lg:flex-row lg:gap-10 lg:items-center pt-4">
                  <button className="px-9 py-4 bg-primary text-primary-foreground hover:bg-white font-bold rounded-full text-base tracking-[0.02em] overflow-hidden relative gap-1.5 group cursor-pointer inline-flex items-center justify-center transition-colors">
                    <span className="relative">
                      <span className="flex items-center transition-transform duration-400 group-hover:translate-x-[200%] gap-1.5">
                        Hire a model{" "}
                        <i className="group-hover:scale-1.2 ri-arrow-right-up-line" />
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-0 w-full h-full flex items-center justify-center transition-transform duration-400 translate-x-[-200%] group-hover:translate-x-0 pointer-events-none gap-1.5"
                      >
                        Hire a model{" "}
                        <i className="group-hover:scale-1.2 ri-arrow-right-up-line" />
                      </span>
                    </span>
                  </button>
                  <button className="px-4 py-4 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                    <span className="underline underline-offset-4">
                      Upcoming Events
                    </span>
                    <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
                  </button>
                </div>
              </motion.div>

              {/* Right side */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full relative overflow-x-hidden overflow-y-hidden py-32 md:py-0"
              >
                {/* 2x2 image grid */}
                <div className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 grid-rows-2 gap-6 w-[80%] max-w-[390px] aspect-square z-10 relative">
                  {/* Images 1-4 */}
                  {[0, 1, 2, 3].map((index) => {
                    const hasNewFile = formData.images[index];
                    const hasExistingImage = hero?.images[index];

                    let imageSrc: string | null = null;
                    if (hasNewFile) {
                      imageSrc = URL.createObjectURL(hasNewFile);
                    } else if (hasExistingImage) {
                      imageSrc = getImageUrl(hasExistingImage);
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
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-xl">
                            <i className="ri-image-line text-gray-500 text-lg md:text-xl"></i>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Background grid lines */}
                  <div className="absolute -left-[50%] -top-5 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                  <div className="absolute -left-[50%] top-1/2 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                  <div className="absolute -left-[50%] -bottom-5 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                  <div className="absolute -bottom-[50%] -left-5 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
                  <div className="absolute -bottom-[50%] left-1/2 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
                  <div className="absolute -bottom-[50%] -right-5 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
                </div>

                {/* Center decorative element */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <Image
                    src="/small_star.svg"
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
