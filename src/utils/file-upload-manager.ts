import { BlobServiceClient } from "@azure/storage-blob";
import { NextRequest } from "next/server";
import path from "path";

export async function uploadFileToAzure(req: NextRequest, filePrefix: string): Promise<string> {
  const contentType = req.headers.get("content-type") || "";
  const boundary = contentType.split("=")[1];
  if (!boundary) {
    throw new Error("No boundary found");
  }

  if (!req.body) {
    throw new Error("No body found");
  }

  const reader = req.body.getReader();
  const decoder = new TextDecoder();
  let fileName = "";
  let fileBuffer = new Uint8Array();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    if (chunk.includes("filename=")) {
      const match = chunk.match(/filename="(.+?)"/);
      if (match) fileName = match[1];
    }
    const tempBuffer = new Uint8Array(fileBuffer.length + value.length);
    tempBuffer.set(fileBuffer);
    tempBuffer.set(value, fileBuffer.length);
    fileBuffer = tempBuffer;
  }

  if (!fileName) {
    throw new Error("File not found");
  }

  const filePath = path.join(filePrefix, fileName);

  await uploadBufferToAzure(fileBuffer, filePath);

  return fileName;
}

export async function uploadBufferToAzure(buffer: Uint8Array, filePath: string) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);

  const blockBlobClient = containerClient.getBlockBlobClient(filePath);
  await blockBlobClient.uploadData(buffer);
}
