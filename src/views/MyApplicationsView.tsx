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
  MessageSquare,
  Award,
  Video,
  MapPin,
  Mail,
  FileBadge,
  Sparkles,
  ArrowRight,
  PartyPopper,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Application, DocumentRecord, EmailLog } from '../types.js';
import { api } from '../services/api.js';
import { DocumentViewerModal } from '../components/DocumentViewerModal.js';
import { AcceptanceLetterModal } from '../components/AcceptanceLetterModal.js';
import { EmailDetailModal } from '../components/EmailDetailModal.js';

interface MyApplicationsViewProps {
  onBrowseJobs: () => void;
}

export const MyApplicationsView: React.FC<MyApplicationsViewProps> = ({ onBrowseJobs }) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'emails'>('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [receivedEmails, setReceivedEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [selectedDocs, setSelectedDocs] = useState<DocumentRecord[] | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  const [acceptanceApp, setAcceptanceApp] = useState<Application | null>(null);
  const [isAcceptanceOpen, setIsAcceptanceOpen] = useState(false);
  const [confirmedOffers, setConfirmedOffers] = useState<Record<number, boolean>>({});

  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const [interviewConfirmed, setInterviewConfirmed] = useState<Record<number, boolean>>({});

  const fetchUserData = async (silent = false) => {
    if (!silent) setLoading(true);
    setErrorMessage(null);
    try {
      const [appsRes, emailsRes] = await Promise.all([
        api.getMyApplications(),
        api.getMyEmails().catch(() => ({ emails: [] })),
      ]);
      setApplications(appsRes.applications);
      setReceivedEmails(emailsRes.emails || []);
    } catch (err: any) {
      if (!silent) {
        setErrorMessage(err.message || 'Failed to load your candidate records.');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData(false);
    // Poll every 3.5 seconds so if admin accepts or responds in another tab, it updates instantly
    const interval = setInterval(() => {
      fetchUserData(true);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const openDocumentViewer = (docs?: DocumentRecord[]) => {
    if (docs && docs.length > 0) {
      setSelectedDocs(docs);
      setIsDocsOpen(true);
    }
  };

  const handleOpenAcceptanceModal = (app: Application) => {
    setAcceptanceApp(app);
    setIsAcceptanceOpen(true);
  };

  const handleConfirmAcceptance = (appId: number) => {
    setConfirmedOffers((prev) => ({ ...prev, [appId]: true }));
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  const handleConfirmInterview = (appId: number) => {
    setInterviewConfirmed((prev) => ({ ...prev, [appId]: true }));
  };

  const acceptedCount = applications.filter((a) => a.status === 'Accepted').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview Scheduled').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-800/80 text-teal-300 border border-teal-600/40">
              <FileText className="w-3.5 h-3.5" />
              Candidate Recruitment Portal
            </span>
            {acceptedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-md animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
                {acceptedCount} Offer{acceptedCount > 1 ? 's' : ''} Received!
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">My Applications & Decision Letters</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Review your clinical application dossiers, official hospital appointment offers, administrative letters, and interview schedules.
          </p>
        </div>

        <button
          onClick={onBrowseJobs}
          className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Briefcase className="w-4 h-4" />
          <span>Apply to New Openings</span>
        </button>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'applications'
              ? 'border-teal-700 text-teal-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Application Dossiers</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 font-mono">
            {applications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('emails')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'emails'
              ? 'border-teal-700 text-teal-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Received Letters & Emails</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
            acceptedCount > 0 ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-700'
          }`}>
            {receivedEmails.length}
          </span>
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
          <p className="text-xs font-semibold text-slate-500">Loading your candidate records...</p>
        </div>
      ) : activeTab === 'applications' ? (
        applications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-100">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">No Applications Submitted Yet</h3>
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
          <div className="space-y-6">
            {applications.map((app) => {
              const isAccepted = app.status === 'Accepted';
              const isRejected = app.status === 'Rejected';
              const isInterview = app.status === 'Interview Scheduled';
              const isReview = app.status === 'Under Review';
              const isSubmitted = app.status === 'Submitted';
              const isConfirmed = confirmedOffers[app.id];

              return (
                <div
                  key={app.id}
                  className={`bg-white rounded-3xl border p-6 sm:p-8 shadow-sm hover:shadow-md transition-all space-y-6 ${
                    isAccepted
                      ? 'border-emerald-300 ring-4 ring-emerald-500/10'
                      : isInterview
                      ? 'border-purple-300 ring-4 ring-purple-500/10'
                      : 'border-slate-200/90'
                  }`}
                >
                  {/* Top Bar with reference and status */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                          DH-APP-{String(app.id).padStart(5, '0')}
                        </span>
                        <span className="text-xs text-slate-400">
                          Applied on {new Date(app.applied_at || app.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-slate-900 font-serif">
                        {app.job?.title || 'Healthcare Position'}
                      </h2>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                        Department of {app.job?.department} • {app.job?.location || 'Deva Central Hospital'}
                      </p>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isAccepted ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold bg-emerald-600 text-white shadow-md shadow-emerald-600/20 animate-in fade-in">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>APPLICATION ACCEPTED</span>
                        </div>
                      ) : isRejected ? (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Not Selected</span>
                        </div>
                      ) : isInterview ? (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span>Interview Scheduled</span>
                        </div>
                      ) : isReview ? (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>Under Committee Review</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>Submitted & In Triage</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SPECIAL ACCEPTANCE HERO CARD (If Accepted) */}
                  {isAccepted && (
                    <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/30 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
                            <Award className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                              Official Medical Board Decision
                            </span>
                            <h3 className="text-lg font-bold font-serif">
                              Congratulations! Your Application Has Been Accepted
                            </h3>
                            <p className="text-xs text-emerald-200/90">
                              You have been selected for appointment as <strong>{app.job?.title}</strong> at Deva Central Hospital.
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleOpenAcceptanceModal(app)}
                            className="px-4 py-2 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                          >
                            <FileBadge className="w-4 h-4 text-emerald-700" />
                            <span>View Official Acceptance Letter</span>
                          </button>

                          <button
                            onClick={() => handleConfirmAcceptance(app.id)}
                            disabled={isConfirmed}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              isConfirmed
                                ? 'bg-emerald-500/30 text-emerald-200 cursor-default border border-emerald-400/30'
                                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            <span>{isConfirmed ? 'Offer Accepted & Confirmed' : 'Accept & Acknowledge Offer'}</span>
                          </button>
                        </div>
                      </div>

                      {/* 3-Step Onboarding Roadmap */}
                      <div className="pt-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-3">
                          Next Steps for Appointment Onboarding:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className={`p-3 rounded-xl border text-xs ${
                            isConfirmed ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' : 'bg-white/10 border-white/10 text-white'
                          }`}>
                            <div className="flex items-center gap-1.5 font-bold mb-1">
                              <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] flex items-center justify-center font-mono">1</span>
                              <span>Offer Acknowledgment</span>
                            </div>
                            <p className="text-[11px] text-slate-300">
                              {isConfirmed ? 'Confirmed by candidate in portal.' : 'Click "Accept Offer" to confirm your appointment.'}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white">
                            <div className="flex items-center gap-1.5 font-bold mb-1">
                              <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center font-mono">2</span>
                              <span>Credential Verification</span>
                            </div>
                            <p className="text-[11px] text-slate-300">
                              Present original license & certificates to HR Directorate, Complex Room 302.
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white">
                            <div className="flex items-center gap-1.5 font-bold mb-1">
                              <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center font-mono">3</span>
                              <span>Occupational Health & Orientation</span>
                            </div>
                            <p className="text-[11px] text-slate-300">
                              Complete routine wellness screening and attend departmental clinical briefing.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SPECIAL INTERVIEW SCHEDULED CARD (If Interview Scheduled) */}
                  {isInterview && (
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-purple-950 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-200 text-purple-800 flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold font-serif">Clinical Interview Scheduled</h3>
                            <p className="text-xs text-purple-700">
                              The Department Selection Panel has scheduled your clinical interview.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleConfirmInterview(app.id)}
                          disabled={interviewConfirmed[app.id]}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            interviewConfirmed[app.id]
                              ? 'bg-purple-200 text-purple-800 cursor-default'
                              : 'bg-purple-700 hover:bg-purple-800 text-white shadow-md'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{interviewConfirmed[app.id] ? 'Attendance Confirmed' : 'Confirm Interview Attendance'}</span>
                        </button>
                      </div>

                      {app.interview_details && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-white rounded-xl border border-purple-100">
                            <span className="text-[10px] uppercase font-bold text-purple-500 block">Date & Time</span>
                            <span className="font-bold text-purple-950 text-sm">
                              {app.interview_details.date || 'TBD'} at {app.interview_details.time || 'TBD'}
                            </span>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-purple-100">
                            <span className="text-[10px] uppercase font-bold text-purple-500 block">Format & Location</span>
                            <span className="font-bold text-purple-950">
                              {app.interview_details.format || 'In-Person (Deva Hospital)'} — {app.interview_details.location}
                            </span>
                          </div>
                          {app.interview_details.instructions && (
                            <div className="sm:col-span-2 p-3 bg-white rounded-xl border border-purple-100">
                              <span className="text-[10px] uppercase font-bold text-purple-500 block">Instructions</span>
                              <span className="text-slate-700">{app.interview_details.instructions}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stated Credentials Row */}
                  {(app.license_number || app.years_of_experience || app.qualification || app.current_employer) && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Licensure / Reg #</span>
                        <span className="font-mono font-bold text-slate-800">{app.license_number || 'Stated on CV'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Experience</span>
                        <span className="font-semibold text-slate-800">{app.years_of_experience || 'Stated'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Qualification</span>
                        <span className="font-semibold text-slate-800 truncate block">{app.qualification || 'Stated'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Notice Period</span>
                        <span className="font-semibold text-teal-800">{app.notice_period || 'Immediate'}</span>
                      </div>
                    </div>
                  )}

                  {/* OFFICIAL RESPONSES & LETTERS HISTORY */}
                  {app.responses && app.responses.length > 0 ? (
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-teal-700" />
                        Hospital Administrative Correspondence & Messages ({app.responses.length})
                      </h3>
                      {app.responses.map((resp, idx) => (
                        <div
                          key={resp.id || idx}
                          className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-xs space-y-2.5"
                        >
                          <div className="flex items-center justify-between border-b border-teal-200/60 pb-2">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-teal-700" />
                              <span className="font-bold text-teal-950">{resp.sender_name}</span>
                              <span className="text-[11px] text-teal-700">({resp.sender_role})</span>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              {new Date(resp.created_at).toLocaleString()}
                            </span>
                          </div>

                          <div className="font-bold text-slate-900">{resp.subject}</div>
                          <p className="text-slate-700 whitespace-pre-line leading-relaxed bg-white/95 p-3.5 rounded-xl border border-teal-100">
                            {resp.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : app.admin_response ? (
                    <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs space-y-2">
                      <div className="font-bold text-teal-950 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-teal-700" />
                        <span>{app.admin_responder_name || 'Hospital Administration'} Response:</span>
                      </div>
                      <p className="text-slate-700 whitespace-pre-line bg-white p-3.5 rounded-xl border border-teal-100">
                        {app.admin_response}
                      </p>
                    </div>
                  ) : null}

                  {/* Attached Documents Row */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      <span>
                        <strong>{app.documents?.length || 4} Verified Documents</strong> attached to this application dossier.
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAccepted && (
                        <button
                          onClick={() => handleOpenAcceptanceModal(app)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <FileBadge className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Acceptance Letter</span>
                        </button>
                      )}

                      <button
                        onClick={() => openDocumentViewer(app.documents)}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Uploaded Dossier</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* RECEIVED EMAILS & OFFICIAL NOTIFICATIONS INBOX */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">
                Official Transactional Emails & Decision Letters
              </h2>
              <p className="text-xs text-slate-500">
                Direct copy of all official confirmation, acceptance, and interview emails dispatched to your registered address.
              </p>
            </div>

            {receivedEmails.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
                No notification emails have been dispatched to your address yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {receivedEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => {
                      setSelectedEmail(email);
                      setIsEmailModalOpen(true);
                    }}
                    className="py-4 px-3 hover:bg-teal-50/50 rounded-xl cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {email.email_type.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{email.subject}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {email.text_content ? email.text_content.slice(0, 120) + '...' : email.body_preview}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs shrink-0">
                      <span className="text-slate-400">
                        {new Date(email.sent_at).toLocaleDateString()} {new Date(email.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-teal-700 text-white font-bold text-[11px] flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>Read Letter</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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

      {/* Official Acceptance Letter Modal */}
      {acceptanceApp && (
        <AcceptanceLetterModal
          application={acceptanceApp}
          isOpen={isAcceptanceOpen}
          onClose={() => setIsAcceptanceOpen(false)}
          onConfirmAcceptance={() => handleConfirmAcceptance(acceptanceApp.id)}
          isConfirmed={confirmedOffers[acceptanceApp.id]}
        />
      )}

      {/* Email Letter Modal */}
      <EmailDetailModal
        email={selectedEmail}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
};
