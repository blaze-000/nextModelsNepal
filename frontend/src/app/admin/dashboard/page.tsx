export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground font-newsreader">
          Dashboard Overview
        </h1>
        <p className="text-foreground/70 mt-2">
          Welcome back! Here&apos;s what&apos;s happening with your platform
          today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Models",
            value: "156",
            icon: "ri-user-star-line",
            change: "+12%",
          },
          {
            title: "Active Events",
            value: "8",
            icon: "ri-calendar-event-line",
            change: "+2%",
          },
          {
            title: "Applications",
            value: "24",
            icon: "ri-file-user-line",
            change: "+18%",
          },
          {
            title: "Revenue",
            value: "$12,450",
            icon: "ri-money-dollar-circle-line",
            change: "+8%",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-muted-background border border-gold-900/20 rounded-lg p-6 hover:bg-gold-900/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stat.value}
                </p>
                <p className="text-gold-500 text-sm mt-1">{stat.change}</p>
              </div>
              <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center">
                <i className={`${stat.icon} text-gold-500 text-xl`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-muted-background border border-gold-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Applications
          </h3>
          <div className="space-y-3">
            {[
              {
                name: "Sarah Johnson",
                type: "Model Application",
                time: "2 hours ago",
              },
              {
                name: "Mike Chen",
                type: "Event Registration",
                time: "4 hours ago",
              },
              {
                name: "Emily Davis",
                type: "Portfolio Submission",
                time: "1 day ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-bold">
                      {activity.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium">
                      {activity.name}
                    </p>
                    <p className="text-foreground/60 text-sm">
                      {activity.type}
                    </p>
                  </div>
                </div>
                <span className="text-foreground/60 text-sm">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted-background border border-gold-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Add Model", icon: "ri-user-add-line" },
              { title: "Create Event", icon: "ri-calendar-add-line" },
              { title: "New Article", icon: "ri-article-line" },
              { title: "Send Message", icon: "ri-mail-send-line" },
            ].map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center gap-2 p-4 border border-gold-900/20 rounded-lg hover:bg-gold-900/20 transition-colors"
              >
                <i className={`${action.icon} text-gold-500 text-xl`} />
                <span className="text-foreground/80 text-sm font-medium">
                  {action.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
