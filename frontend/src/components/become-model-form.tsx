"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Spinner } from "@geist-ui/react";
import { motion } from "framer-motion";
import PhotoUpload from "./ui/photo-upload";
import { validateEmail } from "@/lib/utils";


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
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}) => (
  <div className="w-full">
    <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-muted-background text-gray-100 px-6 md:px-6 py-4 md:py-6 outline-none rounded"
    >
      <option value="">{placeholder || "Select an option"}</option>
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

const BecomeModelForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    phone: "",
    country: "",
    city: "",
    ethnicity: "",
    email: "",
    age: "",
    language: "",
    gender: "",
    occupation: "",

    // Physical Attributes
    dressSize: "",
    shoeSize: "",
    hairColor: "",
    eyeColor: "",

    // Event Information
    event: "",
    auditionLocation: "",

    // Additional Information
    weight: "",
    parentsName: "",
    parentsMobile: "",
    parentsOccupation: "",
    permanentAddress: "",
    temporaryAddress: "",
    hobbies: "",
    talents: "",
    howDoYouKnow: "",
    somethingElse: "",
  });

  const [errors, setErrors] = useState<
    Partial<typeof formData & { photos: string }>
  >({});
  const [isSending, setIsSending] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setErrors({});
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    if (formData.email && !validateEmail(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.ethnicity.trim())
      newErrors.ethnicity = "Ethnicity is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.language) newErrors.language = "Language is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.occupation.trim())
      newErrors.occupation = "Occupation is required";
    if (!formData.dressSize.trim())
      newErrors.dressSize = "Dress size is required";
    if (!formData.shoeSize) newErrors.shoeSize = "Shoe size is required";
    if (!formData.hairColor.trim())
      newErrors.hairColor = "Hair color is required";
    if (!formData.eyeColor.trim()) newErrors.eyeColor = "Eye color is required";
    if (!formData.event) newErrors.event = "Event selection is required";
    if (!formData.auditionLocation)
      newErrors.auditionLocation = "Audition location is required";
    if (!formData.weight.trim()) newErrors.weight = "Weight is required";
    if (!formData.parentsName.trim())
      newErrors.parentsName = "Parent's name is required";
    if (!formData.parentsMobile.trim())
      newErrors.parentsMobile = "Parent's mobile is required";
    if (!formData.permanentAddress.trim())
      newErrors.permanentAddress = "Permanent address is required";
    if (!formData.temporaryAddress.trim())
      newErrors.temporaryAddress = "Temporary address is required";

    // Note: The following fields are NOT required as per the requirement:
    // - parentsOccupation
    // - hobbies
    // - talents
    // - howDoYouKnow
    // - somethingElse

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsSending(true);
    try {
      // Create FormData to handle file uploads
      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Add photos
      selectedPhotos.forEach((photo, index) => {
        formDataToSend.append(`photo_${index}`, photo);
      });

      const res = await fetch("/api/contact", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error();
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
        language: "",
        gender: "",
        occupation: "",
        dressSize: "",
        shoeSize: "",
        hairColor: "",
        eyeColor: "",
        event: "",
        auditionLocation: "",
        weight: "",
        parentsName: "",
        parentsMobile: "",
        parentsOccupation: "",
        permanentAddress: "",
        temporaryAddress: "",
        hobbies: "",
        talents: "",
        howDoYouKnow: "",
        somethingElse: "",
      });
      setSelectedPhotos([]);
    } catch {
      toast.error("Failed to submit. Try again later.");
    } finally {
      setIsSending(false);
    }
  };

  // Dropdown options
  const ageOptions = Array.from({ length: 50 }, (_, i) => ({
    value: (i + 18).toString(),
    label: (i + 18).toString(),
  }));

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "mandarin", label: "Mandarin" },
    { value: "japanese", label: "Japanese" },
    { value: "other", label: "Other" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "non-binary", label: "Non-binary" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

  const shoeSizeOptions = Array.from({ length: 20 }, (_, i) => ({
    value: (i + 35).toString(),
    label: (i + 35).toString(),
  }));

  const activityOptions = [
    { value: "fashion-show", label: "Fashion Show" },
    { value: "photoshoot", label: "Photoshoot" },
    { value: "commercial", label: "Commercial" },
    { value: "runway", label: "Runway" },
    { value: "print", label: "Print" },
    { value: "tv-film", label: "TV/Film" },
  ];

  const locationOptions = [
    { value: "new-york", label: "New York" },
    { value: "los-angeles", label: "Los Angeles" },
    { value: "london", label: "London" },
    { value: "paris", label: "Paris" },
    { value: "milan", label: "Milan" },
    { value: "tokyo", label: "Tokyo" },
    { value: "online", label: "Online" },
  ];

  return (
    <section className="w-full py-16 md:py-16 flex flex-col items-center text-white font-urbanist">
      <div className="max-w-7xl px-6 mx-auto">
        {/* Header - Original title and subtitle kept unchanged */}
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

          {/* Row 3: Ethnicity, Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            <InputField
              label="Ethnicity"
              name="ethnicity"
              value={formData.ethnicity}
              onChange={handleChange}
              placeholder="e.g. Caucasian"
              error={errors.ethnicity}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. johndoe@example.com"
              error={errors.email}
            />
          </motion.div>

          {/* Row 4: Age, Language, Gender, Occupation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            <SelectField
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              options={ageOptions}
              placeholder="Select your age"
              error={errors.age}
            />
            <SelectField
              label="Language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              options={languageOptions}
              placeholder="Select language"
              error={errors.language}
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

          {/* Row 8: Select Event, Audition Location */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6"
          >
            <SelectField
              label="Select Event (only if you are applying for an event)"
              name="event"
              value={formData.event}
              onChange={handleChange}
              options={activityOptions}
              placeholder="Select an event"
              error={errors.event}
            />
            <SelectField
              label="Where do you want to give your audition?"
              name="auditionLocation"
              value={formData.auditionLocation}
              onChange={handleChange}
              options={locationOptions}
              placeholder="Select location"
              error={errors.auditionLocation}
            />
          </motion.div>

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

          {/* Row 15: How Do You Know About Us/The Event */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <TextareaField
              label="How did you know about us/the Event?"
              name="howDoYouKnow"
              value={formData.howDoYouKnow}
              onChange={handleChange}
              placeholder="Enter your message"
              required={false} // Not required
            />
          </motion.div>

          {/* Row 16: Want to say something else? */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <TextareaField
              label="Want to say something else?"
              name="somethingElse"
              value={formData.somethingElse}
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

export default BecomeModelForm;
