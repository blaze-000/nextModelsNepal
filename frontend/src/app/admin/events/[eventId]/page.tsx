"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/admin/AdminButton";
import DataTable from "@/components/admin/DataTable";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import EventPopup, { BackendEvent } from "../EventPopup";
import Axios from "@/lib/axios-instance";

// Types
interface Event {
  _id: string;
  name: string;
  overview: string;
  titleImage: string;
  coverImage: string;
  subtitle: string;
  quote: string;
  purpose: string;
  purposeImage: string;
  timelineSubtitle: string;
  managedBy: "self" | "partner";
  seasons?: unknown[];
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

interface Contestant {
  _id: string;
  seasonId: string;
  name: string;
  age: number;
  bio: string;
  hometown: string;
  profession: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  season?: {
    _id: string;
    name: string;
    year: number;
  };
}

interface Winner {
  _id: string;
  eventId: string;
  contestantId: string;
  position: number;
  prize: string;
  year: number;
  createdAt: string;
  updatedAt: string;
  contestant?: {
    _id: string;
    name: string;
    images: string[];
  };
  event?: {
    _id: string;
    name: string;
  };
}

interface Jury {
  _id: string;
  eventId: string;
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  event?: {
    _id: string;
    name: string;
  };
}

type TabKey = "overview" | "seasons" | "winners" | "contestants" | "jury";

interface TabConfig {
  key: TabKey;
  label: string;
  count?: number;
}

export default function EventDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const activeTab = (searchParams.get("tab") as TabKey) || "overview";

  // State
  const [event, setEvent] = useState<Event | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [jury, setJury] = useState<Jury[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [editEventModal, setEditEventModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "season" | "winner" | "contestant" | "jury" | null;
    id: string | null;
    name: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    name: "",
  });

  // Tab configuration
  const tabs: TabConfig[] = [
    { key: "overview", label: "Overview" },
    { key: "seasons", label: "Seasons", count: seasons.length },
    { key: "winners", label: "Winners", count: winners.length },
    { key: "contestants", label: "Contestants", count: contestants.length },
    { key: "jury", label: "Jury", count: jury.length },
  ];

