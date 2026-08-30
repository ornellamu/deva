import express from 'express';
import cors from 'cors';
import authRoutes from '../server/routes/auth.js';
import jobsRoutes from '../server/routes/jobs.js';
import applicationsRoutes from '../server/routes/applications.js';
import adminRoutes from '../server/routes/admin.js';
import documentsRoutes from '../server/routes/documents.js';

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Deva Hospital Recruitment API (Vercel Serverless)',
    timestamp: new Date().toISOString(),
  });
});

// API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/documents', documentsRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled API Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

export default app;
