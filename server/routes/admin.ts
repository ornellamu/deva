import express, { Response } from 'express';
import { db } from '../db.js';
import { requireAdmin, AuthenticatedRequest } from '../authMiddleware.js';
import { getEmailLogs } from '../emailService.js';

const router = express.Router();

// 1. GET /api/admin/stats - Admin Dashboard Analytics
router.get('/stats', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const stats = db.getAdminStats();
    res.json({ stats });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to calculate recruitment statistics.' });
  }
});

// 2. GET /api/admin/email-logs - All sent transactional emails
router.get('/email-logs', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const logs = getEmailLogs();
    res.json({
      count: logs.length,
      logs,
    });
  } catch (error: any) {
    console.error('Error fetching email audit logs:', error);
    res.status(500).json({ error: 'Failed to retrieve email logs.' });
  }
});

// 3. POST /api/admin/reset-data - Reset database to clean seed state
router.post('/reset-data', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    db.resetToSeeds();
    res.json({ message: 'Database state reset to clean hospital seed records.' });
  } catch (error: any) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: 'Failed to reset database.' });
  }
});

export default router;
