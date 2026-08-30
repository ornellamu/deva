import express, { Response } from 'express';
import { db } from '../db.js';
import { requireAuth, AuthenticatedRequest } from '../authMiddleware.js';
import { getFileFromStorage } from '../storageService.js';

const router = express.Router();

// 1. GET /api/documents/:id/view - Stream inline document for preview (PDF, Image, etc.)
router.get('/:id/view', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid document ID.' });
      return;
    }

    const doc = db.getDocumentById(id);
    if (!doc) {
      res.status(404).json({ error: 'Document not found.' });
      return;
    }

    // Permission check: Admin or the owner applicant
    const app = db.getApplicationById(doc.application_id);
    if (req.user?.role !== 'admin' && app && app.user_id !== req.user?.id) {
      res.status(403).json({ error: 'Unauthorized to view this document.' });
      return;
    }

    const fileData = getFileFromStorage(doc);
    if (!fileData || !fileData.buffer) {
      res.status(404).json({ error: 'Document file contents not found in storage vault.' });
      return;
    }

    // Set headers for inline browser preview
    res.setHeader('Content-Type', doc.mime_type || fileData.mime || 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(doc.file_name || fileData.name || 'document')}"`
    );
    res.setHeader('Content-Length', fileData.buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=3600');

    res.send(fileData.buffer);
  } catch (error: any) {
    console.error('Error serving document for preview:', error);
    res.status(500).json({ error: 'Failed to retrieve document.' });
  }
});

// 2. GET /api/documents/:id/download - Force attachment download with proper headers
router.get('/:id/download', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid document ID.' });
      return;
    }

    const doc = db.getDocumentById(id);
    if (!doc) {
      res.status(404).json({ error: 'Document not found.' });
      return;
    }

    // Permission check: Admin or the owner applicant
    const app = db.getApplicationById(doc.application_id);
    if (req.user?.role !== 'admin' && app && app.user_id !== req.user?.id) {
      res.status(403).json({ error: 'Unauthorized to download this document.' });
      return;
    }

    const fileData = getFileFromStorage(doc);
    if (!fileData || !fileData.buffer) {
      res.status(404).json({ error: 'Document file contents not found in storage vault.' });
      return;
    }

    res.setHeader('Content-Type', doc.mime_type || fileData.mime || 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(doc.file_name || fileData.name || 'document')}"`
    );
    res.setHeader('Content-Length', fileData.buffer.length);

    res.send(fileData.buffer);
  } catch (error: any) {
    console.error('Error downloading document:', error);
    res.status(500).json({ error: 'Failed to download document.' });
  }
});

// 3. GET /api/documents/:id/info - Document metadata
router.get('/:id/info', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid document ID.' });
      return;
    }

    const doc = db.getDocumentById(id);
    if (!doc) {
      res.status(404).json({ error: 'Document not found.' });
      return;
    }

    const app = db.getApplicationById(doc.application_id);
    if (req.user?.role !== 'admin' && app && app.user_id !== req.user?.id) {
      res.status(403).json({ error: 'Unauthorized.' });
      return;
    }

    res.json({
      document: {
        id: doc.id,
        application_id: doc.application_id,
        document_type: doc.document_type,
        file_name: doc.file_name,
        file_size: doc.file_size,
        mime_type: doc.mime_type,
        storage_id: doc.storage_id,
        view_url: `/api/documents/${doc.id}/view`,
        download_url: `/api/documents/${doc.id}/download`,
        created_at: doc.created_at,
      },
    });
  } catch (error: any) {
    console.error('Error fetching document metadata:', error);
    res.status(500).json({ error: 'Failed to retrieve document metadata.' });
  }
});

export default router;
