interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color?: "gold" | "blue" | "green" | "red";
}

export default function StatCard({
  title,
  value,
  icon,
  color = "gold",
}: StatCardProps) {
  const colorClasses = {
    gold: "bg-gold-500/20 text-gold-400 border-gold-500/30",
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    green: "bg-green-500/20 text-green-400 border-green-500/30",
    red: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm sm:text-base font-medium">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <i className={`${icon} text-xl sm:text-2xl`} />
        </div>
      </div>
    </div>
  );
}
