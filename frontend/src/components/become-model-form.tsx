"use client";
import { useState, useEffect } from "react";
import type React from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Spinner } from "@geist-ui/react";
import { Spinner as SPINNER } from '@/components/ui/spinner'
import { motion } from "framer-motion";
import PhotoUpload from "./ui/photo-upload";
import { validateEmail, formatDate, normalizeImagePath, validatePhone } from "@/lib/utils";
import Axios from "@/lib/axios-instance";
import Image from "next/image";

// Types for upcoming events data
interface Audition {
  _id: string;
  place: string;
  date: string;
}

interface Criteria {
  _id: string;
  label: string;
  value: string;
  icon: string;
}

interface UpcomingEvent {
  _id: string;
  eventId: {
    _id: string;
    name: string;
  };
  year: number;
  criteria: Criteria[];
  auditions: Audition[];
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
  required = true,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  error?: string;
  required?: boolean;
}) => (
  <div className="w-full">
    <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      onWheel={(e) => e.currentTarget.blur()}
      className="w-full bg-muted-background text-gray-100 px-6 md:px-6 py-4 md:py-6 outline-none rounded"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Reusable Select Component
const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
  required = true,
  disabled = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}) => (
  <div className="w-full">
    <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full bg-muted-background text-gray-100 px-6 md:px-6 py-4 md:py-6 outline-none rounded disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="" disabled>
        {placeholder || "Select an option"}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
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
  required = true,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
}) => (
  <div className="w-full">
    <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
      {label} {required && <span className="text-red-500">*</span>}
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

const BecomeModelForm = ({ prefillSeasonId }: { prefillSeasonId?: string | null }) => {
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    phone: "",
    country: "",
    city: "",
    ethnicity: "",
    email: "",
    age: "",
    languages: "",
    gender: "",
    occupation: "",
    // Physical Attributes
    dressSize: "",
    shoeSize: "",
    hairColor: "",
    eyeColor: "",
    // Event Information
    event: "", // Store formatted event string (name + year)
    auditionPlace: "", // Store formatted audition string (place + date)
    // Additional Information
    weight: "",
    parentsName: "",
    parentsMobile: "",
    parentsOccupation: "",
    permanentAddress: "",
    temporaryAddress: "",
    hobbies: "",
    talents: "",
    heardFrom: "",
    additionalMessage: "",
  });

  // State for upcoming events data
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);

  const [errors, setErrors] = useState<
    Partial<typeof formData & { photos: string }>
  >({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);

  // Fetch upcoming events on component mount
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        const response = await Axios.get("/api/app-form/upcoming-info");
        if (response.data.success) {
          setUpcomingEvents(response.data.data);
        } else {
          // toast.error("Failed to load upcoming events");
        }
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
        // toast.error("Failed to load upcoming events");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  // Update event field when prefillSeasonId changes
  useEffect(() => {
    if (prefillSeasonId && upcomingEvents.length > 0) {
      // Find the matching season in the upcoming events list by season ID
      const matchingSeason = upcomingEvents.find(season =>
        season._id === prefillSeasonId
      );

      if (matchingSeason) {
        // Set the form data with the event name and year
        const eventString = `${matchingSeason.eventId.name} ${matchingSeason.year}`;
        setFormData(prev => ({
          ...prev,
          event: eventString
        }));

        // Set the selected event
        setSelectedEvent(matchingSeason);
      }
    }
  }, [prefillSeasonId, upcomingEvents]);

  // Generate event options from API data
  const eventOptions = upcomingEvents.map(event => ({
    value: `${event.eventId.name} ${event.year}`,
    label: `${event.eventId.name} ${event.year}`
  }));

  // Generate audition place options based on selected event
  const auditionPlaceOptions = selectedEvent?.auditions.map(audition => ({
    value: audition._id,
    label: `${audition.place} - ${formatDate(audition.date)}`
  })) || [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setErrors({});
    setGeneralError(null);
    const { name, value } = e.target;

    // Handle event selection
    if (name === "event") {
      const selectedEventData = upcomingEvents.find(event => `${event.eventId.name} ${event.year}` === value);
      setSelectedEvent(selectedEventData || null);
      // Reset audition place when event changes
      setFormData(prev => ({
        ...prev,
        event: value,
        auditionPlace: ""
      }));
    } else if (name === "auditionPlace") {
      // Handle audition place selection - set formatted string
      const audition = selectedEvent?.auditions.find(aud => aud._id === value);
      const auditionString = audition ? `${audition.place} - ${formatDate(audition.date)}` : "";
      setFormData(prev => ({ ...prev, auditionPlace: auditionString }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter valid files (max 5MB each, only images)
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    // Limit to maximum 10 photos total
    const remainingSlots = 10 - selectedPhotos.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);
    setSelectedPhotos((prev) => [...prev, ...filesToAdd]);
    setErrors((prev) => ({ ...prev, photos: undefined }));
  };

  const handleRemovePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<typeof formData & { photos: string }> = {};

    // Photo validation - at least 1 photo required
    if (selectedPhotos.length === 0) {
      newErrors.photos = "At least 1 photo is required";
    }

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!validateEmail(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!validatePhone(formData.phone))
      newErrors.phone = "Invalid phone number";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.ethnicity.trim())
      newErrors.ethnicity = "Ethnicity is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.languages.trim())
      newErrors.languages = "At least one language is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.occupation.trim())
      newErrors.occupation = "Occupation is required";
    if (!formData.dressSize.trim())
      newErrors.dressSize = "Dress size is required";
    if (!formData.shoeSize) newErrors.shoeSize = "Shoe size is required";
    if (!formData.hairColor.trim())
      newErrors.hairColor = "Hair color is required";
    if (!formData.eyeColor.trim()) newErrors.eyeColor = "Eye color is required";
    if (!formData.weight.trim()) newErrors.weight = "Weight is required";
    if (!formData.parentsName.trim())
      newErrors.parentsName = "Parent's name is required";
    if (!formData.parentsMobile.trim())
      newErrors.parentsMobile = "Parent's mobile is required";
    if (!validatePhone(formData.parentsMobile))
      newErrors.parentsMobile = "Invalid phone number";
    if (!formData.permanentAddress.trim())
      newErrors.permanentAddress = "Permanent address is required";
    if (!formData.temporaryAddress.trim())
      newErrors.temporaryAddress = "Temporary address is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors as any);
      setGeneralError("Validate your inputs!!");
      return;
    }

    setIsSending(true);
    try {
      // Create FormData to handle file uploads
      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'languages') {
          // Convert languages string to array and send as JSON string
          const languagesArray = value.split(',').map((lang: string) => lang.trim()).filter((lang: string) => lang);
          console.log('Languages input:', value);
          console.log('Languages array:', languagesArray);
          formDataToSend.append('languages', JSON.stringify(languagesArray));
        } else {
          formDataToSend.append(key, value as string);
        }
      });

      // Add photos with correct field name
      selectedPhotos.forEach((photo) => {
        formDataToSend.append("images", photo);
      });

      // Make API call
      await Axios.post("/api/app-form", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Application submitted successfully!");

      // Reset form
      setFormData({
        name: "",
        phone: "",
        country: "",
        city: "",
        ethnicity: "",
        email: "",
        age: "",
        languages: "",
        gender: "",
        occupation: "",
        dressSize: "",
        shoeSize: "",
        hairColor: "",
        eyeColor: "",
        event: "",
        auditionPlace: "",
        weight: "",
        parentsName: "",
        parentsMobile: "",
        parentsOccupation: "",
        permanentAddress: "",
        temporaryAddress: "",
        hobbies: "",
        talents: "",
        heardFrom: "",
        additionalMessage: "",
      });

      setSelectedEvent(null);

      setSelectedPhotos([]);
      setErrors({}); // Reset errors
    } catch (error: any) {
      console.error("Submission error:", error);

      // Extract error message from the response
      let errorMessage = "Failed to submit. Try again later.";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && error.response.data.error) {
          // Handle ZodError or other structured errors
          if (typeof error.response.data.error === "string") {
            errorMessage = error.response.data.error;
          } else if (error.response.data.error.message) {
            errorMessage = error.response.data.error.message;
          } else if (
            error.response.data.error.errors &&
            error.response.data.error.errors.length > 0
          ) {
            // Handle ZodError structure
            const firstError = error.response.data.error.errors[0];
            errorMessage = firstError.message || "Invalid form data";
          }
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || "Failed to submit. Try again later.";
      }

      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const shoeSizeOptions = Array.from({ length: 20 }, (_, i) => ({
    value: (i + 35).toString(),
    label: (i + 35).toString(),
  }));

  return (
    <section className="w-full py-16 md:py-16 flex flex-col items-center text-white font-urbanist">
      <div className="max-w-7xl px-6 mx-auto">
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
              Lets Get You On
            </h2>
            <h1 className="text-5xl md:text-6xl font-extralight text-gold-500 font-newsreader tracking-tighter text-center md:text-start">
              The Spotlight!
            </h1>
          </div>
          <p className="text-sm md:text-base leading-relaxed font-normal px-2 tracking-wider text-center md:text-end md:w-1/2">
            Ready to make it big in modeling? Our tailored training and industry expertise will propel you to the top. Your journey to becoming a top model begins here.
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
          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <PhotoUpload
              label="Upload Your Photos"
              name="photos"
              onChange={handlePhotoChange}
              error={errors.photos}
              selectedFiles={selectedPhotos}
              onRemoveFile={handleRemovePhoto}
              maxFiles={10}
              maxFileSize={5}
              acceptedTypes={["image/*"]}
            />
          </motion.div>

          {/* Row 1: Name, Phone */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            <InputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              error={errors.name}
            />
            <InputField
              label="Mobile Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +977 XXXXXXXXXX"
              error={errors.phone}
            />
          </motion.div>

          {/* Row 2: Country, City */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            <InputField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g. Nepal"
              error={errors.country}
            />
            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Kathmandu"
              error={errors.city}
            />
          </motion.div>

          {/* Row 3: Email, Languages */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            <InputField
              label="Email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. johndoe@example.com"
              error={errors.email}
            />
            <InputField
              label="Languages"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              placeholder="e.g. Nepali, English, Hindi"
              error={errors.languages}
            />
          </motion.div>

          {/* Row 4: Age, Ethnicity, Gender, Occupation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            <InputField
              type="number"
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Select your age"
              error={errors.age}
            />
            <InputField
              label="Ethnicity"
              name="ethnicity"
              value={formData.ethnicity}
              onChange={handleChange}
              placeholder="e.g. Caucasian"
              error={errors.ethnicity}
            />
            <SelectField
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={genderOptions}
              placeholder="Select gender"
              error={errors.gender}
            />
            <InputField
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="e.g. Student"
              error={errors.occupation}
            />
          </motion.div>

          {/* Row 6: Dress Size, Shoe Size, Hair Color, Eye Color */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            <InputField
              label="Dress Size"
              name="dressSize"
              value={formData.dressSize}
              onChange={handleChange}
              placeholder="e.g. M"
              error={errors.dressSize}
            />
            <SelectField
              label="Shoe Size"
              name="shoeSize"
              value={formData.shoeSize}
              onChange={handleChange}
              options={shoeSizeOptions}
              placeholder="Select size"
              error={errors.shoeSize}
            />
            <InputField
              label="Hair Color"
              name="hairColor"
              value={formData.hairColor}
              onChange={handleChange}
              placeholder="e.g. Brown"
              error={errors.hairColor}
            />
            <InputField
              label="Eye Color"
              name="eyeColor"
              value={formData.eyeColor}
              onChange={handleChange}
              placeholder="e.g. Blue"
              error={errors.eyeColor}
            />
          </motion.div>

          {/* Row 8: Select Event, Audition Place */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            {loading ? (
              <div className="w-full flex justify-center items-center py-8">
                <SPINNER color="#ffaa00" size={19} />
                <span className="ml-2">Loading events...</span>
              </div>
            ) : (
              <>
                <SelectField
                  label="Select Event (optional)"
                  name="event"
                  value={formData.event}
                  onChange={handleChange}
                  options={eventOptions}
                  placeholder="Select an upcoming event"
                  required={false}
                />
                <SelectField
                  label="Audition Place (optional)"
                  name="auditionPlace"
                  value={formData.auditionPlace}
                  onChange={handleChange}
                  options={auditionPlaceOptions}
                  placeholder={selectedEvent ? "Select audition place" : "Select an event first"}
                  required={false}
                  disabled={!selectedEvent}
                />
              </>
            )}
          </motion.div>

          {/* Event Criteria Display */}
          {selectedEvent && selectedEvent.criteria.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-muted-background p-6 rounded-lg border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gold-500 mb-4">
                Event Criteria for {selectedEvent.eventId.name} {selectedEvent.year}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedEvent.criteria.map((criterion) => (
                  <div key={criterion._id} className="flex items-center gap-3 p-3 bg-background">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Image
                        src={normalizeImagePath(criterion.icon)}
                        alt={criterion.label}
                        height={50}
                        width={50}
                        className="w-5 h-5 object-contain"
                      />
                      <i className="ri-check-line text-black text-sm hidden"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{criterion.label}</p>
                      <p className="text-xs text-gray-400">{criterion.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Row 9: Weight in KG's, Parent's Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            <InputField
              label="Weight in KG's"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g. XX"
              error={errors.weight}
            />
            <InputField
              label="Parent's Name"
              name="parentsName"
              value={formData.parentsName}
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
              error={errors.parentsName}
            />
          </motion.div>

          {/* Row 10: Parent's Mobile, Parent's Occupation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            <InputField
              label="Parent's Mobile"
              name="parentsMobile"
              type="tel"
              value={formData.parentsMobile}
              onChange={handleChange}
              placeholder="e.g. 9XXXXXXXXX"
              error={errors.parentsMobile}
            />
            <InputField
              label="Parent's Occupation"
              name="parentsOccupation"
              value={formData.parentsOccupation}
              onChange={handleChange}
              placeholder="e.g. XXXXXXXXXXXXX"
              required={false} // Not required
            />
          </motion.div>

          {/* Row 11: Permanent Address, Temporary Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            <InputField
              label="Permanent Address"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              placeholder="e.g. House23, Apartment roads, Greenland, Kathmandu"
              error={errors.permanentAddress}
            />
            <InputField
              label="Temporary Address"
              name="temporaryAddress"
              value={formData.temporaryAddress}
              onChange={handleChange}
              placeholder="Enter your temporary address"
              error={errors.temporaryAddress}
            />
          </motion.div>

          {/* Row 13: Your Hobbies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <TextareaField
              label="Your Hobbies"
              name="hobbies"
              value={formData.hobbies}
              onChange={handleChange}
              placeholder="Tell us about your hobbies"
              required={false} // Not required
            />
          </motion.div>

          {/* Row 14: Your Talents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <TextareaField
              label="Your Talents"
              name="talents"
              value={formData.talents}
              onChange={handleChange}
              placeholder="Tell us about your talents"
              required={false} // Not required
            />
          </motion.div>

          {/* Row 15: How did you hear about us? */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <TextareaField
              label="How did you hear about us/the event?"
              name="heardFrom"
              value={formData.heardFrom}
              onChange={handleChange}
              placeholder="Enter your message"
              required={false} // Not required
            />
          </motion.div>

          {/* Row 16: Additional Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <TextareaField
              label="Want to say something else?"
              name="additionalMessage"
              value={formData.additionalMessage}
              onChange={handleChange}
              placeholder="Enter your message"
              required={false} // Not required
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex gap-4 flex-col items-end justify-end sm:items-end mt-6"
          >
            {generalError && <p className="text-red-500 mr-6 text-sm mt-1">{generalError}</p>}
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

export default BecomeModelForm;
