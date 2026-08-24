import React from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  Stethoscope,
  HeartHandshake,
  FlaskConical,
  Pill,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { Job, JobCategory } from '../types.js';

interface JobCardProps {
  job: Job;
  onSelectJob: (job: Job) => void;
  hasApplied?: boolean;
}

const CATEGORY_COLORS: Record<JobCategory, { bg: string; text: string; icon: any }> = {
  Physician: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', text: 'text-indigo-700', icon: Stethoscope },
  Nurse: { bg: 'bg-teal-50 text-teal-700 border-teal-200', text: 'text-teal-700', icon: HeartHandshake },
  'Allied Health': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'text-emerald-700', icon: Stethoscope },
  Administration: { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'text-blue-700', icon: Building2 },
  Laboratory: { bg: 'bg-purple-50 text-purple-700 border-purple-200', text: 'text-purple-700', icon: FlaskConical },
  Pharmacy: { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'text-amber-700', icon: Pill },
  'Other Healthcare Positions': { bg: 'bg-slate-50 text-slate-700 border-slate-200', text: 'text-slate-700', icon: Building2 },
};

export const JobCard: React.FC<JobCardProps> = ({ job, onSelectJob, hasApplied }) => {
  const categoryConfig = CATEGORY_COLORS[job.category] || CATEGORY_COLORS['Other Healthcare Positions'];
  const CategoryIcon = categoryConfig.icon;

  // Calculate days remaining until deadline
  const today = new Date().toISOString().split('T')[0];
  const isExpired = job.status === 'expired' || job.deadline < today;
  const isClosed = job.status === 'closed';

  const calculateDaysLeft = () => {
    const diff = new Date(job.deadline).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
  };

  const daysLeft = calculateDaysLeft();

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-teal-500/50 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
      {/* Top Header info */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${categoryConfig.bg}`}>
            <CategoryIcon className="w-3.5 h-3.5" />
            <span>{job.category}</span>
          </div>

          {/* Status Badge */}
          {hasApplied ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Applied
            </span>
          ) : isExpired ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
              <ShieldAlert className="w-3.5 h-3.5" />
              Expired
            </span>
          ) : isClosed ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              Closed
            </span>
          ) : (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              daysLeft <= 5 ? 'bg-amber-100 text-amber-800 font-bold animate-pulse' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <Clock className="w-3 h-3" />
              {daysLeft <= 0 ? 'Due Today' : `${daysLeft} days left`}
            </span>
          )}
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
          {job.title}
        </h3>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 mb-3">
          {job.department}
        </p>

        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {job.description}
        </p>
      </div>

      {/* Meta Specs & CTA */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.number_of_positions} {job.number_of_positions === 1 ? 'Opening' : 'Openings'}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Deadline: <strong className="text-slate-700 font-semibold">{new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
          </div>
        </div>

        <button
          onClick={() => onSelectJob(job)}
          className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
            isExpired || isClosed
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              : 'bg-teal-700 hover:bg-teal-800 text-white shadow-sm shadow-teal-700/20'
          }`}
        >
          <span>{hasApplied ? 'View My Application' : 'View Details & Requirements'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
