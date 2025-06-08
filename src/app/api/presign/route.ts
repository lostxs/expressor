import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const client = new S3Client({
  region: "ru-central1",
  endpoint: "https://storage.yandexcloud.net",
  credentials: {
    accessKeyId: process.env.YC_KEY!,
    secretAccessKey: process.env.YC_SECRET!,
  },
});

const maxSize = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const { filename } = await req.json();
  const key = `uploads/${Date.now()}-${filename}`;

  const url = await createPresignedPost(client, {
    Bucket: process.env.YC_BUCKET!,
    Key: key,
    Conditions: [["content-length-range", 1, maxSize]],
    Expires: 3600,
  });

  return Response.json({ key, url });
}
