import { Client } from "@upstash/qstash";

const client = new Client({ token: process.env.QSTASH_TOKEN! });

export async function POST(req: Request) {
  const { fileKey } = await req.json();

  const result = await client.publishJSON({
    url: "https://functions.yandexcloud.net/d4e4cksual88o01ocl6v",
    body: { fileKey },
  });

  return Response.json({
    message: "Task queued",
    qstashMessageId: result.messageId,
    fileKey,
  });
}
