"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/admin/AdminButton";
import DataTable from "@/components/admin/DataTable";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import ContestantPopup, {
  BackendContestant,
} from "./contestants/contestantsPopup";
import JuryPopup, { BackendJury } from "./jury/JuryPopup";
import WinnerPopup, { BackendWinner } from "./winners/WinnerPopup";

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
    // TODO: Implement season edit modal
    console.log("Edit season:", season);
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
          <AdminButton
            onClick={() => router.push(`/admin/events/${eventId}/seasons`)}
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Seasons
          </AdminButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${season.name} (${season.year})`}
        description={`${event.name} - Season Management`}
      >
        <div className="flex gap-3">
          <AdminButton
            variant="outline"
            onClick={() => router.push(`/admin/events/${eventId}/seasons`)}
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Seasons
          </AdminButton>
          <Button variant="default" onClick={handleEditSeason}>
            <i className="ri-edit-line mr-2"></i>
            Edit Season
          </Button>
        </div>
      </PageHeader>

      {/* Tab Navigation */}
      <div className="border-b border-gray-600">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? "border-gold-500 text-gold-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 bg-gray-700 text-gray-300 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
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
            {/* Season Cover Image */}
            {season.images && season.images.length > 0 && (
              <div className="relative h-64 bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={normalizeImagePath(season.images[0])}
                  alt={season.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      season.status === "completed"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : season.status === "ongoing"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {season.status.charAt(0).toUpperCase() +
                      season.status.slice(1)}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Season Details */}
              <div className="bg-muted-background rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">
                  Season Details
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-400 mb-1">
                      Description
                    </dt>
                    <dd className="text-sm text-gray-200">
                      {season.description}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-400 mb-1">
                      Start Date
                    </dt>
                    <dd className="text-sm text-gray-200">
                      {new Date(season.startDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-400 mb-1">
                      End Date
                    </dt>
                    <dd className="text-sm text-gray-200">
                      {new Date(season.endDate).toLocaleDateString()}
                    </dd>
                  </div>
                  {season.notes && (
                    <div>
                      <dt className="text-sm font-medium text-gray-400 mb-1">
                        Notes
                      </dt>
                      <dd className="text-sm text-gray-200">{season.notes}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Statistics */}
              <div className="bg-muted-background rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">
                  Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gold-400 mb-1">
                      {contestants.length}
                    </div>
                    <div className="text-sm text-gray-400">Contestants</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gold-400 mb-1">
                      {jury.length}
                    </div>
                    <div className="text-sm text-gray-400">Jury Members</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gold-400 mb-1">
                      {winners.length}
                    </div>
                    <div className="text-sm text-gray-400">Winners</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gold-400 mb-1">
                      {season.year}
                    </div>
                    <div className="text-sm text-gray-400">Year</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-4">
                  Created {new Date(season.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "contestants" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-muted-background rounded-lg border border-gray-600 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-100">
                  Contestants
                </h3>
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
            className="bg-muted-background rounded-lg border border-gray-600 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-100">
                  Jury Members
                </h3>
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
            className="bg-muted-background rounded-lg border border-gray-600 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-100">Winners</h3>
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
