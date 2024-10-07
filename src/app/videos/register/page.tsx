"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NewVideo() {
  const [youtubeId, setYoutubeId] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeId }),
      });

      if (!res.ok) {
        const errorData = res.headers
          .get("content-type")
          ?.includes("application/json")
          ? await res.json()
          : { error: "Unknown error occurred" };
        throw new Error(errorData.error || "Error adding video");
      }

      router.push("/admin/videos");
    } catch (error) {
      alert(error.message);
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session || session.user.role !== "admin")
    return <div>Access denied</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="youtubeId"
            className="block text-sm font-medium text-gray-700"
          >
            YouTube Video ID
          </label>
          <input
            type="text"
            id="youtubeId"
            value={youtubeId}
            onChange={(e) => setYoutubeId(e.target.value)}
            placeholder="Enter YouTube Video ID"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Add Video
        </button>
      </form>
    </div>
  );
}
