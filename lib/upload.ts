export async function uploadImage(file: File): Promise<string> {
  const bucketUrl = process.env.NEXT_PUBLIC_BUCKET_SERVICE_URL;

  if (!bucketUrl) {
    throw new Error("Bucket service URL not configured");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${bucketUrl}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const result = await response.json();
  const minioUrl: string = result.data.url;
  const filename = minioUrl.split("/").pop();
  return `${process.env.NEXT_PUBLIC_API_URL}/api/files/${filename}`;
}
