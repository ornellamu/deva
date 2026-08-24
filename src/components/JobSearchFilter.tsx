import React from 'react';
import { Search, Stethoscope, MapPin, Building, RotateCcw, Filter } from 'lucide-react';
import { JobFilters, JobCategory } from '../types.js';

interface JobSearchFilterProps {
  filters: JobFilters;
  onFilterChange: (newFilters: JobFilters) => void;
  onReset: () => void;
  departments: string[];
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

export const JobSearchFilter: React.FC<JobSearchFilterProps> = ({
  filters,
  onFilterChange,
  onReset,
  departments,
}) => {
  const handleChange = (field: keyof JobFilters, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 lg:p-7 relative z-20 -mt-10 max-w-7xl mx-auto">
      {/* Category Pills (Quick selection) */}
      <div className="mb-5 overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleChange('category', cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filters.category === cat
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Search Filter Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
        {/* Keyword Search */}
        <div className="lg:col-span-4 relative">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Job Title or Keyword
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              placeholder="e.g. Cardiologist, ICU Nurse, Lab..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-sm text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Department / Specialty */}
        <div className="lg:col-span-3 relative">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Specialty / Department
          </label>
          <div className="relative">
            <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-sm text-slate-800 bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="lg:col-span-3 relative">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Hospital Location / Wing
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Tower, ICU, Labs..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-sm text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Reset / Search Actions */}
        <div className="lg:col-span-2 flex items-end gap-2 pt-2 sm:pt-0">
          <button
            onClick={onReset}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
