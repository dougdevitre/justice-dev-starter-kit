/**
 * @module storage
 * @description Encrypted file storage client. Handles AES-256 encryption
 * for evidence and sensitive documents before storage.
 */

import { v4 as uuid } from 'uuid';
import crypto from 'crypto';

/** Stored file metadata */
export interface StoredFile {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  encryptionKeyId: string;
  storagePath: string;
  uploadedAt: string;
}

/** In-memory storage (replace with S3 in production) */
const fileStore = new Map<string, { metadata: StoredFile; data: Buffer }>();

/**
 * Upload and encrypt a file.
 *
 * @param filename - Original filename
 * @param data - File contents
 * @param mimeType - MIME type
 * @returns Stored file metadata
 */
export async function uploadFile(
  filename: string,
  data: Buffer,
  mimeType: string
): Promise<StoredFile> {
  const id = uuid();
  const encryptionKeyId = 'key_default';

  // Encrypt the data
  const encrypted = encryptData(data);

  const metadata: StoredFile = {
    id,
    filename,
    mimeType,
    sizeBytes: data.length,
    encryptionKeyId,
    storagePath: `files/${id}`,
    uploadedAt: new Date().toISOString(),
  };

  fileStore.set(id, { metadata, data: encrypted });
  return metadata;
}

/**
 * Download and decrypt a file.
 *
 * @param fileId - File identifier
 * @returns Decrypted file data and metadata
 */
export async function downloadFile(
  fileId: string
): Promise<{ metadata: StoredFile; data: Buffer } | null> {
  const stored = fileStore.get(fileId);
  if (!stored) return null;

  const decrypted = decryptData(stored.data);
  return { metadata: stored.metadata, data: decrypted };
}

/**
 * Delete a file from storage.
 *
 * @param fileId - File identifier
 * @returns true if deleted
 */
export async function deleteFile(fileId: string): Promise<boolean> {
  return fileStore.delete(fileId);
}

/**
 * Encrypt data with AES-256-GCM.
 */
function encryptData(data: Buffer): Buffer {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Prepend IV and auth tag to encrypted data
  return Buffer.concat([iv, authTag, encrypted]);
}

/**
 * Decrypt data with AES-256-GCM.
 */
function decryptData(data: Buffer): Buffer {
  const key = getEncryptionKey();
  const iv = data.subarray(0, 16);
  const authTag = data.subarray(16, 32);
  const encrypted = data.subarray(32);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

/**
 * Get the encryption key from environment.
 */
function getEncryptionKey(): Buffer {
  const keyHex = process.env.STORAGE_ENCRYPTION_KEY;
  if (!keyHex) throw new Error('STORAGE_ENCRYPTION_KEY is not configured');
  return Buffer.from(keyHex, 'hex').subarray(0, 32);
}
