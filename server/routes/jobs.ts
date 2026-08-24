import express, { Request, Response } from 'express';
import { db } from '../db.js';
import { requireAdmin, AuthenticatedRequest } from '../authMiddleware.js';
import { JobCategory, JobStatus } from '../types.js';

const router = express.Router();

// 1. GET /api/jobs - List and filter jobs
router.get('/', (req: Request, res: Response): void => {
  try {
    const { category, department, location, search, status } = req.query;

    const jobs = db.getJobs({
      category: category as string,
      department: department as string,
      location: location as string,
      search: search as string,
      status: status as JobStatus,
    });

    res.json({
      count: jobs.length,
      jobs,
    });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to retrieve healthcare positions.' });
  }
});

// 2. GET /api/jobs/:id - Single job details
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid position identifier.' });
      return;
    }

    const job = db.getJobById(id);
    if (!job) {
      res.status(404).json({ error: 'Healthcare position not found.' });
      return;
    }

    res.json({ job });
  } catch (error: any) {
    console.error('Error fetching job by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve job details.' });
  }
});

// 3. POST /api/admin/jobs - Admin Create Job
router.post('/admin', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const {
      title,
      department,
      category,
      location,
      description,
      requirements,
      deadline,
      number_of_positions,
      status,
    } = req.body;

    if (!title || !department || !category || !description || !requirements || !deadline) {
      res.status(400).json({
        error: 'Missing required fields. Title, department, category, description, requirements, and deadline are mandatory.',
      });
      return;
    }

    const validCategories: JobCategory[] = [
      'Physician',
      'Nurse',
      'Allied Health',
      'Administration',
      'Laboratory',
      'Pharmacy',
      'Other Healthcare Positions',
    ];

    if (!validCategories.includes(category)) {
      res.status(400).json({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
      return;
    }

    const newJob = db.createJob({
      title: title.trim(),
      department: department.trim(),
      category: category as JobCategory,
      location: location?.trim() || 'Deva Central Hospital Campus',
      description: description.trim(),
      requirements: requirements.trim(),
      deadline: deadline.trim(),
      number_of_positions: parseInt(number_of_positions, 10) || 1,
      status: (status as JobStatus) || 'open',
    });

    res.status(201).json({
      message: 'Job vacancy published successfully.',
      job: newJob,
    });
  } catch (error: any) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to publish new position.' });
  }
});

// 4. PUT /api/admin/jobs/:id - Admin Edit Job
router.put('/admin/:id', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid job ID.' });
      return;
    }

    const {
      title,
      department,
      category,
      location,
      description,
      requirements,
      deadline,
      number_of_positions,
      status,
    } = req.body;

    const updatedJob = db.updateJob(id, {
      ...(title && { title: title.trim() }),
      ...(department && { department: department.trim() }),
      ...(category && { category: category as JobCategory }),
      ...(location && { location: location.trim() }),
      ...(description && { description: description.trim() }),
      ...(requirements && { requirements: requirements.trim() }),
      ...(deadline && { deadline: deadline.trim() }),
      ...(number_of_positions !== undefined && { number_of_positions: parseInt(number_of_positions, 10) }),
      ...(status && { status: status as JobStatus }),
    });

    if (!updatedJob) {
      res.status(404).json({ error: 'Job not found.' });
      return;
    }

    res.json({
      message: 'Job details updated successfully.',
      job: updatedJob,
    });
  } catch (error: any) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job vacancy.' });
  }
});

// 5. DELETE /api/admin/jobs/:id - Admin Delete or Close Job
router.delete('/admin/:id', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid job ID.' });
      return;
    }

    const success = db.deleteJob(id);
    if (!success) {
      res.status(404).json({ error: 'Job not found.' });
      return;
    }

    res.json({ message: 'Job closed or deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to process job deletion.' });
  }
});

export default router;
