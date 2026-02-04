// =====================================================
// MatFlow - Storage (S3/MinIO) Client
// =====================================================

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '@/config/index.js';
import { generateUUID } from '@matflow/utils';

const s3Client = new S3Client({
  endpoint: `${config.storage.useSSL ? 'https' : 'http'}://${config.storage.endpoint}:${config.storage.port}`,
  region: 'us-east-1', // Required but not used by MinIO
  credentials: {
    accessKeyId: config.storage.accessKey,
    secretAccessKey: config.storage.secretKey,
  },
  forcePathStyle: true, // Required for MinIO
});

const bucket = config.storage.bucket;

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  acl?: 'private' | 'public-read';
}

export interface UploadResult {
  key: string;
  url: string;
  size: number;
}

// Generate unique file key
function generateFileKey(filename: string, folder?: string): string {
  const ext = filename.split('.').pop() || '';
  const uuid = generateUUID();
  const key = ext ? `${uuid}.${ext}` : uuid;
  return folder ? `${folder}/${key}` : key;
}

// Upload file
export async function uploadFile(
  file: Buffer,
  filename: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const key = generateFileKey(filename);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: options.contentType,
      Metadata: options.metadata,
      ACL: options.acl || 'private',
    })
  );

  return {
    key,
    url: getFileUrl(key),
    size: file.length,
  };
}

// Upload to specific folder
export async function uploadToFolder(
  file: Buffer,
  filename: string,
  folder: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const key = generateFileKey(filename, folder);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: options.contentType,
      Metadata: options.metadata,
      ACL: options.acl || 'private',
    })
  );

  return {
    key,
    url: getFileUrl(key),
    size: file.length,
  };
}

// Get file URL
export function getFileUrl(key: string): string {
  const protocol = config.storage.useSSL ? 'https' : 'http';
  return `${protocol}://${config.storage.endpoint}:${config.storage.port}/${bucket}/${key}`;
}

// Get signed URL for private files
export async function getSignedDownloadUrl(
  key: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

// Get signed URL for upload
export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

// Delete file
export async function deleteFile(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

// Check if file exists
export async function fileExists(key: string): Promise<boolean> {
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    return true;
  } catch {
    return false;
  }
}

// List files in folder
export async function listFiles(prefix: string): Promise<string[]> {
  const response = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    })
  );

  return response.Contents?.map((item) => item.Key || '') || [];
}

// Get file buffer
export async function getFile(key: string): Promise<Buffer> {
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  const stream = response.Body as NodeJS.ReadableStream;
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk as Buffer);
  }

  return Buffer.concat(chunks);
}

export const storage = {
  upload: uploadFile,
  uploadToFolder,
  getUrl: getFileUrl,
  getSignedUrl: getSignedDownloadUrl,
  getSignedUploadUrl,
  delete: deleteFile,
  exists: fileExists,
  list: listFiles,
  get: getFile,
};
