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
    setMsg("Preparing upload...");

    try {
      // 1. Получаем presigned URL
      const presignRes = await fetch("/api/presign", {
        method: "POST",
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { url, key } = await presignRes.json();

      // 2. Загружаем файл напрямую в Object Storage
      setMsg("Uploading to storage...");
      await fetch(url, {
        method: "POST",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      // 3. Триггерим обработку через QStash
      setMsg("Triggering processing...");
      const triggerRes = await fetch("/api/trigger", {
        method: "POST",
        body: JSON.stringify({ fileKey: key }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await triggerRes.json();
      setMsg(`✅ Queued processing. QStash ID: ${data.qstashMessageId}`);
    } catch (err) {
      console.error(err);
      setMsg("❌ Upload or processing failed.");
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
