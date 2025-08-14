"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@geist-ui/react";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import Link from "next/link";

interface Application {
  _id: string;
  name: string;
  phone: string;
  country: string;
  city: string;
  ethnicity: string;
  email: string;
  age: string;
  languages: string[];
  gender?: string;
  occupation: string;
  dressSize: string;
  shoeSize: string;
  hairColor: string;
  eyeColor: string;
  event?: string;
  auditionPlace?: string;
  weight: number;
  parentsName: string;
  parentsMobile: string;
  parentsOccupation?: string;
  permanentAddress: string;
  temporaryAddress: string;
  hobbies: string;
  talents?: string;
  heardFrom?: string;
  additionalMessage?: string;
  images: string[];
  createdAt: string;
}

const ApplicationDetail = () => {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const id = params.id as string;

  // Fetch application details
  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`/api/app-form/${id}`);
      setApplication(response.data.data);
    } catch (error: any) {
      console.error("Error fetching application:", error);
      toast.error("Failed to load application details");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  // Delete application
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      setDeleting(true);
      await Axios.delete(`/api/app-form/${id}`);
      toast.success("Application deleted successfully");
      router.push("/admin");
    } catch (error: any) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    } finally {
      setDeleting(false);
    }
  };

  // Load application on component mount
  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);
  console.log(application?.images)

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-foreground/50">Application not found</p>
          <Button
            onClick={() => router.push("/admin")}
            variant="outline"
            className="mt-4 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-primary-foreground"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Application Details</h1>
          <p className="text-foreground/70 mt-2">
            Submitted on {formatDate(application.createdAt)}
          </p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Link href="/admin/applications">
            <Button
              variant="outline"
              className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-primary-foreground"
            >
              <i className="ri-arrow-left-line mr-2" />
              Back to Applicants List
            </Button>
          </Link>

          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={deleting}
            className="bg-gold-600 hover:bg-gold-900 text-primary-foreground"
          >
            {deleting ? (
              <Spinner />
            ) : (
              <>
                <i className="ri-delete-bin-line mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Photos */}
        <div className="lg:col-span-1">
          <div className="bg-background2 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Photos</h2>
            <div className="grid grid-cols-2 gap-4">
              {application?.images.map((image, index) => (
                <div key={index} className=" overflow-hidden bg-muted-background">
                  <img
                    src={normalizeImagePath(image)}
                    alt={`Application photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2">
          <div className="bg-background2 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Application Information</h2>

            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gold-500 mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/50">Full Name</p>
                    <p className="text-foreground">{application.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">Email</p>
                    <p className="text-foreground">{application.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">Phone</p>
                    <p className="text-foreground">{application.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">Age</p>
                    <p className="text-foreground">{application.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">Gender</p>
                    <p className="text-foreground">{application.gender || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">Ethnicity</p>
                    <p className="text-foreground">{application.ethnicity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">Occupation</p>
                    <p className="text-foreground">{application.occupation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">Languages</p>
                    <p className="text-foreground">{application.languages.join(", ")}</p>
                  </div>
                </div>
              </div>

              {/* Physical Attributes */}
              <div>
                <h3 className="text-lg font-medium text-gold-500 mb-3">Physical Attributes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/50">Dress Size</p>
                    <p className="text-foreground">{application.dressSize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">Shoe Size</p>
                    <p className="text-foreground">{application.shoeSize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">Hair Color</p>
                    <p className="text-foreground">{application.hairColor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">Eye Color</p>
                    <p className="text-foreground">{application.eyeColor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">Weight</p>
                    <p className="text-foreground">{application.weight} kg</p>
                  </div>
                </div>
              </div>

              {/* Event Information */}
              <div>
                <h3 className="text-lg font-medium text-gold-500 mb-3">Event Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/50">Event</p>
                    <p className="text-foreground">{application.event || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">Audition Place</p>
                    <p className="text-foreground">{application.auditionPlace || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Parents Information */}
              <div>
                <h3 className="text-lg font-medium text-gold-500 mb-3">Parents Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/50">Parent's Name</p>
                    <p className="text-foreground">{application.parentsName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">Parent's Mobile</p>
                    <p className="text-foreground">{application.parentsMobile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">Parent's Occupation</p>
                    <p className="text-foreground">{application.parentsOccupation || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium text-gold-500 mb-3">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/50">Country</p>
                    <p className="text-foreground">{application.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/50">City</p>
                    <p className="text-foreground">{application.city}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-foreground/50">Permanent Address</p>
                    <p className="text-foreground">{application.permanentAddress}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-foreground/50">Temporary Address</p>
                    <p className="text-foreground">{application.temporaryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-medium text-gold-500 mb-3">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-foreground/50">Hobbies</p>
                    <p className="text-foreground">{application.hobbies}</p>
                  </div>
                  {application.talents && (
                    <div>
                      <p className="text-sm text-foreground/50">Talents</p>
                      <p className="text-foreground">{application.talents}</p>
                    </div>
                  )}
                  {application.heardFrom && (
                    <div>
                      <p className="text-sm text-foreground/50">How did you hear about us?</p>
                      <p className="text-foreground">{application.heardFrom}</p>
                    </div>
                  )}
                  {application.additionalMessage && (
                    <div>
                      <p className="text-sm text-foreground/50">Additional Message</p>
                      <p className="text-foreground">{application.additionalMessage}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;