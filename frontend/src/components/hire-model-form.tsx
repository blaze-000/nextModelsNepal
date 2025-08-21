"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Spinner } from "@geist-ui/react";
import { motion } from "framer-motion";
import ModelDropdown from "./ui/modelDropdown";
import { validateEmail, validatePhone } from "@/lib/utils";
import Axios from "@/lib/axios-instance";

interface Model {
  _id: string;
  name: string;
  intro: string;
  address: string;
  gender: string;
  slug: string;
  coverImage: string;
  images: string[];
  index: number;
}

// Reusable Input Component
const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  error?: string;
}) => (
  <div className="w-full">
    <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
      {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      className="w-full bg-muted-background text-gray-100 px-6 md:px-6 py-4 md:py-6 outline-none rounded"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Reusable Textarea Component
const TextareaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  error?: string;
}) => (
  <div className="w-full">
    <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full h-32 md:h-40 bg-muted-background text-gray-100 px-6 md:px-6 py-4 outline-none resize-none rounded"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

interface HireModelFormProps {
  preSelectedModelId?: string | null;
  models: Model[];
}

const HireModelForm = ({ preSelectedModelId, models }: HireModelFormProps) => {
  const [formData, setFormData] = useState({
    selectedModelId: preSelectedModelId || "",
    selectedModelName: "",
    email: "",
    phone: "",
    date: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [isSending, setIsSending] = useState(false);



  // Update form data when models are loaded and there's a pre-selected model
  useEffect(() => {
    if (models.length > 0 && preSelectedModelId) {
      const selectedModel = models.find(model => model._id === preSelectedModelId);
      if (selectedModel) {
        setFormData(prev => ({
          ...prev,
          selectedModelId: preSelectedModelId,
          selectedModelName: selectedModel.name
        }));
      }
    }
  }, [models, preSelectedModelId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrors({});
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModelChange = (modelName: string) => {
    const selectedModel = models.find(model => model.name === modelName);
    setFormData((prev) => ({
      ...prev,
      selectedModelName: modelName,
      selectedModelId: selectedModel?._id || ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<typeof formData> = {};
    if (!formData.selectedModelId) newErrors.selectedModelName = "Model selection is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !validateEmail(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (formData.phone && !validatePhone(formData.phone))
      newErrors.phone = "Invalid phone number";
    if (!formData.date.trim()) newErrors.date = "Date is required";
    if (formData.date.trim()) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

      // Calculate 6 months from now
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 6);
      maxDate.setHours(23, 59, 59, 999); // Set to end of day

      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      } else if (selectedDate > maxDate) {
        newErrors.date = "Date cannot be more than 6 months in the future";
      }
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsSending(true);
    try {
      // Convert date to ISO string for backend compatibility
      let isoDate = "";
      if (formData.date) {
        // If already ISO, use as is; else convert
        isoDate = new Date(formData.date).toISOString();
      }
      const hireData = {
        email: formData.email,
        phone: formData.phone,
        date: isoDate,
        message: formData.message,
      };

      const response = await Axios.post(`/api/hire-model/${formData.selectedModelId}`, hireData);

      if (response.data.success) {
        toast.success("Hire request submitted successfully!");
        setFormData({
          selectedModelId: "",
          selectedModelName: "",
          email: "",
          phone: "",
          date: "",
          message: "",
        });
      } else {
        throw new Error(response.data.message || "Failed to submit request");
      }
    } catch (error: any) {
      console.error("Error submitting hire request:", error);
      toast.error(error.response?.data?.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Separate models by gender
  const femaleModels = models.filter(model => model.gender === 'Female');
  const maleModels = models.filter(model => model.gender === 'Male');

  // Transform models for dropdown component
  const transformModelsForDropdown = (modelList: Model[]) => {
    return modelList.map(model => ({
      name: model.name,
      location: model.address,
      image: model.coverImage || "/bro_1.png", // fallback image
      link: `/models/${model.slug}`,
    }));
  };



  return (
    <section className="w-full bg-background2 py-16 md:py-16 flex flex-col items-center text-white font-urbanist">
      <div className="max-w-7xl px-8 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 text-left"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-extralight font-newsreader tracking-tight text-center md:text-start mb-2">
              Work with your
            </h2>
            <h1 className="text-5xl md:text-6xl font-extralight text-gold-500 font-newsreader tracking-tighter text-center md:text-start">
              Perfect Fit
            </h1>
          </div>

          <p className="text-sm md:text-base leading-relaxed font-normal px-2 tracking-wider text-center md:text-end md:w-1/2">
            Ready to make it big in modeling? Our tailored training and industry
            expertise will propel you to the top. Your journey to becoming a top
            model begins here.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-12 space-y-6 md:space-y-8"
        >
          {/* Row 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            <ModelDropdown
              label="Model"
              value={formData.selectedModelName}
              onChange={handleModelChange}
              error={errors.selectedModelName}
              placeholder="Select a model"
              femaleModels={transformModelsForDropdown(femaleModels)}
              maleModels={transformModelsForDropdown(maleModels)}
            />
            <InputField
              label="Email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. johndoe@example.com"
              error={errors.email}
            />
          </motion.div>

          {/* Row 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            <InputField
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 9XXXXXXXXX"
              error={errors.phone}
            />
            <InputField
              label="When do you need this model?"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              placeholder=""
              error={errors.date}
            />
          </motion.div>

          {/* Row 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <TextareaField
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your project, requirements, and any specific details..."
              error={errors.message}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex gap-4 flex-col md:flex-row items-end justify-end sm:items-end mt-6"
          >
            <Button
              variant="default"
              type="submit"
              disabled={isSending}
              className="w-35 md:w-50 bg-gold-500 text-black font-semibold rounded-full"
            >
              {isSending ? (
                <>
                  <Spinner />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Request
                  <i className="group-hover:scale-1.2 ri-arrow-right-up-line ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
};

export default HireModelForm;
