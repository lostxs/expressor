"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleUpload() {
    if (!file) {
      setMsg("Please select an .mp3 file first.");
      return;
    }

    setLoading(true);
    setMsg("Uploading...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setMsg(`✅ Queued processing. QStash ID: ${data.qstashMessageId}`);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to upload and queue processing.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">HLS Audio Processor</h1>

      <input
        type="file"
        accept=".mp3"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload & Process"}
      </button>

      <p className="mt-4 text-sm text-gray-700">{msg}</p>
    </div>
  );
}
