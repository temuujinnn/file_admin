"use client";

import {useState, useEffect} from "react";
import {Plus, Edit, Search, Filter, Gamepad2, Trash2} from "lucide-react";
import {Game, AdditionalTag} from "@/lib/types";
import {apiClient, getImageUrl} from "@/lib/api";
import GameForm from "@/components/Games/GameForm";
import toast from "react-hot-toast";

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [tags, setTags] = useState<AdditionalTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMainTag, setSelectedMainTag] = useState<
    "all" | "Game" | "Software"
  >("all");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterGames();
  }, [games, searchTerm, selectedMainTag]);

  const fetchData = async () => {
    try {
      const [gamesResponse, tagsResponse] = await Promise.all([
        apiClient.getGames(),
        apiClient.getAdditionalTags(),
      ]);

      const gamesData = Array.isArray(gamesResponse)
        ? gamesResponse
        : gamesResponse.data || [];
      const tagsData = Array.isArray(tagsResponse)
        ? tagsResponse
        : tagsResponse.data || [];

      setGames(gamesData);
      setTags(tagsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch games data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGame = async (gameId: string, gameTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${gameTitle}"?`)) {
      try {
        await apiClient.deleteGame(gameId);
        setGames(games.filter(game => game._id !== gameId));
        toast.success(`"${gameTitle}" deleted successfully!`);
      } catch (error) {
        console.error("Error deleting game:", error);
        toast.error("Failed to delete game");
      }
    }
  };

  const filterGames = () => {
    let filtered = games;

    if (searchTerm) {
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedMainTag !== "all") {
      filtered = filtered.filter((game) => game.mainTag === selectedMainTag);
    }

    setFilteredGames(filtered);
  };

  const handleCreateGame = () => {
    setSelectedGame(null);
    setShowForm(true);
  };

  const handleEditGame = (game: Game) => {
    setSelectedGame(game);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedGame(null);
  };

  const handleFormSave = () => {
    fetchData();
  };

  const getTagNames = (tagIds: string[]) => {
    return tagIds
      .map((id) => tags.find((tag) => tag._id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Games Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your games and software collection
          </p>
        </div>
        <button
          onClick={handleCreateGame}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Game
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedMainTag}
                onChange={(e) =>
                  setSelectedMainTag(
                    e.target.value as "all" | "Game" | "Software"
                  )
                }
                className="input-field pl-10"
              >
                <option value="all">All Types</option>
                <option value="Game">Games</option>
                <option value="Software">Software</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="card text-center py-12">
          <Gamepad2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No games found
          </h3>
          <p className="text-gray-600 mb-4">
            {games.length === 0
              ? "Get started by adding your first game"
              : "Try adjusting your search or filter criteria"}
          </p>
          {games.length === 0 && (
            <button onClick={handleCreateGame} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Game
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game._id}
              className="card hover:shadow-md transition-shadow duration-200"
            >
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img
                  src={getImageUrl(game.imageUrl)}
                  alt={game.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMzYgNzJIMTg0VjEwOEgxMzZWNzJaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=";
                  }}
                />
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {game.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {game.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      game.mainTag === "Game"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {game.mainTag}
                  </span>
                  {game.additionalTags.length > 0 && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      +{game.additionalTags.length} tags
                    </span>
                  )}
                </div>

                <div className="pt-2 flex space-x-2">
                  <button
                    onClick={() => handleEditGame(game)}
                    className="btn-secondary flex-1 flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGame(game.id, game.title)}
                    className="btn-danger flex-1 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Game Form Modal */}
      <GameForm
        game={selectedGame}
        isOpen={showForm}
        onClose={handleFormClose}
        onSave={handleFormSave}
      />
    </div>
  );
}
