"use client";

import {useState, useEffect} from "react";
import {Gamepad2, Tags, Users, TrendingUp} from "lucide-react";
import {apiClient} from "@/lib/api";

interface DashboardStats {
  totalGames: number;
  totalTags: number;
  totalUsers: number;
  subscribedUsers: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalGames: 0,
    totalTags: 0,
    totalUsers: 0,
    subscribedUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [gamesResponse, tagsResponse, usersResponse] = await Promise.all([
        apiClient.getGames(),
        apiClient.getAdditionalTags(),
        apiClient.getUsers(),
      ]);

      const games = Array.isArray(gamesResponse)
        ? gamesResponse
        : gamesResponse.data || [];
      const tags = Array.isArray(tagsResponse)
        ? tagsResponse
        : tagsResponse.data || [];
      const users = Array.isArray(usersResponse)
        ? usersResponse
        : usersResponse.data || [];

      setStats({
        totalGames: games.length,
        totalTags: tags.length,
        totalUsers: users.length,
        subscribedUsers: users.filter((user: any) => user.isSubscribed).length,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Games",
      value: stats.totalGames,
      icon: Gamepad2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Tags",
      value: stats.totalTags,
      icon: Tags,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Subscribed Users",
      value: stats.subscribedUsers,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome to the File Server Admin Panel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/games"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Gamepad2 className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Manage Games</h3>
            <p className="text-sm text-gray-600 mt-1">
              Add, edit, or remove games
            </p>
          </a>
          <a
            href="/dashboard/tags"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Tags className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">Manage Tags</h3>
            <p className="text-sm text-gray-600 mt-1">
              Create and organize tags
            </p>
          </a>
          <a
            href="/dashboard/users"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Users className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-600 mt-1">
              View and manage user subscriptions
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