  // API functions and data loading
  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get(`/api/events/${eventId}`);
        setEvent(res.data.data);
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch event");
      }
    })();
  }, [eventId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get(`/api/season/event/${eventId}`);
        setSeasons(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch seasons:", err);
      }
    })();
  }, [eventId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get(`/api/winners?eventId=${eventId}`);
        setWinners(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch winners:", err);
      }
    })();
  }, [eventId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get(`/api/contestants?eventId=${eventId}`);
        setContestants(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch contestants:", err);
      }
    })();
  }, [eventId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get(`/api/jury?eventId=${eventId}`);
        setJury(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch jury:", err);
      }
    })();
  }, [eventId]);

  // Loading state
  useEffect(() => {
    setLoading(false);
  }, [event, seasons, winners, contestants, jury]);

  // Tab navigation
  const handleTabChange = (tab: TabKey) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", tab);
    router.push(`/admin/events/${eventId}?${newSearchParams.toString()}`);
  };

  // Delete handlers
  const handleDelete = async () => {
    if (!deleteModal.id || !deleteModal.type) return;

    try {
      const endpoints = {
        season: `/api/season/${deleteModal.id}`,
        winner: `/api/winners/${deleteModal.id}`,
        contestant: `/api/contestants/${deleteModal.id}`,
        jury: `/api/jury/${deleteModal.id}`,
      };

      await Axios.delete(endpoints[deleteModal.type]);

      // Refresh data based on type
      switch (deleteModal.type) {
        case "season":
          const seasonRes = await Axios.get(`/api/season/event/${eventId}`);
          setSeasons(seasonRes.data.data || []);
          break;
        case "winner":
          const winnerRes = await Axios.get(`/api/winners?eventId=${eventId}`);
          setWinners(winnerRes.data.data || []);
          break;
        case "contestant":
          const contestantRes = await Axios.get(
            `/api/contestants?eventId=${eventId}`
          );
          setContestants(contestantRes.data.data || []);
          break;
        case "jury":
          const juryRes = await Axios.get(`/api/jury?eventId=${eventId}`);
          setJury(juryRes.data.data || []);
          break;
      }

      setDeleteModal({ isOpen: false, type: null, id: null, name: "" });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const openDeleteModal = (
    type: "season" | "winner" | "contestant" | "jury",
    id: string,
    name: string
  ) => {
    setDeleteModal({ isOpen: true, type, id, name });
  };

  // Table columns
  const seasonColumns = [
    {
      key: "name" as const,
      label: "Name",
      render: (value: unknown) => String(value),
    },
    {
      key: "year" as const,
      label: "Year",
      render: (value: unknown) => String(value),
    },
    {
      key: "status" as const,
      label: "Status",
      render: (value: unknown) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value === "completed"
              ? "bg-green-100 text-green-800"
              : value === "ongoing"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {String(value)}
        </span>
      ),
    },
    {
      key: "_id" as const,
      label: "Actions",
      render: (value: unknown, row: unknown) => {
        const season = row as Season;
        return (
          <div className="flex gap-2">
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={() => {
                /* TODO: Edit season */
              }}
            >
              Edit
            </AdminButton>
            <AdminButton
              variant="destructive"
              size="sm"
              onClick={() => openDeleteModal("season", season._id, season.name)}
            >
              Delete
            </AdminButton>
          </div>
        );
      },
    },
  ];

  const winnerColumns = [
    {
      key: "position" as const,
      label: "Position",
      render: (value: unknown) => String(value),
    },
    {
      key: "contestant" as const,
      label: "Contestant",
      render: (value: unknown) => {
        const contestant = value as Winner["contestant"];
        return contestant?.name || "Unknown";
      },
    },
    {
      key: "prize" as const,
      label: "Prize",
      render: (value: unknown) => String(value),
    },
    {
      key: "year" as const,
      label: "Year",
      render: (value: unknown) => String(value),
    },
    {
      key: "_id" as const,
      label: "Actions",
      render: (value: unknown, row: unknown) => {
        const winner = row as Winner;
        return (
          <div className="flex gap-2">
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={() => {
                /* TODO: Edit winner */
              }}
            >
              Edit
            </AdminButton>
            <AdminButton
              variant="destructive"
              size="sm"
              onClick={() =>
                openDeleteModal(
                  "winner",
                  winner._id,
                  `Position ${winner.position}`
                )
              }
            >
              Delete
            </AdminButton>
          </div>
        );
      },
    },
  ];

  const contestantColumns = [
    {
      key: "name" as const,
      label: "Name",
      render: (value: unknown) => String(value),
    },
    {
      key: "age" as const,
      label: "Age",
      render: (value: unknown) => String(value),
    },
    {
      key: "hometown" as const,
      label: "Hometown",
      render: (value: unknown) => String(value),
    },
    {
      key: "season" as const,
      label: "Season",
      render: (value: unknown) => {
        const season = value as Contestant["season"];
        return season ? `${season.name} (${season.year})` : "No season";
      },
    },
    {
      key: "isActive" as const,
      label: "Status",
      render: (value: unknown) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "_id" as const,
      label: "Actions",
      render: (value: unknown, row: unknown) => {
        const contestant = row as Contestant;
        return (
          <div className="flex gap-2">
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={() => {
                /* TODO: Edit contestant */
              }}
            >
              Edit
            </AdminButton>
            <AdminButton
              variant="destructive"
              size="sm"
              onClick={() =>
                openDeleteModal("contestant", contestant._id, contestant.name)
              }
            >
              Delete
            </AdminButton>
          </div>
        );
      },
    },
  ];

  const juryColumns = [
    {
      key: "name" as const,
      label: "Name",
      render: (value: unknown) => String(value),
    },
    {
      key: "title" as const,
      label: "Title",
      render: (value: unknown) => String(value),
    },
    {
      key: "expertise" as const,
      label: "Expertise",
      render: (value: unknown) => {
        const expertise = value as string[];
        return Array.isArray(expertise) ? expertise.join(", ") : String(value);
      },
    },
    {
      key: "isActive" as const,
      label: "Status",
      render: (value: unknown) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "_id" as const,
      label: "Actions",
      render: (value: unknown, row: unknown) => {
        const juryMember = row as Jury;
        return (
          <div className="flex gap-2">
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={() => {
                /* TODO: Edit jury */
              }}
            >
              Edit
            </AdminButton>
            <AdminButton
              variant="destructive"
              size="sm"
              onClick={() =>
                openDeleteModal("jury", juryMember._id, juryMember.name)
              }
            >
              Delete
            </AdminButton>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{error || "Event not found"}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={event.name} description={event.overview}>
        <AdminButton onClick={() => setEditEventModal(true)}>
          Edit Event
        </AdminButton>
      </PageHeader>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Event Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Subtitle
                  </dt>
                  <dd className="text-sm text-gray-900">{event.subtitle}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Quote</dt>
                  <dd className="text-sm text-gray-900">{event.quote}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                  <dd className="text-sm text-gray-900">{event.purpose}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Managed By
                  </dt>
                  <dd>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        event.managedBy === "self"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {event.managedBy === "self"
                        ? "Self Managed"
                        : "Partner Managed"}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Statistics</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Total Seasons
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {seasons.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Total Winners
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {winners.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Total Contestants
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {contestants.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Jury Members
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {jury.length}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === "seasons" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Seasons</h3>
                <AdminButton
                  onClick={() => {
                    /* TODO: Add season */
                  }}
                >
                  Add Season
                </AdminButton>
              </div>
            </div>
            <DataTable data={seasons} columns={seasonColumns} />
          </div>
        )}

        {activeTab === "winners" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Winners</h3>
                <AdminButton
                  onClick={() => {
                    /* TODO: Add winner */
                  }}
                >
                  Add Winner
                </AdminButton>
              </div>
            </div>
            <DataTable data={winners} columns={winnerColumns} />
          </div>
        )}

        {activeTab === "contestants" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Contestants</h3>
                <AdminButton
                  onClick={() => {
                    /* TODO: Add contestant */
                  }}
                >
                  Add Contestant
                </AdminButton>
              </div>
            </div>
            <DataTable data={contestants} columns={contestantColumns} />
          </div>
        )}

        {activeTab === "jury" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Jury Members</h3>
                <AdminButton
                  onClick={() => {
                    /* TODO: Add jury */
                  }}
                >
                  Add Jury Member
                </AdminButton>
              </div>
            </div>
            <DataTable data={jury} columns={juryColumns} />
          </div>
        )}
      </div>

      {/* Modals */}
      <EventPopup
        isOpen={editEventModal}
        event={event as BackendEvent}
        onClose={() => setEditEventModal(false)}
        onSuccess={async () => {
          try {
            const res = await Axios.get(`/api/events/${eventId}`);
            setEvent(res.data.data);
            setEditEventModal(false);
          } catch (err) {
            console.error("Failed to refresh event:", err);
          }
        }}
      />

      {deleteModal.isOpen && (
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() =>
            setDeleteModal({ isOpen: false, type: null, id: null, name: "" })
          }
          onConfirm={handleDelete}
          title={`Delete ${deleteModal.type}`}
          message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
