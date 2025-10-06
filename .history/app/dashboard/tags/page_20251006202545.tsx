"use client";

import {useState, useEffect} from "react";
import {
  Plus,
  Trash2,
  Search,
  Tags as TagsIcon,
  AlertCircle,
} from "lucide-react";
import {AdditionalTag} from "@/lib/types";
import {apiClient} from "@/lib/api";

export default function TagsPage() {
  const [tags, setTags] = useState<AdditionalTag[]>([]);
  const [filteredTags, setFilteredTags] = useState<AdditionalTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [newTagBelongsTo, setNewTagBelongsTo] = useState("Game");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    filterTags();
  }, [tags, searchTerm]);

  const fetchTags = async () => {
    try {
      const response = await apiClient.getAdditionalTags();
      const tagsData = Array.isArray(response) ? response : response.data || [];
      setTags(tagsData);
    } catch (error) {
      console.error("Error fetching tags:", error);
      setError("Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  };

  const filterTags = () => {
    if (searchTerm) {
      setFilteredTags(
        tags.filter((tag) =>
          tag.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredTags(tags);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setCreating(true);
    setError("");

    try {
      await apiClient.createAdditionalTag(newTagName.trim(), newTagBelongsTo);
      setNewTagName("");
      setNewTagBelongsTo("Game");
      setShowCreateForm(false);
      await fetchTags();
    } catch (error) {
      setError("Failed to create tag. Please try again.");
      console.error("Error creating tag:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this tag? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      await apiClient.deleteAdditionalTag(id);
      await fetchTags();
    } catch (error) {
      setError("Failed to delete tag. Please try again.");
      console.error("Error deleting tag:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags Management</h1>
          <p className="text-gray-600 mt-1">Manage additional tags for games</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tag
        </button>
      </div>

      {error && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Create Tag Form */}
      {showCreateForm && (
        <div className="card border-primary-200 bg-primary-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Create New Tag
          </h3>
          <form onSubmit={handleCreateTag} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tag Name *
              </label>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="input-field"
                placeholder="Enter tag name"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Belongs To *
              </label>
              <select
                value={newTagBelongsTo}
                onChange={(e) => setNewTagBelongsTo(e.target.value)}
                className="input-field"
                required
              >
                <option value="Game">Game</option>
                <option value="Software">Software</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewTagName("");
                  setNewTagBelongsTo("Game");
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create Tag"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Tags List */}
      {filteredTags.length === 0 ? (
        <div className="card text-center py-12">
          <TagsIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tags found
          </h3>
          <p className="text-gray-600 mb-4">
            {tags.length === 0
              ? "Get started by creating your first tag"
              : "Try adjusting your search criteria"}
          </p>
          {tags.length === 0 && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Tag
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Group tags by belongsTo */}
          {Object.entries(
            filteredTags.reduce((acc, tag) => {
              const belongsTo = tag.belongsTo || "Unknown";
              if (!acc[belongsTo]) {
                acc[belongsTo] = [];
              }
              acc[belongsTo].push(tag);
              return acc;
            }, {} as Record<string, AdditionalTag[]>)
          ).map(([belongsTo, groupedTags]) => (
            <div key={belongsTo} className="space-y-3">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {belongsTo}
                </h2>
                <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                  {groupedTags.length}
                </span>
              </div>
              <div className="space-y-3">
                {groupedTags.map((tag) => (
                  <div key={tag._id} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-3 ${
                            belongsTo === "Game"
                              ? "bg-blue-500"
                              : "bg-purple-500"
                          }`}
                        ></div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {tag.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded ${
                                tag.belongsTo === "Game"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {tag.belongsTo || "Unknown"}
                            </span>
                            {tag.createdAt && (
                              <p className="text-sm text-gray-500">
                                • Created{" "}
                                {new Date(tag.createdAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTag(tag._id)}
                        disabled={deletingId === tag._id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete tag"
                      >
                        {deletingId === tag._id ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="card bg-gray-50">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{tags.length}</p>
          <p className="text-sm text-gray-600">Total Tags</p>
        </div>
      </div>
    </div>
  );
}
