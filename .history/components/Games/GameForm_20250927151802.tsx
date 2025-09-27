"use client";

import {useState, useEffect, useRef} from "react";
import {X, Save, Upload, Image as ImageIcon} from "lucide-react";
import {Game, AdditionalTag} from "@/lib/types";
import {apiClient, getImageUrl} from "@/lib/api";

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
          additionalTags: game.additionalTags.filter(tag => tag !== null && tag !== undefined),
        });
        setPreviewUrl(getImageUrl(game.imageUrl));
      } else {
        setFormData({
          title: "",
          description: "",
          path: "",
          imageUrl: "",
          mainTag: "Game",
          additionalTags: [],
        });
        setPreviewUrl("");
        setSelectedFile(null);
      }
    }
  }, [isOpen, game]);

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && selectedFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, selectedFile]);

  const fetchTags = async () => {
    try {
      const response = await apiClient.getAdditionalTags();
      const tags = Array.isArray(response) ? response : response.data || [];
      setAvailableTags(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setError("");

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const response = await apiClient.uploadImage(file);
      if (response.success && response.url) {
        return response.url;
      } else {
        throw new Error("Upload failed");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = formData.imageUrl;

      // If a new file is selected, upload it first
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const gameData = {
        ...formData,
        imageUrl,
        additionalTags: formData.additionalTags.filter(tag => tag !== null && tag !== undefined),
      };

      console.log('Submitting game data:', gameData);
      console.log('Additional tags being sent:', gameData.additionalTags);

      if (game) {
        await apiClient.updateGame({
          id: (game as any).id || (game as any)._id,
          ...gameData,
        });
      } else {
        await apiClient.createGame(gameData);
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
                Image *
              </label>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-32 max-w-full rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl("");
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedFile ? selectedFile.name : "Current image"}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      Change image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-primary flex items-center mx-auto"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Image
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
              </div>

              {/* Fallback URL input for existing games */}
              {game && !selectedFile && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or enter image URL:
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({...formData, imageUrl: e.target.value})
                    }
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}
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
                disabled={loading || uploading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {uploading
                  ? "Uploading..."
                  : loading
                  ? "Saving..."
                  : "Save Game"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
