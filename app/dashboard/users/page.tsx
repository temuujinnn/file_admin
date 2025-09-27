"use client";

import {useState, useEffect} from "react";
import {
  Search,
  Users as UsersIcon,
  Crown,
  User as UserIcon,
  AlertCircle,
} from "lucide-react";
import {User} from "@/lib/types";
import {apiClient} from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubscription, setFilterSubscription] = useState<
    "all" | "subscribed" | "unsubscribed"
  >("all");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterSubscription]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.getUsers();
      const usersData = Array.isArray(response)
        ? response
        : response.data || [];
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          (user.username &&
            user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.email &&
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          user._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSubscription !== "all") {
      filtered = filtered.filter((user) =>
        filterSubscription === "subscribed"
          ? user.isSubscribed
          : !user.isSubscribed
      );
    }

    setFilteredUsers(filtered);
  };

  const handleSubscriptionToggle = async (
    userId: string,
    currentStatus: boolean
  ) => {
    setUpdatingUserId(userId);
    setError("");

    try {
      await apiClient.setSubscription(userId, !currentStatus);
      await fetchUsers();
    } catch (error) {
      setError("Failed to update subscription. Please try again.");
      console.error("Error updating subscription:", error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getStats = () => {
    const total = users.length;
    const subscribed = users.filter((user) => user.isSubscribed).length;
    const unsubscribed = total - subscribed;
    const subscriptionRate =
      total > 0 ? ((subscribed / total) * 100).toFixed(1) : "0";

    return {total, subscribed, unsubscribed, subscriptionRate};
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-600 mt-1">
          Manage user accounts and subscriptions
        </p>
      </div>

      {error && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50">
              <Crown className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Subscribed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.subscribed}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50">
              <UserIcon className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unsubscribed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.unsubscribed}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-50">
              <div className="w-6 h-6 text-purple-600 font-bold text-sm flex items-center justify-center">
                %
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Subscription Rate
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.subscriptionRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by username, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterSubscription}
              onChange={(e) =>
                setFilterSubscription(
                  e.target.value as "all" | "subscribed" | "unsubscribed"
                )
              }
              className="input-field"
            >
              <option value="all">All Users</option>
              <option value="subscribed">Subscribed Only</option>
              <option value="unsubscribed">Unsubscribed Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="card text-center py-12">
          <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No users found
          </h3>
          <p className="text-gray-600">
            {users.length === 0
              ? "No users have been registered yet"
              : "Try adjusting your search or filter criteria"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user._id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      user.isSubscribed ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    {user.isSubscribed ? (
                      <Crown className="w-6 h-6 text-green-600" />
                    ) : (
                      <UserIcon className="w-6 h-6 text-gray-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {user.username ||
                          user.email ||
                          `User ${user._id.slice(-6)}`}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.isSubscribed
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isSubscribed ? "Subscribed" : "Free"}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      {user.email && <p>Email: {user.email}</p>}
                      <p>ID: {user._id}</p>
                      {user.createdAt && (
                        <p>
                          Joined:{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() =>
                      handleSubscriptionToggle(user._id, user.isSubscribed)
                    }
                    disabled={updatingUserId === user._id}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      user.isSubscribed
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {updatingUserId === user._id ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    ) : user.isSubscribed ? (
                      "Remove Subscription"
                    ) : (
                      "Add Subscription"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
