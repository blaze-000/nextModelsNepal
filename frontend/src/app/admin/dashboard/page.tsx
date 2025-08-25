"use client";

import { useState, useEffect } from "react";
import Axios from "@/lib/axios-instance";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalModels: number;
  maleModels: number;
  femaleModels: number;
  totalEvents: number;
  activeEvents: number;
  totalApplications: number;
  thisMonthApplications: number;
  totalRevenue: number;
}

interface RecentApplication {
  name: string;
  time: string;
}

interface RecentModel {
  name: string;
  gender: string;
  time: string;
}

interface ContestantInfo {
  id: string;
  name: string;
  votes: number;
}

interface RecentPayment {
  prn: string;
  status: string;
  amount: number;
  contestants: ContestantInfo[];
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [recentModels, setRecentModels] = useState<RecentModel[]>([]);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await Axios.get("/api/dashboard/stats");
        
        if (response.data.success) {
          setStats(response.data.data.stats);
          setRecentApplications(response.data.data.recentApplications);
          setRecentModels(response.data.data.recentModels);
          setRecentPayments(response.data.data.recentPayments || []);
        } else {
          setError("Failed to fetch dashboard statistics");
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to fetch dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Format currency in NPR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
    }).format(amount);
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  // Handle quick actions
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "Add Model":
        router.push("/admin/models");
        break;
      case "Create Event":
        router.push("/admin/events");
        break;
      case "New Article":
        router.push("/admin/news");
        break;
      case "Send Newsletter":
        router.push("/admin/newsletter");
        break;
      default:
        break;
    }
  };

  // Stats data for the grid
  const statsData = stats ? [
    {
      title: "Total Models",
      value: stats.totalModels,
      icon: "ri-user-star-line",
      change: `+${stats.maleModels + stats.femaleModels > 0 ? Math.round(((stats.maleModels + stats.femaleModels) / (stats.maleModels + stats.femaleModels)) * 100) : 0}%`,
    },
    {
      title: "Active Events",
      value: stats.activeEvents,
      icon: "ri-calendar-event-line",
      change: `+${stats.activeEvents > 0 ? Math.round((stats.activeEvents / stats.totalEvents) * 100) : 0}%`,
    },
    {
      title: "Applications",
      value: stats.totalApplications,
      icon: "ri-file-user-line",
      change: `+${stats.thisMonthApplications > 0 ? Math.round((stats.thisMonthApplications / stats.totalApplications) * 100) : 0}%`,
    },
    {
      title: "Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: "ri-money-dollar-circle-line",
      change: "+8%",
    },
  ] : [];

  // Render contestant information for a payment
  const renderPaymentContestants = (payment: RecentPayment) => {
    if (payment.contestants && payment.contestants.length > 1) {
      // Bulk payment with multiple contestants
      const totalVotes = payment.contestants.reduce((sum, contestant) => sum + contestant.votes, 0);
      return (
        <div className="mt-1">
          <div className="text-xs text-foreground/60">Bulk Payment ({totalVotes} total votes):</div>
          <div className="text-sm">
            {payment.contestants.map((contestant, index) => (
              <span key={index} className="inline-block mr-2">
                {contestant.name} ({contestant.votes} votes)
              </span>
            ))}
          </div>
        </div>
      );
    } else if (payment.contestants && payment.contestants.length === 1) {
      // Single contestant payment
      const contestant = payment.contestants[0];
      return (
        <div className="text-sm">
          {contestant.name} ({contestant.votes} votes)
        </div>
      );
    } else {
      return <div className="text-sm">Unknown contestant</div>;
    }
  };

  // Get status badge for payment
  const getPaymentStatusBadge = (status: string) => {
    const statusClasses = {
      created: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      error: 'bg-purple-100 text-purple-800',
      sent: 'bg-indigo-100 text-indigo-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Error</h3>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-newsreader">
          Dashboard Overview
        </h1>
        <p className="text-foreground/70 mt-2 text-sm sm:text-base">
          Welcome back! Here&apos;s what&apos;s happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-muted-background border border-gold-900/20 rounded-lg p-4 sm:p-6 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-3 sm:h-4 bg-gold-900/30 rounded w-20 sm:w-24 mb-2"></div>
                  <div className="h-5 sm:h-6 bg-gold-900/30 rounded w-12 sm:w-16 mb-2"></div>
                  <div className="h-2 sm:h-3 bg-gold-900/30 rounded w-10 sm:w-12"></div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-900/30 rounded-lg"></div>
              </div>
            </div>
          ))
        ) : (
          statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-muted-background border border-gold-900/20 rounded-lg p-4 sm:p-6 hover:bg-gold-900/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 text-xs sm:text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                  <p className="text-gold-500 text-xs sm:text-sm mt-1">{stat.change}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500/20 rounded-lg flex items-center justify-center">
                  <i className={`${stat.icon} text-gold-500 text-lg sm:text-xl`} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent Activity, Models, and Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Applications */}
        <div className="bg-muted-background border border-gold-900/20 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">
            Recent Applications
          </h3>
          <div className="space-y-3">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between py-2 animate-pulse">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gold-900/30 rounded-full"></div>
                    <div>
                      <div className="h-3 sm:h-4 bg-gold-900/30 rounded w-20 sm:w-24 mb-1"></div>
                      <div className="h-2 sm:h-3 bg-gold-900/30 rounded w-24 sm:w-32"></div>
                    </div>
                  </div>
                  <div className="h-2 sm:h-3 bg-gold-900/30 rounded w-12 sm:w-16"></div>
                </div>
              ))
            ) : recentApplications.length > 0 ? (
              recentApplications.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gold-500 rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-xs sm:text-sm font-bold">
                        {activity.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-foreground font-medium text-sm sm:text-base">
                        {activity.name}
                      </p>
                      <p className="text-foreground/60 text-xs sm:text-sm">
                        Model Application
                      </p>
                    </div>
                  </div>
                  <span className="text-foreground/60 text-xs sm:text-sm">
                    {formatTimeAgo(activity.time)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-foreground/60 text-xs sm:text-sm py-2">
                No recent applications
              </p>
            )}
          </div>
        </div>

        {/* Recent Models */}
        <div className="bg-muted-background border border-gold-900/20 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">
            Recent Models
          </h3>
          <div className="space-y-3">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between py-2 animate-pulse">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gold-900/30 rounded-full"></div>
                    <div>
                      <div className="h-3 sm:h-4 bg-gold-900/30 rounded w-20 sm:w-24 mb-1"></div>
                      <div className="h-2 sm:h-3 bg-gold-900/30 rounded w-12 sm:w-16"></div>
                    </div>
                  </div>
                  <div className="h-2 sm:h-3 bg-gold-900/30 rounded w-12 sm:w-16"></div>
                </div>
              ))
            ) : recentModels.length > 0 ? (
              recentModels.map((model, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gold-500 rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-xs sm:text-sm font-bold">
                        {model.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-foreground font-medium text-sm sm:text-base">
                        {model.name}
                      </p>
                      <p className="text-foreground/60 text-xs sm:text-sm">
                        {model.gender}
                      </p>
                    </div>
                  </div>
                  <span className="text-foreground/60 text-xs sm:text-sm">
                    {formatTimeAgo(model.time)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-foreground/60 text-xs sm:text-sm py-2">
                No recent models
              </p>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-muted-background border border-gold-900/20 rounded-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              Recent Payments
            </h3>
            <button 
              onClick={() => router.push('/admin/payments')}
              className="text-primary text-xs sm:text-sm hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between py-2 animate-pulse">
                  <div className="flex-1">
                    <div className="h-3 sm:h-4 bg-gold-900/30 rounded w-3/4 mb-1"></div>
                    <div className="h-2 sm:h-3 bg-gold-900/30 rounded w-1/2"></div>
                  </div>
                  <div className="h-2 sm:h-3 bg-gold-900/30 rounded w-12 sm:w-16 ml-2"></div>
                </div>
              ))
            ) : recentPayments.length > 0 ? (
              recentPayments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between py-2 border-b border-gold-900/10 last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-foreground/60 truncate">
                        {payment.prn.substring(0, 12)}...
                      </span>
                      {getPaymentStatusBadge(payment.status)}
                    </div>
                    {renderPaymentContestants(payment)}
                    <div className="text-xs text-foreground/60 mt-1">
                      {formatTimeAgo(payment.createdAt)}
                    </div>
                  </div>
                  <div className="text-right font-medium text-sm">
                    {formatCurrency(payment.amount)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-foreground/60 text-xs sm:text-sm py-2">
                No recent payments
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-muted-background border border-gold-900/20 rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { title: "Add Model", icon: "ri-user-add-line" },
            { title: "Create Event", icon: "ri-calendar-event-line" },
            { title: "New Article", icon: "ri-article-line" },
            { title: "Send Newsletter", icon: "ri-mail-send-line" },
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.title)}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 border border-gold-900/20 rounded-lg hover:bg-gold-900/20 transition-colors cursor-pointer"
            >
              <i className={`${action.icon} text-gold-500 text-lg sm:text-xl`} />
              <span className="text-foreground/80 text-xs sm:text-sm font-medium text-center">
                {action.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}