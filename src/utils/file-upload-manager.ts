import {
  BlobSASPermissions,
  BlobSASSignatureValues,
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";
import { NextRequest } from "next/server";
import path from "node:path";

export async function uploadFileToAzure(
  req: NextRequest,
  filePrefix: string
): Promise<{ filePath: string; fileName: string }> {
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

  return { filePath, fileName };
}

export async function uploadBufferToAzure(buffer: Uint8Array, filePath: string, isPublic = false): Promise<string> {
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
  const blockBlobClient = containerClient.getBlockBlobClient(filePath);
  await blockBlobClient.uploadData(buffer);

  if (isPublic) {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      process.env.AZURE_STORAGE_ACCOUNT_NAME,
      process.env.AZURE_STORAGE_ACCOUNT_KEY
    );
    const sasOptions = {
      containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
      blobName: filePath,
      permissions: BlobSASPermissions.parse("r"),
      startsOn: new Date(),
      expiresOn: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
    };
    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
    return `${blockBlobClient.url}?${sasToken}`;
  }

  return blockBlobClient.url;
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

export async function generateTemporarySasToken(filePath: string, expiresInHours: number, ipAddress?: string) {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_STORAGE_ACCOUNT_KEY
  );

  const sasOptions: BlobSASSignatureValues = {
    containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
    blobName: filePath,
    permissions: BlobSASPermissions.parse("r"),
    startsOn: new Date(),
    expiresOn: new Date(new Date().setHours(new Date().getHours() + expiresInHours)),
    ipRange: ipAddress ? { start: ipAddress, end: ipAddress } : undefined,
  };

  return generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
}

export async function getTemporaryBlobUrlWithSasToken(
  filePath: string,
  expiresInHours: number = 3,
  ipAddress?: string
) {
  const sasToken = await generateTemporarySasToken(filePath, expiresInHours, ipAddress);
  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    new StorageSharedKeyCredential(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_KEY)
  );
  const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
  const blockBlobClient = containerClient.getBlockBlobClient(filePath);

  return `${blockBlobClient.url}?${sasToken}`;
}
