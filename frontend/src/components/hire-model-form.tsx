"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Spinner } from "@geist-ui/react";
import { motion } from "framer-motion";
import ModelDropdown from "./ui/modelDropdown";

// Model data - can be moved to a separate data file later
const femaleModels = [
  {
    name: "Monika Adhikary",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    link: "https://nextmodelnepal.com/models/monika",
  },
  {
    name: "Pratista",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    link: "https://nextmodelnepal.com/models/pratista",
  },
  {
    name: "Aayushma Poudel",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
  },
  {
    name: "Kristina",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
  },
  {
    name: "Sarah Johnson",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
  },
  {
    name: "Emma Wilson",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
  },
];

const maleModels = [
  {
    name: "Monika Adhikary",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    link: "https://nextmodelnepal.com/models/monika",
  },
  {
    name: "Pratista",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    link: "https://nextmodelnepal.com/models/pratista",
  },
  {
    name: "Aayushma Poudel",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
  },
  {
    name: "Alex Thompson",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
  },
  {
    name: "David Martinez",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
  },
  {
    name: "James Wilson",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
  },
];

// Email validation regex
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

const HireModelForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    email: "",
    phone: "",
    date: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [isSending, setIsSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrors({});
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleModelChange = (modelName: string) => {
    setErrors({});
    setFormData((prev) => ({ ...prev, name: modelName }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<typeof formData> = {};
    if (!formData.name.trim()) newErrors.name = "Model selection is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !validateEmail(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.date.trim()) newErrors.date = "Date is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error();
      toast.success("Message sent!");
      setFormData({
        name: "",
        subject: "",
        email: "",
        phone: "",
        date: "",
        message: "",
      });
    } catch {
      toast.error("Failed to send. Try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="w-full py-16 md:py-16 flex flex-col items-center text-white font-urbanist">
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
              value={formData.name}
              onChange={handleModelChange}
              error={errors.name}
              placeholder="Select a model"
              femaleModels={femaleModels}
              maleModels={maleModels}
            />
            <InputField
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. I want model for our brand photoshoot"
              error={errors.subject}
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
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. johndoe@example.com"
              error={errors.email}
            />
            <InputField
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 9XXXXXXXXX"
              error={errors.phone}
            />
          </motion.div>

          {/* Row 3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            <InputField
              label="When do you need this model?"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              placeholder=""
              error={errors.date}
            />
            <div className="w-full"></div>{" "}
            {/* Empty space to balance the row */}
          </motion.div>

          {/* Row 4 */}
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
              placeholder="Enter your message"
              error={errors.message}
            />
          </motion.div>

          {/* Submit Button + Inquiries-Text_link */}
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
                  Submit
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
