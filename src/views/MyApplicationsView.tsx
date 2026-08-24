import React, { useState, useEffect } from 'react';
import {
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Eye,
  AlertCircle,
  Loader2,
  Download,
  ShieldCheck,
  MailCheck,
} from 'lucide-react';
import { Application, DocumentRecord } from '../types.js';
import { api } from '../services/api.js';
import { DocumentViewerModal } from '../components/DocumentViewerModal.js';

interface MyApplicationsViewProps {
  onBrowseJobs: () => void;
}

export const MyApplicationsView: React.FC<MyApplicationsViewProps> = ({ onBrowseJobs }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Document modal
  const [selectedDocs, setSelectedDocs] = useState<DocumentRecord[] | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.getMyApplications();
      setApplications(res.applications);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load your applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openDocumentViewer = (docs?: DocumentRecord[]) => {
    if (docs && docs.length > 0) {
      setSelectedDocs(docs);
      setIsDocsOpen(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-800 text-teal-300 border border-teal-600/40 mb-2">
            <FileText className="w-3.5 h-3.5" />
            Candidate Application History
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">My Job Applications</h1>
          <p className="text-xs text-slate-300 mt-1">
            Track your recruitment status, view uploaded credentials, and monitor hospital decisions.
          </p>
        </div>

        <button
          onClick={onBrowseJobs}
          className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <Briefcase className="w-4 h-4" />
          <span>Apply to New Positions</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading your candidate dossier...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-100">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Applications Submitted Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              You haven't submitted an application to any Deva Hospital positions. Browse our current clinical openings to apply.
            </p>
          </div>
          <button
            onClick={onBrowseJobs}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-700/20"
          >
            Explore Open Vacancies
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const isAccepted = app.status === 'Accepted';
            const isRejected = app.status === 'Rejected';
            const isSubmitted = app.status === 'Submitted';

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                        DH-APP-{app.id}
                      </span>
                      <span className="text-xs text-slate-400">
                        Submitted on {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 font-serif">
                      {app.job?.title || 'Clinical Position'}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                      {app.job?.department} • {app.job?.location}
                    </p>
                  </div>

                  {/* Status Indicator Pill */}
                  <div>
                    {isAccepted ? (
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Application Accepted</span>
                      </div>
                    ) : isRejected ? (
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Application Not Selected</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>Under Credentialing Review</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Guidance Card */}
                <div
                  className={`p-4 rounded-xl text-xs space-y-1 ${
                    isAccepted
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : isRejected
                      ? 'bg-slate-50 border border-slate-200 text-slate-700'
                      : 'bg-teal-50/70 border border-teal-100 text-teal-900'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <MailCheck className="w-4 h-4" />
                    <span>Recruitment Directorate Notice:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {isAccepted
                      ? 'Congratulations! Your clinical credentials have been accepted. An onboarding orientation schedule has been dispatched to your email.'
                      : isRejected
                      ? 'Thank you for your interest in Deva Hospital. Although not selected for this opening, your profile remains in our talent database for future vacancies.'
                      : 'Your application has been received and logged into the hospital database. The Credentialing Committee is evaluating candidate dossiers. You will receive an official decision notice by email.'}
                  </p>
                </div>

                {/* Attached Documents Row */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>
                      <strong>{app.documents?.length || 4} Verified Documents</strong> uploaded (CV, Letter, ID, Certificates)
                    </span>
                  </div>

                  <button
                    onClick={() => openDocumentViewer(app.documents)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Submitted Documents</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocs && (
        <DocumentViewerModal
          documents={selectedDocs}
          isOpen={isDocsOpen}
          onClose={() => setIsDocsOpen(false)}
        />
      )}
    </div>
  );
};
