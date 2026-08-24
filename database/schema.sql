-- ====================================================================
-- DEVA HOSPITAL RECRUITMENT SYSTEM — PRODUCTION MYSQL DATABASE SCHEMA
-- Compatible with MySQL 8.0+, MariaDB, and Cloud SQL
-- ====================================================================

CREATE DATABASE IF NOT EXISTS deva_hospital_recruitment
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE deva_hospital_recruitment;

-- 1. USERS TABLE
-- Stores both applicants and hospital administrators
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('applicant', 'admin') NOT NULL DEFAULT 'applicant',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. JOBS TABLE
-- Stores healthcare vacancies and clinical/administrative roles
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  department VARCHAR(100) NOT NULL,
  category ENUM(
    'Physician',
    'Nurse',
    'Allied Health',
    'Administration',
    'Laboratory',
    'Pharmacy',
    'Other Healthcare Positions'
  ) NOT NULL,
  location VARCHAR(100) NOT NULL DEFAULT 'Deva Central Hospital Campus',
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  deadline DATE NOT NULL,
  number_of_positions INT NOT NULL DEFAULT 1,
  status ENUM('open', 'closed', 'expired') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_jobs_status (status),
  INDEX idx_jobs_category (category),
  INDEX idx_jobs_deadline (deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. APPLICATIONS TABLE
-- Stores submissions linked to applicants and jobs with strict 1-to-1 uniqueness
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  job_id INT NOT NULL,
  status ENUM('Submitted', 'Accepted', 'Rejected') NOT NULL DEFAULT 'Submitted',
  notes TEXT NULL,
  decision_date TIMESTAMP NULL,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  CONSTRAINT fk_app_user FOREIGN KEY (user_id) 
    REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_app_job FOREIGN KEY (job_id) 
    REFERENCES jobs (id) ON DELETE RESTRICT,
    
  -- Rule 4: Applicant cannot apply twice for the same job
  CONSTRAINT uq_user_job UNIQUE (user_id, job_id),
  
  INDEX idx_applications_user (user_id),
  INDEX idx_applications_job (job_id),
  INDEX idx_applications_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. DOCUMENTS TABLE
-- Stores metadata and cloud URLs for applicant files
CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  document_type ENUM('cv', 'application_letter', 'national_id', 'certificate') NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INT NOT NULL, -- Size in bytes
  mime_type VARCHAR(100) NOT NULL,
  storage_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key to applications
  CONSTRAINT fk_doc_app FOREIGN KEY (application_id) 
    REFERENCES applications (id) ON DELETE CASCADE,
    
  INDEX idx_documents_app (application_id),
  INDEX idx_documents_type (document_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. EMAIL NOTIFICATIONS AUDIT TABLE
-- Tracks all automated transactional emails sent to applicants
CREATE TABLE IF NOT EXISTS email_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipient_email VARCHAR(191) NOT NULL,
  recipient_name VARCHAR(150) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  email_type ENUM('submitted_confirmation', 'accepted_notification', 'rejected_notification') NOT NULL,
  application_id INT NULL,
  status ENUM('sent', 'delivered', 'failed') NOT NULL DEFAULT 'sent',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_email_app FOREIGN KEY (application_id) 
    REFERENCES applications (id) ON DELETE SET NULL,
    
  INDEX idx_email_logs_recipient (recipient_email),
  INDEX idx_email_logs_type (email_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SEED DATA: INITIAL ADMINISTRATOR ACCOUNT AND SAMPLE HEALTHCARE JOBS
-- ====================================================================

-- Initial Hospital Administrator
-- Default credentials: admin@devahospital.org / Admin@Deva2026!
-- (Password hash generated using bcrypt 10 rounds)
INSERT INTO users (full_name, email, phone, password_hash, role)
VALUES (
  'Deva Hospital HR Director',
  'admin@devahospital.org',
  '+1 (800) 555-0199',
  '$2a$10$7qB2vV91o1a7jCj5QxXhfeYn9O8V84TqS7sE90V.3iQvY2z3y0D8K',
  'admin'
) ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- Sample Healthcare Vacancies
INSERT INTO jobs (title, department, category, location, description, requirements, deadline, number_of_positions, status)
VALUES 
(
  'Senior Consultant Cardiologist',
  'Cardiology & Interventional Medicine',
  'Physician',
  'Deva Main Hospital Tower, Level 4',
  'Deva Hospital is seeking a board-certified Senior Consultant Cardiologist to lead our cardiac catheterization laboratory and clinical diagnostic cardiology team. The role entails providing high-level specialized cardiology consultations, performing coronary interventions, participating in multi-disciplinary heart team reviews, and mentoring post-graduate medical residents.',
  '• MD or equivalent medical degree with specialization in Cardiology.\n• Board certification or valid specialist registration.\n• Minimum of 7 years of post-specialist clinical cardiology experience.\n• Proven expertise in echocardiography, angiography, and coronary interventions.\n• Active medical license in good standing.',
  DATE_ADD(CURRENT_DATE(), INTERVAL 28 DAY),
  2,
  'open'
),
(
  'Charge Nurse — Intensive Care Unit (ICU)',
  'Critical Care Services',
  'Nurse',
  'Deva ICU & Trauma Pavilion',
  'We are recruiting experienced Charge Nurses to oversee 24/7 nursing operations across our 28-bed state-of-the-art Intensive Care Unit. Responsibilities include clinical patient care oversight, rapid response coordination, nursing staff scheduling, and adherence to strict international critical care protocols.',
  '• Bachelor of Science in Nursing (BSN) or equivalent from an accredited institution.\n• Valid RN license with Critical Care Registered Nurse (CCRN) certification preferred.\n• Minimum of 4 years of acute ICU or trauma critical care nursing experience.\n• Valid ACLS, BLS, and PALS certifications.\n• Strong leadership and crisis management competencies.',
  DATE_ADD(CURRENT_DATE(), INTERVAL 21 DAY),
  5,
  'open'
),
(
  'Senior Medical Laboratory Technologist',
  'Pathology & Diagnostic Laboratory',
  'Laboratory',
  'Deva Clinical Labs, Suite B',
  'Responsible for conducting complex hematological, microbiological, histological, and biochemical diagnostic assays using automated clinical analyzers and molecular diagnostics systems. Ensures rigorous quality control and fast turnaround times for emergency and surgical units.',
  '• Bachelor of Medical Laboratory Science (BMLS) or equivalent.\n• Professional registration with relevant Medical Laboratory Council.\n• Minimum 3 years clinical diagnostic experience in hematology/microbiology.\n• Familiarity with automated analyzers (Roche, Abbott) and LIMS software.',
  DATE_ADD(CURRENT_DATE(), INTERVAL 18 DAY),
  3,
  'open'
),
(
  'Clinical Pharmacist Specialist',
  'Pharmacy Services',
  'Pharmacy',
  'Deva Inpatient & Oncology Pharmacy',
  'Provide direct patient pharmaceutical care, review inpatient medication orders, perform therapeutic drug monitoring, calculate chemotherapy regimens, and consult with medical teams on antimicrobial stewardship and clinical pharmacology.',
  '• Doctor of Pharmacy (PharmD) or B.Pharm with clinical specialization.\n• Registered Pharmacist license.\n• Minimum 2 years of hospital pharmacy or clinical oncology pharmacy experience.\n• Strong knowledge of pharmacokinetics and sterile compounding protocols.',
  DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY),
  4,
  'open'
),
(
  'Emergency Medicine Registrar',
  'Emergency & Trauma Center',
  'Physician',
  'Deva Level 1 Trauma Wing',
  'Join our busy 24-hour Emergency Department. Triage acute medical and surgical emergencies, conduct resuscitation, stabilize critically injured patients, and collaborate with trauma surgeons and critical care teams.',
  '• MBBS / MBChB or equivalent medical degree.\n• Completion of internship and at least 2 years in emergency or acute care medicine.\n• Current ATLS, ACLS, and BLS certification.\n• Excellent diagnostic acumen and calm demeanor under intense emergency pressures.',
  DATE_ADD(CURRENT_DATE(), INTERVAL 14 DAY),
  4,
  'open'
),
(
  'Hospital Operations & Admissions Coordinator',
  'Patient Services & Hospital Administration',
  'Administration',
  'Deva Patient Services Center',
  'Coordinate inpatient admissions, liaise with medical insurance providers, oversee patient registration workflows, and ensure outstanding patient advocacy and healthcare compliance.',
  '• Bachelor degree in Healthcare Administration, Business, or Public Health.\n• 2+ years of experience in hospital front-office or healthcare operations.\n• Proficient in Electronic Health Records (EHR/HIS) and insurance billing.\n• Exceptional multilingual communication skills.',
  DATE_ADD(CURRENT_DATE(), INTERVAL 35 DAY),
  2,
  'open'
);
