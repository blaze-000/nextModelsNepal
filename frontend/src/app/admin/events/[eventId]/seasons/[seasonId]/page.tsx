"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import ContestantPopup, {
  BackendContestant,
} from "./contestants/contestantsPopup";
import JuryPopup, { BackendJury } from "./jury/JuryPopup";
import WinnerPopup, { BackendWinner } from "./winners/WinnerPopup";
import SeasonPopup, { BackendSeason } from "../SeasonPopup";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Types
interface Event {
  _id: string;
  name: string;
  overview: string;
}

interface Season {
  _id: string;
  eventId: string;
  name: string;
  year: number;
  description: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "ongoing" | "completed";
  images: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields from BackendSeason
  image?: string;
  slug?: string;
  pricePerVote?: number;
  auditionFormDeadline?: string;
  votingOpened?: boolean;
  votingEndDate?: string;
  titleImage?: string;
  posterImage?: string;
  gallery?: string[];
  notice?: string[];
  timeline?: Array<{
    label: string;
    datespan: string;
    icon: string;
  }>;
}

type TabKey = "overview" | "contestants" | "jury" | "winners";

interface TabConfig {
  key: TabKey;
  label: string;
  count?: number;
}

export default function SeasonDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const seasonId = params.seasonId as string;
  const activeTab = (searchParams.get("tab") as TabKey) || "overview";

  // State
  const [event, setEvent] = useState<Event | null>(null);
  const [season, setSeason] = useState<Season | null>(null);
  const [contestants, setContestants] = useState<BackendContestant[]>([]);
  const [jury, setJury] = useState<BackendJury[]>([]);
  const [winners, setWinners] = useState<BackendWinner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "contestant" | "jury" | "winner" | null;
    id: string | null;
    name: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    name: "",
  });
  const [deleting, setDeleting] = useState(false);

  // Edit season modal state
  const [editSeasonModal, setEditSeasonModal] = useState(false);

  // Popup states
  const [contestantPopup, setContestantPopup] = useState<{
    isOpen: boolean;
    contestant: BackendContestant | null;
  }>({
    isOpen: false,
    contestant: null,
  });

  const [juryPopup, setJuryPopup] = useState<{
    isOpen: boolean;
    jury: BackendJury | null;
  }>({
    isOpen: false,
    jury: null,
  });

  const [winnerPopup, setWinnerPopup] = useState<{
    isOpen: boolean;
    winner: BackendWinner | null;
  }>({
    isOpen: false,
    winner: null,
  });

  // Tab configuration
  const tabs: TabConfig[] = [
    { key: "overview", label: "Overview" },
    { key: "contestants", label: "Contestants", count: contestants.length },
    { key: "jury", label: "Jury", count: jury.length },
    { key: "winners", label: "Winners", count: winners.length },
  ];

  // Fetch data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await Axios.get(`/api/events/${eventId}`);
        setEvent(res.data.data);
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch event");
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const res = await Axios.get(`/api/season/${seasonId}`);
        setSeason(res.data.data);
      } catch (err) {
        console.error("Failed to fetch season:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch season");
      }
    };

    fetchSeason();
  }, [seasonId]);

  useEffect(() => {
    const fetchContestants = async () => {
      try {
        const res = await Axios.get(`/api/contestants/season/${seasonId}`);
        setContestants(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch contestants:", err);
      }
    };

    fetchContestants();
  }, [seasonId]);

  useEffect(() => {
    const fetchJury = async () => {
      try {
        const res = await Axios.get(`/api/jury/season/${seasonId}`);
        setJury(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch jury:", err);
      }
    };

    fetchJury();
  }, [seasonId]);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await Axios.get(`/api/winners/season/${seasonId}`);
        setWinners(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch winners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, [seasonId]);

  // Handlers
  const handleTabChange = (tab: TabKey) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", tab);
    router.push(
      `/admin/events/${eventId}/seasons/${seasonId}?${newSearchParams.toString()}`
    );
  };

  const handleEditSeason = () => {
    setEditSeasonModal(true);
  };

  const handleAddContestant = () => {
    setContestantPopup({ isOpen: true, contestant: null });
  };

  const handleAddJury = () => {
    setJuryPopup({ isOpen: true, jury: null });
  };

  const handleAddWinner = () => {
    setWinnerPopup({ isOpen: true, winner: null });
  };

  const handleCloseContestantPopup = () => {
    setContestantPopup({ isOpen: false, contestant: null });
  };

  const handleCloseJuryPopup = () => {
    setJuryPopup({ isOpen: false, jury: null });
  };

  const handleCloseWinnerPopup = () => {
    setWinnerPopup({ isOpen: false, winner: null });
  };

  const handleContestantSuccess = () => {
    handleCloseContestantPopup();
    // Refresh contestants data
    const fetchContestants = async () => {
      try {
        const res = await Axios.get(`/api/contestants/season/${seasonId}`);
        setContestants(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch contestants:", err);
      }
    };
    fetchContestants();
  };

  const handleJurySuccess = () => {
    handleCloseJuryPopup();
    // Refresh jury data
    const fetchJury = async () => {
      try {
        const res = await Axios.get(`/api/jury/season/${seasonId}`);
        setJury(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch jury:", err);
      }
    };
    fetchJury();
  };

  const handleWinnerSuccess = () => {
    handleCloseWinnerPopup();
    // Refresh winners data
    const fetchWinners = async () => {
      try {
        const res = await Axios.get(`/api/winners/season/${seasonId}`);
        setWinners(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch winners:", err);
      }
    };
    fetchWinners();
  };

  const handleDelete = async () => {
    if (!deleteModal.id || !deleteModal.type) return;

    try {
      setDeleting(true);
      const endpoints = {
        contestant: `/api/contestants/${deleteModal.id}`,
        jury: `/api/jury/${deleteModal.id}`,
        winner: `/api/winners/${deleteModal.id}`,
      };

      const response = await Axios.delete(endpoints[deleteModal.type]);

      if (response.data.success) {
        toast.success(`${deleteModal.type} deleted successfully`);
        setDeleteModal({ isOpen: false, type: null, id: null, name: "" });

        // Refresh data based on type
        switch (deleteModal.type) {
          case "contestant":
            const contestantRes = await Axios.get(
              `/api/contestants/season/${seasonId}`
            );
            setContestants(contestantRes.data.data || []);
            break;
          case "jury":
            const juryRes = await Axios.get(`/api/jury/season/${seasonId}`);
            setJury(juryRes.data.data || []);
            break;
          case "winner":
            const winnerRes = await Axios.get(
              `/api/winners/season/${seasonId}`
            );
            setWinners(winnerRes.data.data || []);
            break;
        }
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(`Failed to delete ${deleteModal.type}`);
    } finally {
      setDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, type: null, id: null, name: "" });
  };

  const handleSeasonEditSuccess = async () => {
    try {
      // Refresh season data after successful edit
      const res = await Axios.get(`/api/season/${seasonId}`);
      setSeason(res.data.data);
      setEditSeasonModal(false);
    } catch (err) {
      console.error("Failed to refresh season:", err);
    }
  };

  // Table columns
  const contestantColumns = [
    {
      key: "image" as const,
      label: "Image",
      render: (value: unknown) => {
        const imagePath = String(value);
        return (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700">
            <Image
              src={normalizeImagePath(imagePath)}
              alt="Contestant"
              width={48}
              height={48}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        );
      },
    },
    {
      key: "name" as const,
      label: "Name",
      render: (value: unknown) => String(value),
    },
    {
      key: "gender" as const,
      label: "Gender",
      render: (value: unknown) => String(value),
    },
    {
      key: "address" as const,
      label: "Address",
      render: (value: unknown) => String(value),
    },
    {
      key: "intro" as const,
      label: "Introduction",
      render: (value: unknown) => {
        const intro = String(value);
        return intro.length > 50 ? intro.substring(0, 50) + "..." : intro;
      },
    },
  ];

  const juryColumns = [
    {
      key: "image" as const,
      label: "Image",
      render: (value: unknown) => {
        const imagePath = String(value);
        return (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700">
            <Image
              src={normalizeImagePath(imagePath)}
              alt="Jury Member"
              width={48}
              height={48}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        );
      },
    },
    {
      key: "name" as const,
      label: "Name",
      render: (value: unknown) => String(value),
    },
    {
      key: "designation" as const,
      label: "Designation",
      render: (value: unknown) => String(value || "N/A"),
    },
  ];

  const winnerColumns = [
    {
      key: "image" as const,
      label: "Image",
      render: (value: unknown) => {
        const imagePath = String(value);
        return (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700">
            <Image
              src={normalizeImagePath(imagePath)}
              alt="Winner"
              width={48}
              height={48}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        );
      },
    },
    {
      key: "rank" as const,
      label: "Rank",
      render: (value: unknown) => String(value),
    },
    {
      key: "name" as const,
      label: "Winner Name",
      render: (value: unknown) => String(value),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading season...</p>
        </div>
      </div>
    );
  }

  if (error || !event || !season) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-2xl text-red-400"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-200 mb-2">
            Season Not Found
          </h3>
          <p className="text-gray-400 mb-6">{error || "Season not found"}</p>
          <Button
            onClick={() => router.push(`/admin/events/${eventId}/seasons`)}
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Seasons
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${event.name} - ${season.year}`}
        description={`Season Details`}
      >
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/events/${eventId}/seasons`)}
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Seasons
          </Button>
          <Button variant="default" onClick={handleEditSeason}>
            <i className="ri-edit-line mr-2"></i>
            Edit Season
          </Button>
        </div>
      </PageHeader>

      {/* Season Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Hero Section with Cover Image */}
        {(() => {
          const heroImage =
            season.images && season.images.length > 0
              ? season.images[0]
              : season.titleImage
              ? season.titleImage
              : season.posterImage
              ? season.posterImage
              : season.image
              ? season.image
              : season.gallery && season.gallery.length > 0
              ? season.gallery[0]
              : null;

          return heroImage ? (
            <div className="relative h-80 lg:h-96 bg-gray-800 rounded-xl overflow-hidden">
              <Image
                src={normalizeImagePath(heroImage)}
                alt={`Season ${season.year}`}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Hero Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                <div className="space-y-4">
                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                        season.status === "completed"
                          ? "bg-green-500/20 text-green-300 border border-green-500/40"
                          : season.status === "ongoing"
                          ? "bg-gold-500/20 text-gold-300 border border-gold-500/40"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      }`}
                    >
                      <i
                        className={`mr-2 ${
                          season.status === "completed"
                            ? "ri-check-line"
                            : season.status === "ongoing"
                            ? "ri-play-line"
                            : "ri-time-line"
                        }`}
                      ></i>
                      {season.status.charAt(0).toUpperCase() +
                        season.status.slice(1)}
                    </span>
                    <span className="px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm bg-gray-500/20 text-gray-300 border border-gray-500/40">
                      <i className="ri-calendar-line mr-2"></i>
                      Season {season.year}
                    </span>
                  </div>

                  {/* Season Title */}
                  <div className="space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">
                      {event.name} {season.year}
                    </h1>
                    {season.description && (
                      <p className="text-lg lg:text-xl text-gray-200 max-w-2xl">
                        {season.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-64 bg-gradient-to-r from-gold-900/20 to-gold-800/20 rounded-xl border border-gold-900/20 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto">
                  <i className="ri-calendar-2-line text-2xl text-gold-500"></i>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white">
                    {event.name} {season.year}
                  </h1>
                  {season.description && (
                    <p className="text-lg text-gray-200 max-w-2xl">
                      {season.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      season.status === "completed"
                        ? "bg-green-500/20 text-green-300 border border-green-500/40"
                        : season.status === "ongoing"
                        ? "bg-gold-500/20 text-gold-300 border border-gold-500/40"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    }`}
                  >
                    <i
                      className={`mr-2 ${
                        season.status === "completed"
                          ? "ri-check-line"
                          : season.status === "ongoing"
                          ? "ri-play-line"
                          : "ri-time-line"
                      }`}
                    ></i>
                    {season.status.charAt(0).toUpperCase() +
                      season.status.slice(1)}
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-500/20 text-gray-300 border border-gray-500/40">
                    <i className="ri-calendar-line mr-2"></i>
                    Season {season.year}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-background2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Contestants
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {contestants.length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <i className="ri-user-3-line text-blue-600 dark:text-blue-400 text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-background2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Jury Members
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {jury.length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <i className="ri-judge-line text-indigo-600 dark:text-indigo-400 text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-background2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Winners
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {winners.length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-100 dark:bg-gold-900/30 rounded-lg flex items-center justify-center">
                <i className="ri-trophy-line text-gold-600 dark:text-gold-400 text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-background2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Duration
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {(() => {
                    const start = new Date(season.startDate);
                    const end = new Date(season.endDate);
                    const diffTime = Math.abs(end.getTime() - start.getTime());
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    return `${diffDays} days`;
                  })()}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-green-600 dark:text-green-400 text-lg sm:text-xl" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                activeTab === tab.key
                  ? "border-gold-500 text-gold-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === tab.key
                        ? "bg-gold-100 text-gold-800 dark:bg-gold-900/50 dark:text-gold-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Season Information */}
              <div className="bg-background2 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center mb-4">
                  <i className="ri-information-line mr-2 text-gold-500"></i>
                  Season Information
                </h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-foreground/60 mb-1">
                      Description
                    </dt>
                    <dd className="text-sm text-foreground">
                      {season.description || "No description available"}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-foreground/60 mb-1">
                        Start Date
                      </dt>
                      <dd className="text-sm text-foreground">
                        {new Date(season.startDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-foreground/60 mb-1">
                        End Date
                      </dt>
                      <dd className="text-sm text-foreground">
                        {new Date(season.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </dd>
                    </div>
                  </div>
                  {season.auditionFormDeadline && (
                    <div>
                      <dt className="text-sm font-medium text-foreground/60 mb-1">
                        Audition Deadline
                      </dt>
                      <dd className="text-sm text-foreground">
                        {new Date(
                          season.auditionFormDeadline
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </dd>
                    </div>
                  )}
                  {season.votingEndDate && (
                    <div>
                      <dt className="text-sm font-medium text-foreground/60 mb-1">
                        Voting End Date
                      </dt>
                      <dd className="text-sm text-foreground">
                        {new Date(season.votingEndDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </dd>
                    </div>
                  )}
                  {season.pricePerVote !== undefined &&
                    season.pricePerVote > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-foreground/60 mb-1">
                          Price Per Vote
                        </dt>
                        <dd className="text-sm text-foreground">
                          Rs. {season.pricePerVote}
                        </dd>
                      </div>
                    )}
                  {season.votingOpened !== undefined && (
                    <div>
                      <dt className="text-sm font-medium text-foreground/60 mb-1">
                        Voting Status
                      </dt>
                      <dd className="text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            season.votingOpened
                              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          <i
                            className={`mr-1.5 ${
                              season.votingOpened
                                ? "ri-play-circle-line"
                                : "ri-pause-circle-line"
                            }`}
                          ></i>
                          {season.votingOpened ? "Open" : "Closed"}
                        </span>
                      </dd>
                    </div>
                  )}
                  {season.notes && (
                    <div>
                      <dt className="text-sm font-medium text-foreground/60 mb-1">
                        Notes
                      </dt>
                      <dd className="text-sm text-foreground">
                        {season.notes}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Timeline or Additional Info */}
              <div className="space-y-6">
                {season.timeline && season.timeline.length > 0 && (
                  <div className="bg-background2 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-foreground flex items-center mb-4">
                      <i className="ri-time-line mr-2 text-gold-500"></i>
                      Timeline
                    </h3>
                    <div className="space-y-4">
                      {season.timeline.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i
                              className={`${
                                item.icon || "ri-calendar-line"
                              } text-gold-500 text-sm`}
                            ></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {item.label}
                            </p>
                            <p className="text-xs text-foreground/60">
                              {item.datespan}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {season.notice && season.notice.length > 0 && (
                  <div className="bg-background2 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-foreground flex items-center mb-4">
                      <i className="ri-notification-line mr-2 text-gold-500"></i>
                      Notices
                    </h3>
                    <div className="space-y-3">
                      {season.notice.map((notice, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-gold-500/10 rounded-lg border border-gold-500/20"
                        >
                          <div className="w-5 h-5 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <i className="ri-information-line text-gold-500 text-xs"></i>
                          </div>
                          <p className="text-sm text-foreground">{notice}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "contestants" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-background2 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <i className="ri-user-3-line mr-2 text-gold-500"></i>
                    Contestants
                  </h3>
                  <p className="text-sm text-foreground/60 mt-1">
                    Manage contestants for this season
                  </p>
                </div>
                <Button variant="default" onClick={handleAddContestant}>
                  <i className="ri-add-line mr-2"></i>
                  Add Contestant
                </Button>
              </div>
            </div>
            <DataTable
              data={contestants}
              columns={contestantColumns}
              onEdit={(contestant) =>
                setContestantPopup({ isOpen: true, contestant })
              }
              onDelete={(contestant) =>
                setDeleteModal({
                  isOpen: true,
                  type: "contestant",
                  id: contestant._id,
                  name: contestant.name,
                })
              }
            />
          </motion.div>
        )}

        {activeTab === "jury" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-background2 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <i className="ri-judge-line mr-2 text-gold-500"></i>
                    Jury Members
                  </h3>
                  <p className="text-sm text-foreground/60 mt-1">
                    Manage jury members for this season
                  </p>
                </div>
                <Button variant="default" onClick={handleAddJury}>
                  <i className="ri-add-line mr-2"></i>
                  Add Jury Member
                </Button>
              </div>
            </div>
            <DataTable
              data={jury}
              columns={juryColumns}
              onEdit={(juryMember) =>
                setJuryPopup({ isOpen: true, jury: juryMember })
              }
              onDelete={(juryMember) =>
                setDeleteModal({
                  isOpen: true,
                  type: "jury",
                  id: juryMember._id,
                  name: juryMember.name,
                })
              }
            />
          </motion.div>
        )}

        {activeTab === "winners" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-background2 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <i className="ri-trophy-line mr-2 text-gold-500"></i>
                    Winners
                  </h3>
                  <p className="text-sm text-foreground/60 mt-1">
                    Manage winners for this season
                  </p>
                </div>
                <Button variant="default" onClick={handleAddWinner}>
                  <i className="ri-add-line mr-2"></i>
                  Add Winner
                </Button>
              </div>
            </div>
            <DataTable
              data={winners}
              columns={winnerColumns}
              onEdit={(winner) => setWinnerPopup({ isOpen: true, winner })}
              onDelete={(winner) =>
                setDeleteModal({
                  isOpen: true,
                  type: "winner",
                  id: winner._id,
                  name: `Rank ${winner.rank}`,
                })
              }
            />
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title={`Delete ${deleteModal.type}`}
        message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
        isDeleting={deleting}
      />

      {/* Edit Season Modal */}
      <SeasonPopup
        isOpen={editSeasonModal}
        season={season as BackendSeason}
        eventId={eventId}
        eventName={event.name}
        onClose={() => setEditSeasonModal(false)}
        onSuccess={handleSeasonEditSuccess}
      />

      {/* Popup Modals */}
      <ContestantPopup
        isOpen={contestantPopup.isOpen}
        onClose={handleCloseContestantPopup}
        contestant={contestantPopup.contestant}
        seasonId={seasonId}
        onSuccess={handleContestantSuccess}
      />

      <JuryPopup
        isOpen={juryPopup.isOpen}
        onClose={handleCloseJuryPopup}
        jury={juryPopup.jury}
        seasonId={seasonId}
        onSuccess={handleJurySuccess}
      />

      <WinnerPopup
        isOpen={winnerPopup.isOpen}
        onClose={handleCloseWinnerPopup}
        winner={winnerPopup.winner}
        seasonId={seasonId}
        onSuccess={handleWinnerSuccess}
      />
    </div>
  );
}
