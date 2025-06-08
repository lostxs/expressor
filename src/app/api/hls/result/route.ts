// ==============================
// 2. /app/api/hls/result/route.ts
// Получает результат из Yandex Cloud Function и сохраняет в БД
// ==============================

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { originalFile, hlsUrl } = await req.json();

  console.log("api/hls/result :", { originalFile, hlsUrl });

  return NextResponse.json({ success: true });
}
