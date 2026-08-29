export type UserRole = 'applicant' | 'admin';

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  username?: string;
  role: UserRole;
}

export type JobCategory =
  | 'Physician'
  | 'Nurse'
  | 'Allied Health'
  | 'Administration'
  | 'Laboratory'
  | 'Pharmacy'
  | 'Other Healthcare Positions';

export type JobStatus = 'open' | 'closed' | 'expired';

export interface Job {
  id: number;
  title: string;
  department: string;
  category: JobCategory;
  location: string;
  description: string;
  requirements: string;
  deadline: string; // YYYY-MM-DD
  number_of_positions: number;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Interview Scheduled'
  | 'Accepted'
  | 'Rejected';

export interface InterviewDetails {
  date?: string;
  time?: string;
  location?: string;
  format?: 'In-Person (Deva Hospital)' | 'Online Video Call' | 'Phone Interview';
  instructions?: string;
}

export interface ApplicationResponse {
  id: number;
  application_id: number;
  sender_name: string;
  sender_role: string;
  subject: string;
  message: string;
  status_at_time: ApplicationStatus;
  interview_details?: InterviewDetails;
  created_at: string;
}

export type DocumentType = 'cv' | 'application_letter' | 'national_id' | 'certificate';

export interface DocumentRecord {
  id: number;
  application_id: number;
  document_type: DocumentType;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  storage_id: string;
  created_at: string;
}

export interface Application {
  id: number;
  user_id: number;
  job_id: number;
  status: ApplicationStatus;
  notes?: string;
  // Additional applicant stated information
  years_of_experience?: string;
  license_number?: string;
  qualification?: string;
  current_employer?: string;
  notice_period?: string;

  // Admin response & management
  admin_response?: string;
  admin_response_date?: string;
  admin_responder_name?: string;
  interview_details?: InterviewDetails;
  responses?: ApplicationResponse[];

  decision_date?: string;
  applied_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    email: string;
    phone: string;
    username?: string;
  };
  job?: {
    title: string;
    department: string;
    category: JobCategory;
    deadline: string;
    location: string;
  };
  documents?: DocumentRecord[];
}

export type EmailType =
  | 'submitted_confirmation'
  | 'accepted_notification'
  | 'rejected_notification'
  | 'interview_notification'
  | 'status_update_notification'
  | 'admin_response_notification';

export interface EmailLog {
  id: number;
  recipient_email: string;
  recipient_name: string;
  subject: string;
  email_type: EmailType;
  application_id: number;
  status: 'sent' | 'delivered' | 'failed';
  sent_at: string;
  body_preview?: string;
}

export interface AdminStats {
  total_jobs: number;
  active_jobs: number;
  total_applications: number;
  submitted_applications: number;
  under_review_applications: number;
  interview_scheduled_applications: number;
  accepted_applications: number;
  rejected_applications: number;
  departments_count: number;
}

export interface JobFilters {
  category: string;
  department: string;
  location: string;
  search: string;
  status?: JobStatus;
}

