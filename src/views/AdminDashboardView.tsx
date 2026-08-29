import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Mail,
  Download,
  Trash2,
  Edit,
  ShieldCheck,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Application, Job, AdminStats, EmailLog, DocumentRecord, ApplicationStatus } from '../types.js';
import { api } from '../services/api.js';
import { DocumentViewerModal } from '../components/DocumentViewerModal.js';
import { AdminStatusConfirmModal } from '../components/AdminStatusConfirmModal.js';
import { AdminJobModal } from '../components/AdminJobModal.js';
import { AdminApplicationDetailModal } from '../components/AdminApplicationDetailModal.js';

interface AdminDashboardViewProps {
  onOpenGuide: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onOpenGuide }) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'jobs' | 'emails'>('applications');

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  // Loading & error
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Application Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ApplicationStatus>('All');
  const [jobFilter, setJobFilter] = useState<string>('All');

  // Modals
  const [viewDocsApp, setViewDocsApp] = useState<Application | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  const [confirmApp, setConfirmApp] = useState<Application | null>(null);
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus>('Accepted');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [selectedDetailApp, setSelectedDetailApp] = useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  const loadAllData = async (silent = false) => {
    if (!silent) setLoading(true);
    setErrorMessage(null);
    try {
      const [statsRes, appsRes, jobsRes, emailsRes] = await Promise.all([
        api.adminGetStats(),
        api.adminGetAllApplications(),
        api.getJobs(),
        api.adminGetEmailLogs(),
      ]);

      setStats(statsRes.stats);
      setApplications(appsRes.applications);
      setJobs(jobsRes.jobs);
      setEmailLogs(emailsRes.logs);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      if (!silent) {
        setErrorMessage(err.message || 'Failed to load administrator records.');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    // Auto-poll applications and stats every 5 seconds for real-time applicant reception
    const interval = setInterval(() => {
      loadAllData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Status Change Workflow
  const handleOpenStatusConfirm = (app: Application, status: ApplicationStatus) => {
    setConfirmApp(app);
    setTargetStatus(status);
    setIsConfirmOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!confirmApp) return;

    setActionLoading(true);
    try {
      const res = await api.adminUpdateApplicationStatus(confirmApp.id, targetStatus);
      showToast(`Application #${confirmApp.id} status updated to ${targetStatus}. Automated email dispatched to ${res.application.user?.email}.`);
      setIsConfirmOpen(false);
      setConfirmApp(null);
      await loadAllData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update application status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Job deletion
  const handleDeleteJob = async (jobId: number, title: string) => {
    if (!window.confirm(`Are you sure you want to remove the job opening "${title}"?`)) return;

    setActionLoading(true);
    try {
      await api.adminDeleteJob(jobId);
      showToast(`Job position "${title}" deleted successfully.`);
      await loadAllData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete job.');
    } finally {
      setActionLoading(false);
    }
  };

  // Export CSV of Applications
  const handleExportCSV = () => {
    if (applications.length === 0) return;

    const headers = ['ID', 'Applicant Name', 'Email', 'Phone', 'Job Title', 'Department', 'Status', 'Submitted At'];
    const rows = applications.map((a) => [
      a.id,
      `"${a.user?.full_name || ''}"`,
      `"${a.user?.email || ''}"`,
      `"${a.user?.phone || ''}"`,
      `"${a.job?.title || ''}"`,
      `"${a.job?.department || ''}"`,
      a.status,
      a.created_at,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Deva_Hospital_Recruitment_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      searchQuery === '' ||
      app.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesJob = jobFilter === 'All' || String(app.job_id) === jobFilter;

    return matchesSearch && matchesStatus && matchesJob;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Executive Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-800 text-teal-300 border border-teal-600/40 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Deva Hospital HR Directorate
            </span>
            <span className="text-xs text-slate-400">Credentialing & Recruitment Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">Recruitment Administration</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Review candidate dossiers, inspect verified credentials, issue recruitment decisions with automated email dispatch, and manage job openings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setEditingJob(null);
              setIsJobModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Vacancy</span>
          </button>

          <button
            onClick={loadAllData}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all text-xs"
            title="Refresh Records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onOpenGuide}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 text-xs font-semibold transition-all"
          >
            System Guide (13 Stages)
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-700 font-bold">✕</button>
        </div>
      )}

      {/* KPI Overview Metrics Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Applications</span>
              <FileText className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-bold font-serif text-slate-900">{stats.total_applications}</div>
            <div className="text-[11px] text-slate-500 mt-1">From {stats.total_candidates} registered candidates</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Review</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold font-serif text-blue-600">{stats.submitted}</div>
            <div className="text-[11px] text-slate-500 mt-1">Awaiting committee review</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Accepted Candidates</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-serif text-emerald-600">{stats.accepted}</div>
            <div className="text-[11px] text-slate-500 mt-1">Offers and orientation issued</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Not Selected</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-bold font-serif text-rose-600">{stats.rejected}</div>
            <div className="text-[11px] text-slate-500 mt-1">Respectful notice sent</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Open Vacancies</span>
              <Briefcase className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold font-serif text-purple-600">{stats.open_jobs}</div>
            <div className="text-[11px] text-slate-500 mt-1">Active departmental positions</div>
          </div>
        </div>
      )}

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-2 px-1 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'applications'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Applications ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-2 px-1 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'jobs'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Hospital Vacancies ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            className={`pb-2 px-1 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'emails'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email Audit Log ({emailLogs.length})</span>
          </button>
        </div>

        {activeTab === 'applications' && (
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {/* TAB 1: APPLICATIONS DATA TABLE */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate name, email, or role..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-teal-600 text-xs text-slate-800"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-600 text-xs text-slate-800 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted (Pending)</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-600 text-xs text-slate-800 bg-white"
              >
                <option value="All">All Position Openings</option>
                {jobs.map((j) => (
                  <option key={j.id} value={String(j.id)}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Applicant & Credentials Stated</th>
                    <th className="py-3.5 px-4">Position & Dept</th>
                    <th className="py-3.5 px-4">Experience & Licensure</th>
                    <th className="py-3.5 px-4">Dossier</th>
                    <th className="py-3.5 px-4">Status & Responses</th>
                    <th className="py-3.5 px-4 text-right">Administrative Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.length > 0 ? (
                    filteredApps.map((app) => {
                      const isAccepted = app.status === 'Accepted';
                      const isRejected = app.status === 'Rejected';
                      const isInterview = app.status === 'Interview Scheduled';
                      const isReview = app.status === 'Under Review';
                      const isSubmitted = app.status === 'Submitted';

                      const responseCount = app.responses?.length || (app.admin_response ? 1 : 0);

                      return (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Applicant Info */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{app.user?.full_name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-500">
                                @{app.user?.username || 'user'}
                              </span>
                            </div>
                            <div className="text-slate-500 text-[11px]">{app.user?.email}</div>
                            <div className="text-slate-400 text-[10px]">{app.user?.phone}</div>
                          </td>

                          {/* Position Info */}
                          <td className="py-4 px-4">
                            <div className="font-bold text-teal-800">{app.job?.title}</div>
                            <div className="text-slate-500 text-[11px]">{app.job?.department}</div>
                            <div className="text-[10px] text-slate-400">
                              Applied {new Date(app.applied_at || app.created_at).toLocaleDateString()}
                            </div>
                          </td>

                          {/* Information Stated by Applicant */}
                          <td className="py-4 px-4">
                            <div className="font-medium text-slate-900">
                              {app.years_of_experience || 'Clinical Professional'}
                            </div>
                            <div className="text-teal-700 font-mono text-[11px]">
                              {app.license_number || 'Board Certified'}
                            </div>
                            <div className="text-slate-500 text-[10px] truncate max-w-[180px]">
                              {app.qualification || 'Medical Credentials'}
                            </div>
                          </td>

                          {/* Dossier / Documents */}
                          <td className="py-4 px-4">
                            <button
                              onClick={() => {
                                setViewDocsApp(app);
                                setIsDocsOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-semibold text-[11px] border border-slate-200 transition-colors inline-flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>{app.documents?.length || 4} Files</span>
                            </button>
                          </td>

                          {/* Status Pill & Response Count */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              {isAccepted ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Accepted
                                </span>
                              ) : isRejected ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                                  <XCircle className="w-3 h-3" />
                                  Rejected
                                </span>
                              ) : isInterview ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                                  <Clock className="w-3 h-3" />
                                  Interview Scheduled
                                </span>
                              ) : isReview ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                                  <Clock className="w-3 h-3" />
                                  Under Review
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                                  <Clock className="w-3 h-3" />
                                  Submitted
                                </span>
                              )}

                              {responseCount > 0 && (
                                <div className="text-[10px] text-teal-700 font-semibold">
                                  {responseCount} Response{responseCount > 1 ? 's' : ''} Sent
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Actions: Review, Respond & Control */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedDetailApp(app);
                                  setIsDetailModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-[11px] shadow-sm transition-all flex items-center gap-1"
                              >
                                <span>Review & Respond</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>

                              {isSubmitted && (
                                <button
                                  onClick={() => handleOpenStatusConfirm(app, 'Accepted')}
                                  className="px-2 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] transition-all"
                                  title="Quick Accept"
                                >
                                  Accept
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No applications matched your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOSPITAL JOBS MANAGEMENT */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-serif">Healthcare Positions Directory</h2>
            <button
              onClick={() => {
                setEditingJob(null);
                setIsJobModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Position</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((j) => (
              <div key={j.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      {j.category}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      j.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {j.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{j.title}</h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{j.department}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2">{j.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Deadline: <strong>{j.deadline}</strong></span>
                    <span>{j.number_of_positions} Openings</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setEditingJob(j);
                        setIsJobModalOpen(true);
                      }}
                      className="w-full py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteJob(j.id, j.title)}
                      className="py-1.5 px-3 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center justify-center gap-1"
                      title="Delete Opening"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TRANSACTIONAL EMAIL LOGS */}
      {activeTab === 'emails' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">Email Notification Audit Trail</h2>
              <p className="text-xs text-slate-500">
                Log of automated transactional confirmation and decision emails dispatched to candidates.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold">
                <tr>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emailLogs.length > 0 ? (
                  emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">{log.recipient_email}</td>
                      <td className="py-3 px-4 font-semibold text-teal-800">{log.subject}</td>
                      <td className="py-3 px-4 capitalize text-slate-600">{log.template_name.replace(/_/g, ' ')}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          {log.delivery_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No email delivery logs recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewDocsApp && (
        <DocumentViewerModal
          documents={viewDocsApp.documents || []}
          applicantName={viewDocsApp.user?.full_name}
          isOpen={isDocsOpen}
          onClose={() => {
            setIsDocsOpen(false);
            setViewDocsApp(null);
          }}
        />
      )}

      {/* Status Confirm Modal */}
      {confirmApp && (
        <AdminStatusConfirmModal
          application={confirmApp}
          targetStatus={targetStatus}
          isOpen={isConfirmOpen}
          onClose={() => {
            setIsConfirmOpen(false);
            setConfirmApp(null);
          }}
          onConfirm={handleConfirmStatusChange}
          loading={actionLoading}
        />
      )}

      {/* Candidate Dossier & Response Control Modal */}
      {selectedDetailApp && (
        <AdminApplicationDetailModal
          application={selectedDetailApp}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedDetailApp(null);
          }}
          onUpdated={async () => {
            await loadAllData();
            // Refresh currently selected detail app with updated server data
            const appsRes = await api.adminGetAllApplications();
            const updated = appsRes.applications.find((a: Application) => a.id === selectedDetailApp.id);
            if (updated) setSelectedDetailApp(updated);
          }}
          onViewDocuments={(app) => {
            setViewDocsApp(app);
            setIsDocsOpen(true);
          }}
        />
      )}

      {/* Job Create/Edit Modal */}
      <AdminJobModal
        job={editingJob}
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSuccess={async () => {
          await loadAllData();
          showToast(editingJob ? 'Job opening updated.' : 'New job vacancy published.');
        }}
      />
    </div>
  );
};
