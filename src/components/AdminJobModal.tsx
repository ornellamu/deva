import React, { useState, useEffect } from 'react';
import {
  X,
  Briefcase,
  Building2,
  Calendar,
  Users,
  MapPin,
  Stethoscope,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Job, JobCategory, JobStatus } from '../types.js';
import { api } from '../services/api.js';

interface AdminJobModalProps {
  job: Job | null; // null for Create, Job for Edit
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (job: Job) => void;
}

const CATEGORIES: JobCategory[] = [
  'Physician',
  'Nurse',
  'Allied Health',
  'Administration',
  'Laboratory',
  'Pharmacy',
  'Other Healthcare Positions',
];

export const AdminJobModal: React.FC<AdminJobModalProps> = ({
  job,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState<JobCategory>('Physician');
  const [location, setLocation] = useState('Deva Central Hospital Campus');
  const [deadline, setDeadline] = useState('');
  const [positions, setPositions] = useState('1');
  const [status, setStatus] = useState<JobStatus>('open');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setDepartment(job.department);
      setCategory(job.category);
      setLocation(job.location);
      setDeadline(job.deadline);
      setPositions(String(job.number_of_positions));
      setStatus(job.status);
      setDescription(job.description);
      setRequirements(job.requirements);
    } else {
      // Default new job deadline = 30 days ahead
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setTitle('');
      setDepartment('');
      setCategory('Physician');
      setLocation('Deva Central Hospital Campus');
      setDeadline(d.toISOString().split('T')[0]);
      setPositions('1');
      setStatus('open');
      setDescription('');
      setRequirements('');
    }
    setErrorMessage(null);
  }, [job, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title || !department || !deadline || !description || !requirements) {
      setErrorMessage('Please fill in all required job fields.');
      return;
    }

    setLoading(true);
    try {
      if (job) {
        // Edit
        const res = await api.adminUpdateJob(job.id, {
          title: title.trim(),
          department: department.trim(),
          category,
          location: location.trim(),
          deadline,
          number_of_positions: parseInt(positions, 10) || 1,
          status,
          description: description.trim(),
          requirements: requirements.trim(),
        });
        onSuccess(res.job);
      } else {
        // Create
        const res = await api.adminCreateJob({
          title: title.trim(),
          department: department.trim(),
          category,
          location: location.trim(),
          deadline,
          number_of_positions: parseInt(positions, 10) || 1,
          status,
          description: description.trim(),
          requirements: requirements.trim(),
        });
        onSuccess(res.job);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save job position.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-teal-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-700/80 border border-teal-500/30 flex items-center justify-center text-teal-200">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-white">
                {job ? 'Edit Healthcare Vacancy' : 'Create New Position Opening'}
              </h2>
              <p className="text-[11px] text-teal-200">Hospital Recruitment Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Position / Job Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Pediatric Anesthesiologist"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department / Specialty *
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Anesthesia & Pain Medicine"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Staff Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as JobCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Campus Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Main Tower, Surgical Pavilion"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Application Deadline *
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Number of Openings
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={positions}
                onChange={(e) => setPositions(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Recruitment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800 bg-white"
              >
                <option value="open">Open (Accepting Submissions)</option>
                <option value="closed">Closed (Manual Closure)</option>
                <option value="expired">Expired (Passed Deadline)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Job Description & Responsibilities *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Outline the core clinical duties, shift structure, patient care responsibilities, and team collaboration..."
              required
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Candidate Requirements & Credentials (Bullet points recommended) *
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
              placeholder="• MD / BSN / PharmD degree&#10;• Valid medical council license&#10;• Minimum 3 years clinical experience..."
              required
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-700/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{job ? 'Save Changes' : 'Publish Position'}</span>}
          </button>
        </div>
      </div>
    </div>
  );
};
