import { BlobServiceClient } from "@azure/storage-blob";
import { NextRequest } from "next/server";
import path from "path";

export async function uploadFileToAzure(req: NextRequest, filePrefix: string): Promise<string> {
  const fileName = req.headers.get("x-filename");
  if (!fileName) {
    throw new Error("No filename found in headers (x-filename)");
  }

  if (!req.body) {
    throw new Error("No body found");
  }

  const reader = req.body.getReader();
  let fileBuffer = new Uint8Array();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const tempBuffer = new Uint8Array(fileBuffer.length + value.length);
    tempBuffer.set(fileBuffer);
    tempBuffer.set(value, fileBuffer.length);
    fileBuffer = tempBuffer;
  }

  const timestamp = Date.now();
  const fileExtension = path.extname(fileName);
  const baseName = path.basename(fileName, fileExtension);
  const filePath = path.posix.join(filePrefix, `${baseName}_${timestamp}${fileExtension}`);

  await uploadBufferToAzure(fileBuffer, filePath);

  return filePath;
}

export async function uploadBufferToAzure(buffer: Uint8Array, filePath: string) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);

  console.log("FilePath", filePath);

  const blockBlobClient = containerClient.getBlockBlobClient(filePath);
  await blockBlobClient.uploadData(buffer);
}

export async function retrieveBufferFromAzure(filePath: string) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);

  const blockBlobClient = containerClient.getBlockBlobClient(filePath);

  const exists = await blockBlobClient.exists();
  if (!exists) {
    throw new Error("File not found");
  }

  const blob = await blockBlobClient.download();
  return blob.readableStreamBody;
}
