"use client";

import {useState, useEffect, useRef} from "react";
import {X, Save, Upload, Image as ImageIcon} from "lucide-react";
import {Game, AdditionalTag} from "@/lib/types";
import {apiClient} from "@/lib/api";

interface GameFormProps {
  game?: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function GameForm({
  game,
  isOpen,
  onClose,
  onSave,
}: GameFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    path: "",
    imageUrl: "",
    mainTag: "Game" as "Game" | "Software",
    additionalTags: [] as string[],
  });
  const [availableTags, setAvailableTags] = useState<AdditionalTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTags();
      if (game) {
        setFormData({
          title: game.title,
          description: game.description,
          path: game.path,
          imageUrl: game.imageUrl,
          mainTag: game.mainTag,
          additionalTags: game.additionalTags,
        });
      } else {
        setFormData({
          title: "",
          description: "",
          path: "",
          imageUrl: "",
          mainTag: "Game",
          additionalTags: [],
        });
      }
    }
  }, [isOpen, game]);

  const fetchTags = async () => {
    try {
      const response = await apiClient.getAdditionalTags();
      const tags = Array.isArray(response) ? response : response.data || [];
      setAvailableTags(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (game) {
        await apiClient.updateGame({
          id: game.id,
          ...formData,
        });
      } else {
        await apiClient.createGame(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      setError("Failed to save game. Please try again.");
      console.error("Error saving game:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalTags: prev.additionalTags.includes(tagId)
        ? prev.additionalTags.filter((id) => id !== tagId)
        : [...prev.additionalTags, tagId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {game ? "Edit Game" : "Create New Game"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({...formData, title: e.target.value})
                }
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({...formData, description: e.target.value})
                }
                className="input-field min-h-[100px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Path *
              </label>
              <input
                type="text"
                value={formData.path}
                onChange={(e) =>
                  setFormData({...formData, path: e.target.value})
                }
                className="input-field"
                placeholder="/games/example"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({...formData, imageUrl: e.target.value})
                }
                className="input-field"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Tag *
              </label>
              <select
                value={formData.mainTag}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mainTag: e.target.value as "Game" | "Software",
                  })
                }
                className="input-field"
                required
              >
                <option value="Game">Game</option>
                <option value="Software">Software</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Tags
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {availableTags.map((tag) => (
                  <label key={tag.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.additionalTags.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm text-gray-700">{tag.name}</span>
                  </label>
                ))}
                {availableTags.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No additional tags available
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Game"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
