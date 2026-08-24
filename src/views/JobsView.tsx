import React from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Stethoscope,
  Building2,
  Users,
  Calendar,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Job, JobFilters, JobCategory } from '../types.js';
import { JobCard } from '../components/JobCard.js';

interface JobsViewProps {
  jobs: Job[];
  appliedJobIds: number[];
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
  onResetFilters: () => void;
  departments: string[];
  onSelectJob: (job: Job) => void;
}

const CATEGORIES: (JobCategory | 'All')[] = [
  'All',
  'Physician',
  'Nurse',
  'Allied Health',
  'Administration',
  'Laboratory',
  'Pharmacy',
  'Other Healthcare Positions',
];

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  appliedJobIds,
  filters,
  onFilterChange,
  onResetFilters,
  departments,
  onSelectJob,
}) => {
  const handleCategoryClick = (cat: JobCategory | 'All') => {
    onFilterChange({ ...filters, category: cat });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-800/80 text-teal-300 border border-teal-600/40">
            <Sparkles className="w-3.5 h-3.5" />
            Healthcare Opportunities
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif">
            Clinical & Hospital Vacancies
          </h1>
          <p className="text-sm text-slate-300">
            Explore {jobs.length} open position(s) across specialized medical departments at Deva Hospital.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        {/* Category selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filters.category === cat
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Search by job title or keyword..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800"
            />
          </div>

          <div>
            <select
              value={filters.department}
              onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800 bg-white"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={onResetFilters}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vacancy Cards Grid */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelectJob={onSelectJob}
              hasApplied={appliedJobIds.includes(job.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Job Openings Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            There are currently no vacancies matching your specified filters. Try selecting "All" categories or clearing your search keywords.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-4 px-5 py-2.5 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-md hover:bg-teal-800 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
