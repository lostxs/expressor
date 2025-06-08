// === Проект: HLS Audio Processor ===
// Стек: Next.js (App Router) + Prisma + Yandex Cloud Function + QStash
// Цель: загружаем .mp3 -> обрабатываем через облако -> сохраняем HLS URL в БД через webhook

// ==============================
// 1. /app/api/upload/route.ts
// Загружает файл и отправляет задачу через QStash
// ==============================

import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Client } from "@upstash/qstash";

const client = new Client({ token: process.env.QSTASH_TOKEN! });

export async function POST(req: NextRequest) {
  // Image uploading logic
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileKey = `uploads/${Date.now()}-${file.name}`;

  const s3 = new S3Client({
    region: "ru-central1",
    endpoint: "https://storage.yandexcloud.net",
    credentials: {
      accessKeyId: process.env.YC_KEY!,
      secretAccessKey: process.env.YC_SECRET!,
    },
  });

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.YC_BUCKET,
      Key: fileKey,
      Body: buffer,
    })
  );

  // 👇 Once uploading is done, queue an image processing task
  const result = await client.publishJSON({
    url: "https://functions.yandexcloud.net/d4e4cksual88o01ocl6v",
    body: { fileKey: fileKey },
  });

  return NextResponse.json({
    message: "Image queued for processing!",
    qstashMessageId: result.messageId,
    fileKey,
  });
}
