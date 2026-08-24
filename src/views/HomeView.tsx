import React from 'react';
import {
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Award,
  Stethoscope,
  HeartPulse,
  Users,
  Building2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Hero } from '../components/Hero.js';
import { JobSearchFilter } from '../components/JobSearchFilter.js';
import { JobCard } from '../components/JobCard.js';
import { HowItWorks } from '../components/HowItWorks.js';
import { Job, JobFilters } from '../types.js';

interface HomeViewProps {
  jobs: Job[];
  appliedJobIds: number[];
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
  onResetFilters: () => void;
  departments: string[];
  onSelectJob: (job: Job) => void;
  onViewAllJobs: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenGuide: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  jobs,
  appliedJobIds,
  filters,
  onFilterChange,
  onResetFilters,
  departments,
  onSelectJob,
  onViewAllJobs,
  onOpenAuth,
  onOpenGuide,
}) => {
  const featuredJobs = jobs.slice(0, 6);

  return (
    <div className="space-y-12">
      {/* 1. Hero Section */}
      <Hero
        onViewJobs={onViewAllJobs}
        onOpenAuth={onOpenAuth}
        onOpenGuide={onOpenGuide}
      />

      {/* 2. Interactive Job Search Filter Box */}
      <div className="px-4 sm:px-6 lg:px-8">
        <JobSearchFilter
          filters={filters}
          onFilterChange={onFilterChange}
          onReset={onResetFilters}
          departments={departments}
        />
      </div>

      {/* 3. Featured Positions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Priority Openings
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              Featured Healthcare Opportunities
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Explore current clinical and administrative opportunities across our tertiary hospital campus.
            </p>
          </div>

          <button
            onClick={onViewAllJobs}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors shrink-0"
          >
            <span>View All {jobs.length} Vacancies</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Jobs Grid */}
        {featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSelectJob={onSelectJob}
                hasApplied={appliedJobIds.includes(job.id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No positions matched your search criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or searching with different keywords.</p>
            <button
              onClick={onResetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-sm hover:bg-teal-800"
            >
              Reset Search Filters
            </button>
          </div>
        )}
      </section>

      {/* 4. How Recruitment Works */}
      <HowItWorks />

      {/* 5. Hospital Culture & Clinical Excellence Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#14b8a6_2px,transparent_2px)] [background-size:16px_16px] pointer-events-none"></div>

          <div className="relative max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Deva Hospital Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif leading-tight">
              Why Healthcare Leaders Choose Deva Hospital
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We empower our physicians, nurses, laboratory scientists, and hospital staff with state-of-the-art diagnostic technology, competitive compensation, continuing medical education fellowships, and collaborative interdisciplinary practice.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-teal-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Comprehensive Medical & Pension Benefits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>CME Credits & Academic Research Grants</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>State-of-the-Art Robotic Surgical Theaters</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>24/7 Physician & Staff Wellness Services</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={onViewAllJobs}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-teal-500/20 transition-all flex items-center gap-2"
              >
                <span>Browse Clinical Positions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
