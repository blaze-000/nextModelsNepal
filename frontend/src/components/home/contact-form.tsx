"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Spinner } from '@geist-ui/react'


// Email validation regex
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    email: "",
    phone: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<typeof formData> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !validateEmail(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
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
      setFormData({ name: "", subject: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Failed to send. Try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full py-16 flex flex-col items-center text-white font-urbanist">
      <div className="w-full max-w-7xl px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          <div>
            <h2 className="text-4xl md:text-5xl font-extralight font-newsreader tracking-tight">
              Send us a message
            </h2>
            <h1 className="text-5xl md:text-6xl font-extralight text-gold-500 font-newsreader tracking-tight">
              Let's Talk !!
            </h1>
          </div>
          <p className="text-base leading-relaxed md:w-1/2">
            Ready to make it big in modeling? Our tailored training and industry
            expertise will propel you to the top. Your journey to becoming a top
            model begins here.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block mb-2 text-base">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="e.g. John Doe"
                className="w-full bg-muted-background text-gray-100 px-6 py-6 outline-none"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-base">Subject</label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                type="text"
                placeholder="e.g. I want to be a model"
                className="w-full bg-muted-background text-gray-100 px-6 py-6 outline-none"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block mb-2 text-base">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="e.g. johndoe@example.com"
                className="w-full bg-muted-background text-gray-100 px-6 py-6 outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-base">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="e.g. XXXXXXXXXX"
                className="w-full bg-muted-background text-gray-100 px-6 py-6 outline-none"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block mb-2 text-base">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message"
              className="w-full h-40 bg-muted-background text-gray-100 px-6 py-4 outline-none resize-none"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isSending}
            className="w-50">
              {isSending ?
                (<>
                  <Spinner />
                  Submitting...
                </>
                ) :
                (<>
                  Submit
                  <i className="group-hover:scale-1.2 ri-arrow-right-up-line" />
                </>
                )
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
