"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";

import PageHeader from "@/components/admin/PageHeader";
import PhotoUpload from "@/components/admin/form/photo-upload";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import { Hero } from "@/types/admin";
import { Button } from "@/components/ui/button";

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
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<HeroFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/hero");
      const data = response.data;
      if (data.success && data.data?.length > 0) {
        const heroData = data.data[0];
        setHero(heroData);
        // Reset form data when loading new hero data
        setFormData({
          titleImage: [],
          images: [null, null, null, null],
          removedExistingIndices: new Set<number>(),
          removedTitleImage: false,
        });
      }
    } catch {
      toast.error("Failed to fetch hero data");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index: number, file: File | null) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      const newRemovedIndices = new Set(prev.removedExistingIndices);

      // Cleanup old URL if replacing a file
      if (newImages[index] instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(newImages[index] as File));
      }

      if (file === null) {
        // Removing image - mark for removal if it exists in database
        newImages[index] = null;
        const existingImageField = `image_${index + 1}` as keyof Hero;
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
        img && img.trim() !== "" && !formData.removedExistingIndices.has(idx)
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

    setSubmitting(true);

    // Build form data for submission
    const submitFormData = new FormData();

    // Add title image if uploaded
    if (formData.titleImage.length > 0) {
      submitFormData.append("titleImage", formData.titleImage[0]);
    }

    // Add images with specific field names (image_1, image_2, etc.)
    formData.images.forEach((image, index) => {
      if (image) {
        submitFormData.append(`image_${index + 1}`, image);
      }
    });

    // Add removal tracking data
    if (formData.removedExistingIndices.size > 0) {
      submitFormData.append(
        "removedExistingIndices",
        JSON.stringify(Array.from(formData.removedExistingIndices))
      );
    }

    if (formData.removedTitleImage) {
      submitFormData.append("removedTitleImage", "true");
    }

    try {
      const endpoint = hero ? `/api/hero/${hero._id}` : "/api/hero";
      const method = hero ? "patch" : "post";
      const response = await Axios[method](endpoint, submitFormData);

      if (response.data.success) {
        toast.success(
          `Hero section ${hero ? "updated" : "created"} successfully`
        );

        // Reset form and refetch data
        setFormData(initialFormData);
        setHero(response.data.data);
      } else {
        toast.error(`Failed to ${hero ? "update" : "create"} hero section`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(`Failed to ${hero ? "update" : "create"} hero section`);
    } finally {
      setSubmitting(false);
    }
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
      <PageHeader title="Home page - Hero"
      description="Manage the hero section content for your homepage." />
        <form onSubmit={handleSubmit} className="space-y-8 rounded-lg border border-gray-600 p-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Title Image */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-200 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
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
                className="[&_>div:nth-child(2)]:min-h-[160px] [&_img]:w-40 [&_img]:h-16 [&_img]:rounded-full [&_img]:border [&_img]:border-stone-300 [&_img]:shadow-lg [&_.relative]:mx-auto"
              />
            </div>

            {/* Right Column - Hero Images */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-200 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
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
                  const isRemoved = formData.removedExistingIndices.has(idx);
                  return isRemoved || !img?.trim() ? "" : normalizeImagePath(img);
                })}
                onImageChange={handleImageChange}
                error={errors.images}
                required={false}
                acceptedTypes={["image/*"]}
                maxFileSize={5}
                className="pt-10 [&_.grid]:grid-cols-4 [&_.grid]:gap-2 [&_.aspect-square]:h-28 [&_.aspect-square]:w-28"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
           
            <Button variant="default" disabled={submitting} className="px-8">
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
        <h3 className="text-lg font-semibold text-gray-100 mb-6 px-6 pt-6">
          Live Preview
        </h3>

        {/* Hero Section Preview */}
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
                <div className="self-stretch justify-center">
                  <span className="text-white text-2xl leading-loose tracking-wide">
                    We are{" "}
                  </span>
                  <span className="text-gold-500 text-2xl font-normal leading-loose tracking-wide">
                    Next Models Nepal
                  </span>
                </div>
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
                    <div className="w-40 h-16 relative">
                      {/* Title Image Preview */}
                      {formData.titleImage.length > 0 ||
                      (hero?.titleImage && !formData.removedTitleImage) ? (
                        <Image
                          src={
                            formData.titleImage.length > 0
                              ? URL.createObjectURL(formData.titleImage[0])
                              : normalizeImagePath(hero?.titleImage || "")
                          }
                          alt="Title image"
                          fill
                          className="rounded-full object-cover border border-stone-300 shadow-[-10px_8px_20px_10px_rgba(179,131,0,0.19)]"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full rounded-full border border-stone-300 bg-gray-700 flex items-center justify-center">
                          <i className="ri-image-line text-gray-500 text-sm"></i>
                        </div>
                      )}
                    </div>
                    <span className="text-white font-extralight font-newsreader tracking-tighter leading-px">
                      Modeling
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-extralight font-newsreader tracking-tighter italic pt-4 pr-2">
                      Agency
                    </span>
                    <div className="w-40 h-16 rounded-full border-2 border-gold-500" />
                  </div>
                </div>
                <p className="text-white text-base leading-relaxed font-light pt-6">
                  Next Models Nepal is a team of seasoned professionals
                  dedicated to talent management, elite training, and launching
                  aspiring models.
                </p>
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

              {/* Right side - Image Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full relative overflow-x-hidden overflow-y-hidden py-32 md:py-0"
              >
                <div className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 grid-rows-2 gap-6 w-[80%] max-w-[390px] aspect-square z-10 relative">
                  {[0, 1, 2, 3].map((index) => {
                    const newFile = formData.images[index];
                    const existingImages = [
                      hero?.image_1,
                      hero?.image_2,
                      hero?.image_3,
                      hero?.image_4,
                    ];
                    const existingImage = existingImages[index];
                    const isRemoved =
                      formData.removedExistingIndices.has(index);

                    // Determine image source: new file > existing (if not removed) > null
                    let imageSrc: string | null = null;
                    if (newFile) {
                      imageSrc = URL.createObjectURL(newFile);
                    } else if (existingImage?.trim() && !isRemoved) {
                      imageSrc = normalizeImagePath(existingImage);
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