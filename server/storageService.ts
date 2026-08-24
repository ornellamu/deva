import { DocumentRecord, DocumentType } from './types.js';

export interface UploadedFileData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp'
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit per document

export function validateFile(file: UploadedFileData): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided.' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return {
      isValid: false,
      error: `Invalid file format for "${file.originalname}". Only PDF, DOC, DOCX, JPG, and PNG are permitted.`
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File "${file.originalname}" exceeds the 10MB maximum limit (${(file.size / (1024 * 1024)).toFixed(2)}MB).`
    };
  }

  return { isValid: true };
}

// In-memory persistent object store simulating cloud storage (Cloudinary/S3/Supabase)
const storageBucket: Map<string, { buffer: Buffer; mime: string; name: string }> = new Map();
let nextDocId = 1;

export async function uploadToCloudStorage(
  file: UploadedFileData,
  docType: DocumentType,
  applicationId: number
): Promise<DocumentRecord> {
  const timestamp = Date.now();
  const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageId = `deva_recruitment/${applicationId}/${docType}_${timestamp}_${safeName}`;

  // Store in simulated cloud object bucket
  storageBucket.set(storageId, {
    buffer: file.buffer,
    mime: file.mimetype,
    name: file.originalname,
  });

  // Base64 Data URL for instant in-browser inspection / fallback cloud URL
  const base64Data = file.buffer.toString('base64');
  const dataUrl = `data:${file.mimetype};base64,${base64Data}`;

  const docRecord: DocumentRecord = {
    id: nextDocId++,
    application_id: applicationId,
    document_type: docType,
    file_name: file.originalname,
    file_url: dataUrl,
    file_size: file.size,
    mime_type: file.mimetype,
    storage_id: storageId,
    created_at: new Date().toISOString(),
  };

  return docRecord;
}

export function getFileFromStorage(storageId: string): { buffer: Buffer; mime: string; name: string } | undefined {
  return storageBucket.get(storageId);
}
