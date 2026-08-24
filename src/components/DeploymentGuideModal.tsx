import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Copy,
  Terminal,
  Database,
  Server,
  KeyRound,
  Briefcase,
  UploadCloud,
  Mail,
  ShieldCheck,
  Globe,
  GitBranch,
  FileCode,
  Layers,
} from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Stage {
  id: number;
  title: string;
  category: string;
  icon: any;
  overview: string;
  files: string[];
  packages: string[];
  commands: string[];
  explanation: string;
  testingSteps: string[];
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: 'Stage 1: Project Setup & Full-Stack Architecture',
    category: 'Architecture',
    icon: Layers,
    overview: 'Establish the unified React 19 + Node/Express TypeScript architecture with Vite build pipelines.',
    files: ['package.json', 'tsconfig.json', 'vite.config.ts', 'server.ts', '.env.example'],
    packages: ['express', 'vite', '@vitejs/plugin-react', 'dotenv', 'tailwindcss', 'tsx', 'esbuild'],
    commands: ['npm install', 'npm run dev'],
    explanation: 'Configures full-stack execution where Express handles /api routes and seamlessly mounts Vite middleware in development while serving the static bundle in production on port 3000.',
    testingSteps: ['Run `npm run dev` and confirm server listens on http://0.0.0.0:3000.', 'Verify /api/health returns `{ status: "ok" }`.'],
  },
  {
    id: 2,
    title: 'Stage 2: MySQL Database & Relational Schema',
    category: 'Database',
    icon: Database,
    overview: 'Design production-grade MySQL schema with strict foreign keys, indexes, and UNIQUE(user_id, job_id) constraints.',
    files: ['/database/schema.sql', '/server/db.ts'],
    packages: ['mysql2 (or cloud sql connector)', 'bcryptjs'],
    commands: ['mysql -u root -p < database/schema.sql'],
    explanation: 'Creates normalized tables: `users` (applicants and admin with bcrypt hashes), `jobs` (healthcare openings with category and deadline), `applications` (strictly 1-to-1 per job with UNIQUE constraint), `documents` (cloud-hosted URLs and MIME metadata), and `email_logs` (transactional delivery audit trail).',
    testingSteps: ['Run schema.sql in MySQL Workbench or terminal.', 'Verify foreign key cascade rules on application deletion.', 'Test inserting duplicate user_id + job_id to verify UNIQUE constraint rejects it.'],
  },
  {
    id: 3,
    title: 'Stage 3: Express Backend Engine & REST APIs',
    category: 'Backend',
    icon: Server,
    overview: 'Implement modular REST controllers, CORS protection, JSON payload parsers, and centralized error handling.',
    files: ['server.ts', 'server/types.ts'],
    packages: ['express', 'cors'],
    commands: ['npx tsx server.ts'],
    explanation: 'Mounts clean routing modules at `/api/auth`, `/api/jobs`, `/api/applications`, and `/api/admin` with typed request handlers.',
    testingSteps: ['Send GET /api/health to confirm JSON payload response.', 'Verify CORS allows secure cross-origin queries.'],
  },
  {
    id: 4,
    title: 'Stage 4: Secure Authentication & JWT Middleware',
    category: 'Security',
    icon: KeyRound,
    overview: 'Bcrypt password hashing (10 salt rounds), JWT signing, role-based protection (applicant vs admin).',
    files: ['/server/authMiddleware.ts', '/server/routes/auth.ts', '/src/context/AuthContext.tsx'],
    packages: ['bcryptjs', 'jsonwebtoken', '@types/bcryptjs', '@types/jsonwebtoken'],
    commands: ['npm test auth'],
    explanation: 'Validates registrations (email format, password matching, phone formatting), hashes credentials, produces 7-day signed JWTs, and exposes `requireAuth` and `requireAdmin` middleware.',
    testingSteps: ['Register a new applicant account.', 'Attempt duplicate registration with same email (must return 409 Conflict).', 'Sign in as Admin (`admin@devahospital.org`) and verify admin claims.'],
  },
  {
    id: 5,
    title: 'Stage 5: Healthcare Job Vacancies Engine',
    category: 'Job Engine',
    icon: Briefcase,
    overview: 'Public job filtering (Physician, Nurse, Allied Health, Labs) and Admin CRUD pipeline.',
    files: ['/server/routes/jobs.ts', '/src/components/JobSearchFilter.tsx', '/src/components/JobCard.tsx'],
    packages: ['lucide-react'],
    commands: ['GET /api/jobs?category=Nurse'],
    explanation: 'Auto-calculates expiration against deadlines. Provides instant multi-filter search (category pills, department dropdown, keyword search).',
    testingSteps: ['Filter jobs by "Physician" and verify filtered count.', 'Check that expired jobs show the "Expired" badge and disable direct application.'],
  },
  {
    id: 6,
    title: 'Stage 6: Multi-Document Application Pipeline',
    category: 'Applications',
    icon: UploadCloud,
    overview: 'Submission flow enforcing Rule 1 (Auth), Rule 2 (Required files), Rule 3 (Deadline), Rule 4 (Unique submission).',
    files: ['/server/routes/applications.ts', '/src/components/ApplicationModal.tsx'],
    packages: ['multer', '@types/multer'],
    commands: ['POST /api/applications'],
    explanation: 'Accepts CV (required), Application Letter (required), National ID (required), and Multiple Certificates (required) with MIME-type inspection.',
    testingSteps: ['Submit an application with all 4 document types.', 'Attempt applying a second time to the same position (must display "You have already submitted an application").'],
  },
  {
    id: 7,
    title: 'Stage 7: Cloud Storage & In-Memory Fallback',
    category: 'Storage',
    icon: Globe,
    overview: 'Persistent cloud file storage configuration (Cloudinary / Supabase / AWS S3) with secure document URLs.',
    files: ['/server/storageService.ts', '/src/components/DocumentViewerModal.tsx'],
    packages: ['multer'],
    commands: ['Validate 10MB limits'],
    explanation: 'Stores documents in cloud object storage and records immutable `storage_id`, `file_url`, and `mime_type` records in MySQL.',
    testingSteps: ['Open Document Viewer in Admin Dossier.', 'Download and preview CV, Letter, and Certificates.'],
  },
  {
    id: 8,
    title: 'Stage 8: Automated Transactional Email Notifications',
    category: 'Email',
    icon: Mail,
    overview: 'Predefined professional hospital templates (Application Received, Application Accepted, Application Rejected).',
    files: ['/server/emailService.ts'],
    packages: ['Resend API / Transactional Dispatcher'],
    commands: ['POST https://api.resend.com/emails'],
    explanation: 'Dispatches high-contrast, responsive HTML email templates with official Hospital Header, reference tracking number, and credentialing instructions.',
    testingSteps: ['Submit application -> confirm "Application Received" email log.', 'Change status to Accepted -> verify "Offer Notice" email log.', 'Change status to Rejected -> verify respectful rejection notice.'],
  },
  {
    id: 9,
    title: 'Stage 9: Hospital Administrator Suite',
    category: 'Admin',
    icon: ShieldCheck,
    overview: 'Executive recruitment dashboard with KPI cards, searchable applicant tables, document viewers, and status triggers.',
    files: ['/src/views/AdminDashboardView.tsx', '/src/components/AdminStatusConfirmModal.tsx', '/server/routes/admin.ts'],
    packages: ['lucide-react', 'motion'],
    commands: ['GET /api/admin/stats'],
    explanation: 'Provides full administrative control: view applications, review documents in modal, execute Accepted/Rejected status changes with live email preview.',
    testingSteps: ['Log in as Admin.', 'Review candidate application dossier.', 'Switch candidate from Submitted -> Accepted.'],
  },
  {
    id: 10,
    title: 'Stage 10: Modern Healthcare UI & Responsive Design',
    category: 'Frontend',
    icon: FileCode,
    overview: 'Clean, modern typography pairing, subtle medical abstract gradients, mobile hamburger drawer, accessible WCAG AA contrast.',
    files: ['/src/App.tsx', '/src/index.css', '/src/views/HomeView.tsx', '/src/views/JobsView.tsx'],
    packages: ['@tailwindcss/vite', 'motion'],
    commands: ['npm run build'],
    explanation: 'Desktop-first precision with mobile-first code. Beautiful cards with hover elevations, progress bars, and zero UI slop.',
    testingSteps: ['Resize browser window to mobile (<640px).', 'Open mobile hamburger menu and test navigation.'],
  },
  {
    id: 11,
    title: 'Stage 11: Security Hardening & Complete Testing Checklist',
    category: 'Quality Assurance',
    icon: ShieldCheck,
    overview: 'SQL parameterization, sanitized error messages, JWT expiry, rate limiting, and 25-point testing matrix.',
    files: ['/server/authMiddleware.ts', '/server/db.ts'],
    packages: ['bcryptjs', 'jsonwebtoken'],
    commands: ['npm run lint'],
    explanation: 'Protects confidential identity documents and candidate PII with strict server-side authorization checks.',
    testingSteps: ['Verify non-admin token cannot call /api/admin/* (returns 403).', 'Verify unauthorized user cannot view other candidate documents.'],
  },
  {
    id: 12,
    title: 'Stage 12: GitHub Version Control Setup',
    category: 'Deployment',
    icon: GitBranch,
    overview: 'Initialize git repository, verify .gitignore excludes secrets, and push to main.',
    files: ['.gitignore', 'README.md'],
    packages: [],
    commands: [
      'git init',
      'git add .',
      'git commit -m "Initial Deva Hospital recruitment system"',
      'git branch -M main',
      'git remote add origin YOUR_GITHUB_REPOSITORY_URL',
      'git push -u origin main',
    ],
    explanation: 'Ensures `.env` and `node_modules` are excluded from version control.',
    testingSteps: ['Run `git status` and verify .env is not tracked.'],
  },
  {
    id: 13,
    title: 'Stage 13: Vercel & Production Cloud Deployment',
    category: 'Deployment',
    icon: Globe,
    overview: 'Deploy full-stack web application to Vercel with serverless Node API routes and static asset caching.',
    files: ['vercel.json', '.env.example'],
    packages: ['@vercel/node'],
    commands: ['vercel --prod'],
    explanation: 'Configures Vercel serverless builds routing `/api/*` requests to the Node backend and `/*` to the Vite React frontend.',
    testingSteps: ['Import GitHub repository in Vercel dashboard.', 'Configure environment variables (DB_HOST, JWT_SECRET, EMAIL_API_KEY).', 'Trigger deployment and test live URL.'],
  },
];

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentStage = STAGES.find((s) => s.id === activeStageId) || STAGES[0];
  const StageIcon = currentStage.icon;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-serif text-white">Full-Stack Development & Deployment Guide</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  13-Stage Masterclass
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Complete architecture, MySQL schemas, backend APIs, email dispatchers, and Vercel/GitHub steps.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Stage Sidebar List */}
          <div className="md:col-span-4 border-r border-slate-200 p-4 bg-slate-50/70 overflow-y-auto space-y-1.5">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
              Development Stages (1 — 13)
            </p>
            {STAGES.map((st) => {
              const isSelected = activeStageId === st.id;
              const Icon = st.icon;
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStageId(st.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all flex items-center gap-2.5 text-xs font-semibold ${
                    isSelected
                      ? 'bg-teal-800 text-white border-teal-800 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                    isSelected ? 'bg-teal-700 text-teal-100' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {st.id}
                  </span>
                  <span className="truncate flex-1">{st.title.replace(/^Stage \d+: /, '')}</span>
                </button>
              );
            })}
          </div>

          {/* Stage Detail Pane */}
          <div className="md:col-span-8 p-6 overflow-y-auto space-y-5 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <StageIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                    {currentStage.category} • Stage {currentStage.id} of 13
                  </span>
                  <h3 className="text-base font-bold text-slate-900 font-serif">{currentStage.title}</h3>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Stage Objective</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{currentStage.overview}</p>
            </div>

            {/* Files & Packages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-teal-600" />
                  Files Created / Modified
                </h4>
                <ul className="space-y-1 text-xs">
                  {currentStage.files.map((file, i) => (
                    <li key={i} className="font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[11px]">
                      {file}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  Key Packages & Dependencies
                </h4>
                <div className="flex flex-wrap gap-1">
                  {currentStage.packages.map((pkg, i) => (
                    <span key={i} className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {pkg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Technical Explanation */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Technical Architecture & Implementation Details
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                {currentStage.explanation}
              </p>
            </div>

            {/* Terminal Commands to Run */}
            {currentStage.commands.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-600" />
                  Terminal Commands
                </h4>
                <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs space-y-1.5 relative">
                  {currentStage.commands.map((cmd, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <span className="text-teal-400">$ {cmd}</span>
                      <button
                        onClick={() => copyToClipboard(cmd, i)}
                        className="text-slate-400 hover:text-white p-1"
                        title="Copy command"
                      >
                        {copiedIndex === i ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Checklist */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                How to Test & Verify This Stage
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {currentStage.testingSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={activeStageId === 1}
                onClick={() => setActiveStageId((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30"
              >
                Previous Stage
              </button>

              <button
                disabled={activeStageId === STAGES.length}
                onClick={() => setActiveStageId((prev) => Math.min(STAGES.length, prev + 1))}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold disabled:opacity-30"
              >
                Next Stage ({activeStageId + 1})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
