import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  Job,
  Application,
  DocumentRecord,
  AdminStats,
  JobCategory,
  JobStatus,
  ApplicationStatus,
} from './types.js';

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db_store.json');

// In-Memory Relational Engine mirroring MySQL schema with durable file-based persistence
class RelationalDatabase {
  private users: User[] = [];
  private jobs: Job[] = [];
  private applications: Application[] = [];
  private documents: DocumentRecord[] = [];

  private nextUserId = 1;
  private nextJobId = 1;
  private nextApplicationId = 1;
  private nextDocId = 1;

  constructor() {
    const loaded = this.loadFromDisk();
    if (!loaded) {
      this.seedDatabase();
      this.persist();
    }
  }

  private loadFromDisk(): boolean {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const data = JSON.parse(raw);
        if (data && Array.isArray(data.users) && Array.isArray(data.jobs) && data.users.length > 0) {
          // Filter out any default sample/mock applicant accounts and their applications
          const demoEmails = ['michael.chen@gmail.com', 'sarah.jenkins@gmail.com', 'david.mwangi@gmail.com'];
          const demoUserIds = (data.users || [])
            .filter((u: any) => demoEmails.includes(u.email?.toLowerCase()))
            .map((u: any) => u.id);

          this.users = (data.users || []).filter((u: any) => !demoEmails.includes(u.email?.toLowerCase()));
          this.jobs = data.jobs || [];
          this.applications = (data.applications || []).filter((a: any) => !demoUserIds.includes(a.user_id));
          
          const validAppIds = this.applications.map((a) => a.id);
          this.documents = (data.documents || []).filter((d: any) => validAppIds.includes(d.application_id));

          this.nextUserId = data.nextUserId || (this.users.length ? Math.max(...this.users.map((u: any) => u.id)) + 1 : 1);
          this.nextJobId = data.nextJobId || (this.jobs.length ? Math.max(...this.jobs.map((j: any) => j.id)) + 1 : 1);
          this.nextApplicationId = data.nextApplicationId || (this.applications.length ? Math.max(...this.applications.map((a: any) => a.id)) + 1 : 1);
          this.nextDocId = data.nextDocId || (this.documents.length ? Math.max(...this.documents.map((d: any) => d.id)) + 1 : 1);
          
          // Ensure file is updated with cleaned records
          this.persist();
          return true;
        }
      }
    } catch (err) {
      console.error('Error reading database store from disk, reseeding:', err);
    }
    return false;
  }

  public persist(): void {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const state = {
        nextUserId: this.nextUserId,
        nextJobId: this.nextJobId,
        nextApplicationId: this.nextApplicationId,
        nextDocId: this.nextDocId,
        users: this.users,
        jobs: this.jobs,
        applications: this.applications,
        documents: this.documents,
      };
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database store to disk:', err);
    }
  }

  private seedDatabase() {
    // 1. Initial Admin User
    // Default requested credentials: Username "Admin" (or email admin@devahospital.org) and Password "admin123"
    const adminPasswordHash = bcrypt.hashSync('admin123', 10);
    this.users.push({
      id: this.nextUserId++,
      full_name: 'Dr. Evelyn Vance (Chief of HR / Hospital Admin)',
      email: 'admin@devahospital.org',
      phone: '+1 (800) 555-0199',
      username: 'Admin',
      password_hash: adminPasswordHash,
      role: 'admin',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    });

    // 2. Initial Jobs
    const addDays = (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    const initialJobs: Omit<Job, 'id' | 'created_at' | 'updated_at'>[] = [
      {
        title: 'Senior Consultant Cardiologist',
        department: 'Cardiology & Interventional Medicine',
        category: 'Physician',
        location: 'Deva Main Hospital Tower, Level 4',
        description:
          'Deva Hospital is seeking a board-certified Senior Consultant Cardiologist to lead our cardiac catheterization laboratory and clinical diagnostic cardiology team. The role entails providing high-level specialized cardiology consultations, performing complex coronary interventions, participating in multi-disciplinary heart team reviews, and mentoring post-graduate medical residents.',
        requirements:
          '• MD or equivalent medical degree with specialization in Cardiology.\n• Board certification or valid specialist registration.\n• Minimum of 7 years of post-specialist clinical cardiology experience.\n• Proven expertise in echocardiography, angiography, and coronary interventions.\n• Active medical license in good standing.',
        deadline: addDays(28),
        number_of_positions: 2,
        status: 'open',
      },
      {
        title: 'Charge Nurse — Intensive Care Unit (ICU)',
        department: 'Critical Care Services',
        category: 'Nurse',
        location: 'Deva ICU & Trauma Pavilion',
        description:
          'We are recruiting experienced Charge Nurses to oversee 24/7 nursing operations across our 28-bed state-of-the-art Intensive Care Unit. Responsibilities include clinical patient care oversight, rapid response coordination, nursing staff scheduling, and adherence to strict international critical care protocols.',
        requirements:
          '• Bachelor of Science in Nursing (BSN) or equivalent from an accredited institution.\n• Valid RN license with Critical Care Registered Nurse (CCRN) certification preferred.\n• Minimum of 4 years of acute ICU or trauma critical care nursing experience.\n• Valid ACLS, BLS, and PALS certifications.\n• Strong leadership and crisis management competencies.',
        deadline: addDays(21),
        number_of_positions: 5,
        status: 'open',
      },
      {
        title: 'Senior Medical Laboratory Technologist',
        department: 'Pathology & Diagnostic Laboratory',
        category: 'Laboratory',
        location: 'Deva Clinical Labs, Suite B',
        description:
          'Responsible for conducting complex hematological, microbiological, histological, and biochemical diagnostic assays using automated clinical analyzers and molecular diagnostics systems. Ensures rigorous quality control and fast turnaround times for emergency and surgical units.',
        requirements:
          '• Bachelor of Medical Laboratory Science (BMLS) or equivalent.\n• Professional registration with relevant Medical Laboratory Council.\n• Minimum 3 years clinical diagnostic experience in hematology/microbiology.\n• Familiarity with automated analyzers (Roche, Abbott) and LIMS software.',
        deadline: addDays(18),
        number_of_positions: 3,
        status: 'open',
      },
      {
        title: 'Clinical Pharmacist Specialist',
        department: 'Pharmacy Services',
        category: 'Pharmacy',
        location: 'Deva Inpatient & Oncology Pharmacy',
        description:
          'Provide direct patient pharmaceutical care, review inpatient medication orders, perform therapeutic drug monitoring, calculate chemotherapy regimens, and consult with medical teams on antimicrobial stewardship and clinical pharmacology.',
        requirements:
          '• Doctor of Pharmacy (PharmD) or B.Pharm with clinical specialization.\n• Registered Pharmacist license in good standing.\n• Minimum 2 years of hospital pharmacy or clinical oncology pharmacy experience.\n• Strong knowledge of pharmacokinetics and sterile compounding protocols.',
        deadline: addDays(30),
        number_of_positions: 4,
        status: 'open',
      },
      {
        title: 'Emergency Medicine Registrar',
        department: 'Emergency & Trauma Center',
        category: 'Physician',
        location: 'Deva Level 1 Trauma Wing',
        description:
          'Join our busy 24-hour Emergency Department. Triage acute medical and surgical emergencies, conduct resuscitation, stabilize critically injured patients, and collaborate with trauma surgeons and critical care teams.',
        requirements:
          '• MBBS / MBChB or equivalent medical degree.\n• Completion of internship and at least 2 years in emergency or acute care medicine.\n• Current ATLS, ACLS, and BLS certification.\n• Excellent diagnostic acumen and calm demeanor under intense emergency pressures.',
        deadline: addDays(14),
        number_of_positions: 4,
        status: 'open',
      },
      {
        title: 'Senior Radiographer / MRI Specialist',
        department: 'Radiology & Medical Imaging',
        category: 'Allied Health',
        location: 'Deva Advanced Diagnostic Imaging Center',
        description:
          'Operate 3.0T MRI, 128-slice CT scanners, and digital fluoroscopy equipment. Ensure high-resolution diagnostic imaging while prioritizing radiation safety and patient comfort.',
        requirements:
          '• Bachelor of Science in Radiography or Medical Imaging.\n• Valid professional licensing.\n• Minimum 3 years specialized MRI/CT clinical experience.\n• Proficiency in PACS and RIS software systems.',
        deadline: addDays(25),
        number_of_positions: 2,
        status: 'open',
      },
      {
        title: 'Hospital Operations & Admissions Coordinator',
        department: 'Patient Services & Hospital Administration',
        category: 'Administration',
        location: 'Deva Patient Services Center',
        description:
          'Coordinate inpatient admissions, liaise with medical insurance providers, oversee patient registration workflows, and ensure outstanding patient advocacy and healthcare compliance.',
        requirements:
          '• Bachelor degree in Healthcare Administration, Business, or Public Health.\n• 2+ years of experience in hospital front-office or healthcare operations.\n• Proficient in Electronic Health Records (EHR/HIS) and insurance billing.\n• Exceptional multilingual communication skills.',
        deadline: addDays(35),
        number_of_positions: 2,
        status: 'open',
      },
      {
        title: 'Pediatric Specialist Resident',
        department: 'Pediatrics & Neonatal Care',
        category: 'Physician',
        location: 'Deva Children’s Hospital Pavilion',
        description:
          'Provide compassionate, evidence-based care in general pediatrics, pediatric emergency, and neonatal intensive care unit (NICU). Participate in pediatric code teams and clinical audit meetings.',
        requirements:
          '• MD / MBBS with completed pediatric residency credits.\n• Neonatal Resuscitation Program (NRP) and PALS certified.\n• Passion for pediatric inpatient and ambulatory healthcare.\n• Strong family-centered communication skills.',
        deadline: addDays(12),
        number_of_positions: 3,
        status: 'open',
      },
    ];

    initialJobs.forEach((job) => {
      this.jobs.push({
        id: this.nextJobId++,
        ...job,
        created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      });
    });
  }

  // --- Users Table Operations ---
  public getUserByEmail(email: string): User | undefined {
    if (!email) return undefined;
    const clean = email.trim().toLowerCase();
    return this.users.find((u) => u.email.toLowerCase() === clean);
  }

  public getUserByUsernameOrEmail(identifier: string): User | undefined {
    if (!identifier) return undefined;
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');
    return this.users.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        (u.username && u.username.toLowerCase() === clean) ||
        u.full_name.toLowerCase() === clean ||
        (cleanDigits.length >= 7 && u.phone.replace(/\D/g, '').includes(cleanDigits)) ||
        (u.role === 'admin' && (clean === 'admin' || clean === 'admin@devahospital.org' || clean === 'admin@devahospital.com'))
    );
  }

  public getUserById(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  public createUser(userData: {
    full_name: string;
    email: string;
    phone: string;
    username?: string;
    password_hash: string;
    role?: 'applicant' | 'admin';
  }): User {
    const rawUsername = userData.username ? userData.username.trim() : userData.email.split('@')[0].trim();
    const newUser: User = {
      id: this.nextUserId++,
      full_name: userData.full_name.trim(),
      email: userData.email.trim().toLowerCase(),
      phone: userData.phone.trim(),
      username: rawUsername,
      password_hash: userData.password_hash,
      role: userData.role || 'applicant',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.users.push(newUser);
    this.persist();
    return newUser;
  }

  public updateUser(
    id: number,
    data: { full_name?: string; email?: string; phone?: string; username?: string; password_hash?: string }
  ): User | null {
    const user = this.getUserById(id);
    if (!user) return null;

    if (data.full_name) user.full_name = data.full_name.trim();
    if (data.email) user.email = data.email.trim().toLowerCase();
    if (data.phone) user.phone = data.phone.trim();
    if (data.username) user.username = data.username.trim();
    if (data.password_hash) user.password_hash = data.password_hash;
    user.updated_at = new Date().toISOString();

    this.persist();
    return user;
  }

  // --- Jobs Table Operations ---
  public getJobs(filters?: {
    category?: string;
    department?: string;
    location?: string;
    search?: string;
    status?: JobStatus;
  }): Job[] {
    const today = new Date().toISOString().split('T')[0];

    return this.jobs
      .map((job) => {
        // Auto-mark expired if deadline has passed and not manually closed
        if (job.deadline < today && job.status === 'open') {
          job.status = 'expired';
        }
        return job;
      })
      .filter((job) => {
        if (filters?.status && job.status !== filters.status) return false;
        if (filters?.category && filters.category !== 'All' && job.category !== filters.category) return false;
        if (filters?.department && filters.department !== 'All' && !job.department.toLowerCase().includes(filters.department.toLowerCase())) return false;
        if (filters?.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
        if (filters?.search) {
          const s = filters.search.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(s);
          const matchDept = job.department.toLowerCase().includes(s);
          const matchDesc = job.description.toLowerCase().includes(s);
          const matchReq = job.requirements.toLowerCase().includes(s);
          if (!matchTitle && !matchDept && !matchDesc && !matchReq) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getJobById(id: number): Job | undefined {
    const today = new Date().toISOString().split('T')[0];
    const job = this.jobs.find((j) => j.id === id);
    if (job && job.deadline < today && job.status === 'open') {
      job.status = 'expired';
    }
    return job;
  }

  public createJob(jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Job {
    const newJob: Job = {
      id: this.nextJobId++,
      ...jobData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.jobs.unshift(newJob);
    this.persist();
    return newJob;
  }

  public updateJob(id: number, jobData: Partial<Omit<Job, 'id' | 'created_at' | 'updated_at'>>): Job | null {
    const job = this.getJobById(id);
    if (!job) return null;

    Object.assign(job, jobData, { updated_at: new Date().toISOString() });
    this.persist();
    return job;
  }

  public deleteJob(id: number): boolean {
    const index = this.jobs.findIndex((j) => j.id === id);
    if (index === -1) return false;

    this.jobs.splice(index, 1);
    this.persist();
    return true;
  }

  // --- Applications Table Operations ---
  public hasUserApplied(userId: number, jobId: number): boolean {
    return this.applications.some((app) => app.user_id === userId && app.job_id === jobId);
  }

  public createApplication(data: {
    userId: number;
    jobId: number;
    notes?: string;
    years_of_experience?: string;
    license_number?: string;
    qualification?: string;
    current_employer?: string;
    notice_period?: string;
  }): Application {
    const { userId, jobId, notes, years_of_experience, license_number, qualification, current_employer, notice_period } = data;
    // Enforce Rule 4: Unique constraint on user_id + job_id
    if (this.hasUserApplied(userId, jobId)) {
      throw new Error('You have already submitted an application for this position.');
    }

    const newApp: Application = {
      id: this.nextApplicationId++,
      user_id: userId,
      job_id: jobId,
      status: 'Submitted',
      notes,
      years_of_experience,
      license_number,
      qualification,
      current_employer,
      notice_period,
      responses: [],
      applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.applications.unshift(newApp);
    this.persist();
    return newApp;
  }

  public getApplicationById(id: number): Application | undefined {
    const app = this.applications.find((a) => a.id === id);
    if (!app) return undefined;

    const user = this.getUserById(app.user_id);
    const job = this.getJobById(app.job_id);
    const documents = this.getDocumentsByApplicationId(app.id);

    return {
      ...app,
      user: user
        ? {
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            username: user.username,
          }
        : undefined,
      job: job
        ? {
            title: job.title,
            department: job.department,
            category: job.category,
            deadline: job.deadline,
            location: job.location,
          }
        : undefined,
      documents,
    };
  }

  public getUserApplications(userId: number): Application[] {
    return this.applications
      .filter((a) => a.user_id === userId)
      .map((app) => {
        const job = this.getJobById(app.job_id);
        const docs = this.getDocumentsByApplicationId(app.id);
        return {
          ...app,
          job: job
            ? {
                title: job.title,
                department: job.department,
                category: job.category,
                deadline: job.deadline,
                location: job.location,
              }
            : undefined,
          documents: docs,
        };
      })
      .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime());
  }

  public getAllApplications(filters?: { status?: ApplicationStatus; jobId?: number; search?: string }): Application[] {
    return this.applications
      .filter((app) => {
        if (filters?.status && filters.status !== ('All' as any) && app.status !== filters.status) return false;
        if (filters?.jobId && app.job_id !== filters.jobId) return false;
        if (filters?.search) {
          const user = this.getUserById(app.user_id);
          const job = this.getJobById(app.job_id);
          const s = filters.search.toLowerCase();
          const matchUser =
            user?.full_name.toLowerCase().includes(s) ||
            user?.email.toLowerCase().includes(s) ||
            (user?.username && user.username.toLowerCase().includes(s)) ||
            (app.license_number && app.license_number.toLowerCase().includes(s));
          const matchJob = job?.title.toLowerCase().includes(s) || job?.department.toLowerCase().includes(s);
          const matchNotes = app.notes?.toLowerCase().includes(s) || app.admin_response?.toLowerCase().includes(s);
          if (!matchUser && !matchJob && !matchNotes) return false;
        }
        return true;
      })
      .map((app) => {
        const user = this.getUserById(app.user_id);
        const job = this.getJobById(app.job_id);
        const docs = this.getDocumentsByApplicationId(app.id);
        return {
          ...app,
          user: user
            ? {
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                username: user.username,
              }
            : undefined,
          job: job
            ? {
                title: job.title,
                department: job.department,
                category: job.category,
                deadline: job.deadline,
                location: job.location,
              }
            : undefined,
          documents: docs,
        };
      })
      .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime());
  }

  public updateApplicationStatus(
    id: number,
    status: ApplicationStatus,
    responsePayload?: {
      message?: string;
      sender_name?: string;
      sender_role?: string;
      subject?: string;
      interview_details?: {
        date?: string;
        time?: string;
        location?: string;
        format?: 'In-Person (Deva Hospital)' | 'Online Video Call' | 'Phone Interview';
        instructions?: string;
      };
    }
  ): Application | null {
    const app = this.applications.find((a) => a.id === id);
    if (!app) return null;

    app.status = status;
    app.decision_date = new Date().toISOString();
    app.updated_at = new Date().toISOString();

    const job = this.getJobById(app.job_id);
    const jobTitle = job?.title || 'Healthcare Position';

    let effectiveMessage = responsePayload?.message?.trim();
    let effectiveSubject = responsePayload?.subject?.trim();

    if (!effectiveMessage) {
      if (status === 'Accepted') {
        effectiveSubject = `Official Offer of Appointment & Acceptance Notice — ${jobTitle}`;
        effectiveMessage = `Dear Candidate,\n\nOn behalf of the Management and Medical Advisory Board of Deva Central Hospital, we are pleased to officially inform you that your application for ${jobTitle} has been ACCEPTED.\n\nOur HR Onboarding Directorate will contact you within two business days regarding orientation, licensing verification, and contract preparation. Congratulations!`;
      } else if (status === 'Interview Scheduled') {
        effectiveSubject = `Clinical Interview Shortlist Notice — ${jobTitle}`;
        effectiveMessage = `Dear Candidate,\n\nFollowing credential triage, you have been shortlisted for a clinical interview for the position of ${jobTitle}. Please review your schedule details.`;
      } else if (status === 'Rejected') {
        effectiveSubject = `Application Review Notice — ${jobTitle}`;
        effectiveMessage = `Dear Candidate,\n\nThank you for applying to Deva Central Hospital. After evaluation of candidate credentials against current departmental requirements, we regret to inform you that your application was not selected for this opening. Your profile remains in our talent database for future vacancies.`;
      } else if (status === 'Under Review') {
        effectiveSubject = `Application Under Active Review — ${jobTitle}`;
        effectiveMessage = `Dear Candidate,\n\nYour application and verified documents have passed intake screening and are currently being evaluated by the Departmental Clinical Committee.`;
      }
    }

    if (effectiveMessage) {
      app.admin_response = effectiveMessage;
      app.admin_response_date = new Date().toISOString();
      app.admin_responder_name = responsePayload?.sender_name || 'Dr. Evelyn Vance (Chief of HR)';
    }

    if (responsePayload?.interview_details) {
      app.interview_details = responsePayload.interview_details;
    }

    if (!app.responses) app.responses = [];
    if (effectiveMessage || responsePayload?.interview_details) {
      app.responses.push({
        id: app.responses.length + 1,
        application_id: app.id,
        sender_name: responsePayload?.sender_name || 'Dr. Evelyn Vance (Chief of HR)',
        sender_role: responsePayload?.sender_role || 'Hospital Recruitment Directorate',
        subject: effectiveSubject || `Application Status Update: ${status}`,
        message: effectiveMessage || `Status updated to ${status}.`,
        status_at_time: status,
        interview_details: responsePayload?.interview_details,
        created_at: new Date().toISOString(),
      });
    }

    this.persist();
    return this.getApplicationById(id) || null;
  }

  public addApplicationResponse(
    id: number,
    payload: {
      sender_name?: string;
      sender_role?: string;
      subject: string;
      message: string;
      status?: ApplicationStatus;
      interview_details?: {
        date?: string;
        time?: string;
        location?: string;
        format?: 'In-Person (Deva Hospital)' | 'Online Video Call' | 'Phone Interview';
        instructions?: string;
      };
    }
  ): Application | null {
    const app = this.applications.find((a) => a.id === id);
    if (!app) return null;

    if (payload.status) {
      app.status = payload.status;
      app.decision_date = new Date().toISOString();
    }
    app.admin_response = payload.message;
    app.admin_response_date = new Date().toISOString();
    app.admin_responder_name = payload.sender_name || 'Dr. Evelyn Vance (Chief of HR)';
    app.updated_at = new Date().toISOString();

    if (payload.interview_details) {
      app.interview_details = payload.interview_details;
    }

    if (!app.responses) app.responses = [];
    app.responses.push({
      id: app.responses.length + 1,
      application_id: app.id,
      sender_name: payload.sender_name || 'Dr. Evelyn Vance (Chief of HR)',
      sender_role: payload.sender_role || 'Hospital Recruitment Committee',
      subject: payload.subject,
      message: payload.message,
      status_at_time: app.status,
      interview_details: payload.interview_details,
      created_at: new Date().toISOString(),
    });

    this.persist();
    return this.getApplicationById(id) || null;
  }

  // --- Documents Table Operations ---
  public getNextDocId(): number {
    return this.nextDocId++;
  }

  public addDocument(doc: DocumentRecord): DocumentRecord {
    if (!doc.id) {
      doc.id = this.nextDocId++;
    } else {
      this.nextDocId = Math.max(this.nextDocId, doc.id + 1);
    }
    // Ensure standard view URL if missing or if data URL
    if (!doc.file_url || doc.file_url.startsWith('data:')) {
      doc.file_url = `/api/documents/${doc.id}/view`;
    }
    this.documents.push(doc);
    this.persist();
    return doc;
  }

  public getDocumentById(id: number): DocumentRecord | undefined {
    return this.documents.find((d) => d.id === id);
  }

  public getDocumentsByApplicationId(applicationId: number): DocumentRecord[] {
    return this.documents.filter((d) => d.application_id === applicationId);
  }

  // --- Admin Analytics ---
  public getAdminStats(): AdminStats {
    const today = new Date().toISOString().split('T')[0];
    const activeJobs = this.jobs.filter((j) => j.status === 'open' && j.deadline >= today).length;
    const submitted = this.applications.filter((a) => a.status === 'Submitted').length;
    const underReview = this.applications.filter((a) => a.status === 'Under Review').length;
    const interviewScheduled = this.applications.filter((a) => a.status === 'Interview Scheduled').length;
    const accepted = this.applications.filter((a) => a.status === 'Accepted').length;
    const rejected = this.applications.filter((a) => a.status === 'Rejected').length;

    const uniqueDepts = new Set(this.jobs.map((j) => j.department)).size;
    const totalCandidates = this.users.filter((u) => u.role === 'applicant').length;

    return {
      total_jobs: this.jobs.length,
      active_jobs: activeJobs,
      open_jobs: activeJobs,
      total_applications: this.applications.length,
      total_candidates: totalCandidates,
      submitted: submitted,
      submitted_applications: submitted,
      under_review_applications: underReview,
      interview_scheduled_applications: interviewScheduled,
      accepted: accepted,
      accepted_applications: accepted,
      rejected: rejected,
      rejected_applications: rejected,
      departments_count: uniqueDepts,
    };
  }

  // Re-seed utility for reset testing
  public resetToSeeds() {
    this.users = [];
    this.jobs = [];
    this.applications = [];
    this.documents = [];
    this.nextUserId = 1;
    this.nextJobId = 1;
    this.nextApplicationId = 1;
    this.nextDocId = 1;
    this.seedDatabase();
    this.persist();
  }
}

export const db = new RelationalDatabase();
