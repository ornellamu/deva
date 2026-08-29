import React from 'react';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Send,
  Lock,
  Share2,
  Sparkles,
} from 'lucide-react';
import { Job } from '../types.js';
import { useAuth } from '../context/AuthContext.js';

interface JobDetailViewProps {
  job: Job;
  hasApplied: boolean;
  onBack: () => void;
  onApply: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onNavigateToAdmin?: (jobId?: number) => void;
}

export const JobDetailView: React.FC<JobDetailViewProps> = ({
  job,
  hasApplied,
  onBack,
  onApply,
  onOpenAuth,
  onNavigateToAdmin,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const today = new Date().toISOString().split('T')[0];
  const isExpired = job.status === 'expired' || job.deadline < today;
  const isClosed = job.status === 'closed';

  const calculateDaysLeft = () => {
    const diff = new Date(job.deadline).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const daysLeft = calculateDaysLeft();

  const handleApplyClick = () => {
    if (!user) {
      onOpenAuth('login');
      return;
    }
    onApply();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Openings</span>
        </button>
      </div>

      {/* Main Position Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{job.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 leading-tight">
              {job.title}
            </h1>
            <p className="text-sm font-semibold text-teal-700 mt-1 uppercase tracking-wider">
              {job.department} • Job ID: DH-REQ-{job.id}
            </p>
          </div>

          {/* Status Badge */}
          <div>
            {hasApplied ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-100 text-teal-800">
                <CheckCircle2 className="w-4 h-4 text-teal-700" />
                Application Submitted
              </span>
            ) : isExpired ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-100 text-rose-800">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Intake Expired
              </span>
            ) : isClosed ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600">
                Position Closed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Clock className="w-4 h-4 text-emerald-600" />
                {daysLeft <= 0 ? 'Deadline Today' : `${daysLeft} Days Remaining`}
              </span>
            )}
          </div>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block">Campus Location</span>
            <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              {job.location}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block">Open Positions</span>
            <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-teal-600" />
              {job.number_of_positions} {job.number_of_positions === 1 ? 'Slot' : 'Slots'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block">Application Deadline</span>
            <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block">Recruitment Status</span>
            <span className="font-bold text-emerald-700 mt-0.5 capitalize flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {job.status}
            </span>
          </div>
        </div>

        {/* Action CTA Bar */}
        {isAdmin ? (
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-teal-800/60 shadow-md">
            <div>
              <div className="flex items-center gap-2 text-teal-300 text-xs font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>HR Administrator Control</span>
              </div>
              <p className="text-xs text-slate-300">
                You are logged in as Administrator. Candidates submit their dossiers here for your review and decision.
              </p>
            </div>

            {onNavigateToAdmin && (
              <button
                onClick={() => onNavigateToAdmin(job.id)}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Manage in Admin Console</span>
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-teal-950">
                {hasApplied
                  ? 'Your application dossier is registered and under review by the Hospital Credentialing Committee.'
                  : !user
                  ? 'Sign in or create a candidate account to upload your CV and required credentials.'
                  : 'Submit your CV, Application Letter, National ID, and certificates.'}
              </p>
            </div>

            {hasApplied ? (
              <span className="px-6 py-2.5 rounded-xl bg-teal-200 text-teal-900 text-xs font-bold cursor-default whitespace-nowrap">
                Applied
              </span>
            ) : isExpired || isClosed ? (
              <span className="px-6 py-2.5 rounded-xl bg-slate-200 text-slate-600 text-xs font-bold cursor-not-allowed whitespace-nowrap">
                Applications Closed
              </span>
            ) : !user ? (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Lock className="w-4 h-4" />
                <span>Login to Apply</span>
              </button>
            ) : (
              <button
                onClick={handleApplyClick}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-700/25 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span>Apply for Position</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Description & Responsibilities Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-3">
            Position Overview & Clinical Responsibilities
          </h2>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-3">
            Candidate Requirements & Qualifications
          </h2>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-200">
            {job.requirements}
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div className="pt-6 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            Documents Required for this Application
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Ensure you have digital copies (PDF, DOCX, JPG, PNG under 10MB) ready to upload:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Comprehensive Curriculum Vitae (CV)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Official Application / Cover Letter</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Government-Issued National ID or Passport</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Medical / Academic Licensures & Certificates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
