"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import ImageUpload from "@/components/comp-544";
import { useFileUpload } from "@/hooks/use-file-upload";
import { GenerationsApi } from "@/lib/api/generations";
import { Generation } from "@/lib/types/generation";
import { ModeToggle } from "@/components/mode-toggle";

const STYLES = ["Realistic", "Artistic", "Fashion", "Abstract"];

export default function StudioPage() {
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Form state
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(STYLES[0]);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // History state
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Image upload hook
  const [fileState, fileActions] = useFileUpload({
    accept: "image/jpeg, image/png",
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const { files } = fileState;
  const { clearFiles } = fileActions;

  // Protect route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load generation history
  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    }
  }, [isAuthenticated]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await GenerationsApi.getGenerations(5);
      setGenerations(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleGenerate = async () => {
    // Validation
    if (!files[0]?.file || !(files[0].file instanceof File)) {
      setError("Please upload an image");
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setError(null);
    setIsGenerating(true);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      await GenerationsApi.create(
        {
          image: files[0].file,
          prompt: prompt.trim(),
          style,
        },
        abortControllerRef.current.signal
      );

      // Success - reset retry count and reload history
      setRetryCount(0);
      await loadHistory();

      // Clear form
      setPrompt("");
      clearFiles();
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Generation cancelled");
        setRetryCount(0);
      } else if (err.message === "Model overloaded") {
        // Handle retry logic (up to 3 attempts total)
        if (retryCount < 2) {
          setError(`Model overloaded. Retrying... (${retryCount + 1}/3)`);
          setRetryCount(retryCount + 1);
          // Auto-retry after 1 second
          setTimeout(() => handleGenerate(), 1000);
          return;
        } else {
          setError("Model overloaded. Please try again later.");
          setRetryCount(0);
        }
      } else {
        setError(err.message || "Generation failed");
        setRetryCount(0);
      }
    } finally {
      if (abortControllerRef.current?.signal.aborted || retryCount >= 2) {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    }
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setRetryCount(0);
    }
  };

  const handleRestore = (gen: Generation) => {
    setPrompt(gen.prompt);
    setStyle(gen.style);
    // Note: Can't restore the actual image file
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI Studio</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.email}</span>
            <Button
              variant="outline"
              onClick={logout}
              className=" cursor-pointer"
            >
              Logout
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Form */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Create Generation</h2>

              {/* Image Upload */}
              <ImageUpload fileState={fileState} fileActions={fileActions} />

              {/* Prompt Input */}
              <div className="mt-4">
                <label
                  htmlFor="prompt"
                  className="block text-sm font-medium mb-2"
                >
                  Prompt
                </label>
                <input
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to generate..."
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  disabled={isGenerating}
                />
              </div>

              {/* Style Dropdown */}
              <div className="mt-4">
                <label
                  htmlFor="style"
                  className="block text-sm font-medium mb-2"
                >
                  Style
                </label>
                <select
                  id="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-2 py-2 border rounded-md text-sm"
                  disabled={isGenerating}
                >
                  {STYLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 rounded-md text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Generate/Abort Buttons */}
              <div className="mt-6 flex gap-4">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 cursor-pointer"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                    </span>
                  ) : (
                    "Generate"
                  )}
                </Button>
                {isGenerating && (
                  <Button
                    onClick={handleAbort}
                    variant="outline"
                    className=" cursor-pointer"
                  >
                    Abort
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Generation History */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Recent Generations</h2>
            {loadingHistory ? (
              <div className="flex justify-center py-8">
                <LoaderCircle className="w-6 h-6 animate-spin" />
              </div>
            ) : generations.length === 0 ? (
              <p className="text-sm text-gray-500">No generations yet</p>
            ) : (
              <div className="space-y-4">
                {generations.map((gen) => (
                  <div
                    key={gen.id}
                    onClick={() => handleRestore(gen)}
                    className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition"
                  >
                    <img
                      src={gen.imageUrl}
                      alt={gen.prompt}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <p className="text-sm font-medium truncate">{gen.prompt}</p>
                    <p className="text-xs text-gray-500">{gen.style}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(gen.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
