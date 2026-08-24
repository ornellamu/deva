import express, { Response } from 'express';
import multer from 'multer';
import { db } from '../db.js';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '../authMiddleware.js';
import { validateFile, uploadToCloudStorage } from '../storageService.js';
import { sendApplicationEmail } from '../emailService.js';
import { ApplicationStatus } from '../types.js';

const router = express.Router();

// Memory storage for multer (files held temporarily in buffer for validation & cloud upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10, // up to 10 files total
  },
});

const applicationUploadFields = upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'application_letter', maxCount: 1 },
  { name: 'national_id', maxCount: 1 },
  { name: 'certificates', maxCount: 6 },
]);

// 1. POST /api/applications - Submit new job application
router.post(
  '/',
  requireAuth,
  applicationUploadFields,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'Authentication required to submit an application.' });
        return;
      }

      const { job_id, notes } = req.body;
      const parsedJobId = parseInt(job_id, 10);

      if (isNaN(parsedJobId)) {
        res.status(400).json({ error: 'Valid Job ID is required.' });
        return;
      }

      // Verify Job exists and is open
      const job = db.getJobById(parsedJobId);
      if (!job) {
        res.status(404).json({ error: 'Selected healthcare position does not exist.' });
        return;
      }

      // Rule 3: Deadline check
      const today = new Date().toISOString().split('T')[0];
      if (job.status === 'closed' || job.status === 'expired' || job.deadline < today) {
        res.status(400).json({
          error: 'Applications for this position are closed as the deadline has passed.',
        });
        return;
      }

      // Rule 4: Duplicate application check
      if (db.hasUserApplied(user.id, job.id)) {
        res.status(409).json({
          error: 'You have already submitted an application for this position.',
        });
        return;
      }

      // Rule 2: Document verification
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const cvFile = files?.['cv']?.[0];
      const letterFile = files?.['application_letter']?.[0];
      const idFile = files?.['national_id']?.[0];
      const certificateFiles = files?.['certificates'];

      if (!cvFile) {
        res.status(400).json({ error: 'Please upload your CV before submitting your application.' });
        return;
      }
      if (!letterFile) {
        res.status(400).json({ error: 'Please upload your Application / Cover Letter.' });
        return;
      }
      if (!idFile) {
        res.status(400).json({ error: 'Please upload your National ID or Passport document.' });
        return;
      }
      if (!certificateFiles || certificateFiles.length === 0) {
        res.status(400).json({ error: 'Please upload at least one relevant academic or professional certificate.' });
        return;
      }

      // Validate all files
      const allFiles = [cvFile, letterFile, idFile, ...certificateFiles];
      for (const f of allFiles) {
        const val = validateFile(f);
        if (!val.isValid) {
          res.status(400).json({ error: val.error });
          return;
        }
      }

      // Create application record
      const application = db.createApplication(user.id, job.id, notes?.trim());

      // Upload and link documents
      const uploadedDocs = [];

      const cvDoc = await uploadToCloudStorage(cvFile, 'cv', application.id);
      db.addDocument(cvDoc);
      uploadedDocs.push(cvDoc);

      const letterDoc = await uploadToCloudStorage(letterFile, 'application_letter', application.id);
      db.addDocument(letterDoc);
      uploadedDocs.push(letterDoc);

      const idDoc = await uploadToCloudStorage(idFile, 'national_id', application.id);
      db.addDocument(idDoc);
      uploadedDocs.push(idDoc);

      for (const certFile of certificateFiles) {
        const certDoc = await uploadToCloudStorage(certFile, 'certificate', application.id);
        db.addDocument(certDoc);
        uploadedDocs.push(certDoc);
      }

      // Automatically send confirmation email to applicant
      const emailResult = await sendApplicationEmail({
        type: 'submitted_confirmation',
        recipientEmail: user.email,
        recipientName: user.full_name,
        jobTitle: job.title,
        department: job.department,
        applicationId: application.id,
      });

      const fullApp = db.getApplicationById(application.id);

      res.status(201).json({
        message: 'Application submitted successfully! A confirmation email has been dispatched.',
        application: fullApp,
        email_status: emailResult.providerMessage,
      });
    } catch (error: any) {
      console.error('Error submitting application:', error);
      res.status(500).json({ error: error.message || 'Failed to process job application.' });
    }
  }
);

// 2. GET /api/applications/my-applications - Get logged-in applicant's applications
router.get('/my-applications', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const applications = db.getUserApplications(req.user.id);
    res.json({
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ error: 'Failed to retrieve your applications.' });
  }
});

// 3. GET /api/applications/:id - Single application details (Applicant or Admin)
router.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid application ID.' });
      return;
    }

    const application = db.getApplicationById(id);
    if (!application) {
      res.status(404).json({ error: 'Application not found.' });
      return;
    }

    // Ensure applicant can only view their own unless admin
    if (req.user?.role !== 'admin' && application.user_id !== req.user?.id) {
      res.status(403).json({ error: 'Unauthorized to view this application.' });
      return;
    }

    res.json({ application });
  } catch (error: any) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to retrieve application details.' });
  }
});

// 4. GET /api/admin/applications - Admin view of all applications
router.get('/admin/all', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { status, jobId, search } = req.query;

    const applications = db.getAllApplications({
      status: status as ApplicationStatus,
      jobId: jobId ? parseInt(jobId as string, 10) : undefined,
      search: search as string,
    });

    res.json({
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    console.error('Error fetching admin applications:', error);
    res.status(500).json({ error: 'Failed to retrieve applications.' });
  }
});

// 5. PUT /api/admin/applications/:id/status - Admin update status & send email
router.put('/admin/:id/status', requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid application ID.' });
      return;
    }

    const validStatuses: ApplicationStatus[] = ['Submitted', 'Accepted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const application = db.getApplicationById(id);
    if (!application) {
      res.status(404).json({ error: 'Application not found.' });
      return;
    }

    const updatedApp = db.updateApplicationStatus(id, status);

    // Send automated email if status changed to Accepted or Rejected
    let emailStatus = 'No email dispatched for current status.';
    if (status === 'Accepted' && application.user && application.job) {
      const emailResult = await sendApplicationEmail({
        type: 'accepted_notification',
        recipientEmail: application.user.email,
        recipientName: application.user.full_name,
        jobTitle: application.job.title,
        department: application.job.department,
        applicationId: application.id,
      });
      emailStatus = emailResult.providerMessage || 'Accepted notice dispatched.';
    } else if (status === 'Rejected' && application.user && application.job) {
      const emailResult = await sendApplicationEmail({
        type: 'rejected_notification',
        recipientEmail: application.user.email,
        recipientName: application.user.full_name,
        jobTitle: application.job.title,
        department: application.job.department,
        applicationId: application.id,
      });
      emailStatus = emailResult.providerMessage || 'Rejection notice dispatched.';
    }

    res.json({
      message: `Application status updated to ${status} successfully.`,
      application: updatedApp,
      email_status: emailStatus,
    });
  } catch (error: any) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status.' });
  }
});

export default router;
