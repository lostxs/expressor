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
      // 1. Получаем presigned POST URL и поля
      const presignRes = await fetch("/api/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!presignRes.ok) throw new Error("Failed to get presigned URL");
      const { url, key } = await presignRes.json();

      // 2. Создаем FormData с полями и файлом
      const formData = new FormData();
      Object.entries(url.fields as Record<string, string>).forEach(([k, v]) => {
        formData.append(k, v);
      });
      formData.append("file", file);

      // 3. Загружаем файл напрямую в Yandex Object Storage
      setMsg("Uploading to storage...");
      const uploadRes = await fetch(url.url, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        throw new Error(`Upload failed: ${uploadRes.status} ${text}`);
      }

      // 4. Триггерим дальнейшую обработку
      setMsg("Triggering processing...");
      const triggerRes = await fetch("/api/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileKey: key }),
      });

      if (!triggerRes.ok) throw new Error("Triggering failed");

      const data = await triggerRes.json();
      setMsg(`✅ Queued processing. QStash ID: ${data.qstashMessageId}`);
    } catch (err) {
      console.error(err);
      setMsg(`❌ Upload or processing failed: ${err}`);
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
