import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Award,
  Calendar,
  Clock,
  Building2,
  FileText,
  CreditCard,
  FileBadge,
  CheckCircle2,
  XCircle,
  Send,
  Loader2,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Video,
  MapPin,
  HelpCircle,
  History,
  Eye,
} from 'lucide-react';
import { Application, ApplicationStatus, InterviewDetails } from '../types.js';
import { api } from '../services/api.js';

interface AdminApplicationDetailModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  onViewDocuments: (app: Application, docId?: number) => void;
}

export const AdminApplicationDetailModal: React.FC<AdminApplicationDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  onUpdated,
  onViewDocuments,
}) => {
  if (!isOpen || !application) return null;

  const token = typeof window !== 'undefined' ? localStorage.getItem('deva_auth_token') || '' : '';

  const [activeTab, setActiveTab] = useState<'details' | 'respond' | 'history'>('details');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(application.status);
  const [subject, setSubject] = useState<string>(
    `Deva Hospital Application Update: ${application.job?.title || 'Position'} (#APP-${String(application.id).padStart(5, '0')})`
  );
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('Dr. Evelyn Vance (Chief of HR / Hospital Admin)');
  const [senderRole, setSenderRole] = useState<string>('Hospital Recruitment Committee');

  // Interview scheduling state
  const [includeInterview, setIncludeInterview] = useState<boolean>(false);
  const [interviewDate, setInterviewDate] = useState<string>(
    new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
  );
  const [interviewTime, setInterviewTime] = useState<string>('10:00 AM (EAT)');
  const [interviewLocation, setInterviewLocation] = useState<string>(
    'Deva Central Hospital, Boardroom 3B (Main Administration Block)'
  );
  const [interviewFormat, setInterviewFormat] = useState<
    'In-Person (Deva Hospital)' | 'Online Video Call' | 'Phone Interview'
  >('In-Person (Deva Hospital)');
  const [interviewInstructions, setInterviewInstructions] = useState<string>(
    'Please bring your original academic degrees, medical board registration certificate, and valid identification.'
  );

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStatusQuickChange = (status: ApplicationStatus) => {
    setSelectedStatus(status);
    if (status === 'Interview Scheduled') {
      setIncludeInterview(true);
      setSubject(`Interview Invitation — ${application.job?.title || 'Healthcare Role'} at Deva Hospital`);
      setResponseMessage(
        `Dear ${application.user?.full_name || 'Candidate'},\n\nWe are pleased to invite you for a clinical interview for the position of ${
          application.job?.title || 'this role'
        } in our ${application.job?.department || 'hospital'} department. Please review the interview schedule below.`
      );
    } else if (status === 'Accepted') {
      setIncludeInterview(false);
      setSubject(`Offer of Employment — ${application.job?.title || 'Healthcare Role'} at Deva Hospital`);
      setResponseMessage(
        `Dear ${application.user?.full_name || 'Candidate'},\n\nOn behalf of the Medical Advisory Board and Hospital Administration, we are thrilled to offer you the position of ${
          application.job?.title || 'this role'
        }. Our onboarding team will contact you with orientation details.`
      );
    } else if (status === 'Rejected') {
      setIncludeInterview(false);
      setSubject(`Application Status Update — ${application.job?.title || 'Healthcare Role'}`);
      setResponseMessage(
        `Dear ${application.user?.full_name || 'Candidate'},\n\nThank you for taking the time to apply for the position of ${
          application.job?.title || 'this role'
        }. After thorough consideration of all credentials, we have decided to proceed with other candidates whose profiles more closely align with current departmental requirements.`
      );
    } else if (status === 'Under Review') {
      setIncludeInterview(false);
      setSubject(`Application Under Review — ${application.job?.title || 'Healthcare Role'}`);
      setResponseMessage(
        `Dear ${application.user?.full_name || 'Candidate'},\n\nYour application and credentials for ${
          application.job?.title || 'this role'
        } have passed initial triage and are currently being reviewed by the departmental clinical evaluation committee.`
      );
    }
  };

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseMessage.trim()) {
      setErrorMessage('Please type a response message for the applicant.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const interviewPayload: InterviewDetails | undefined = includeInterview
      ? {
          date: interviewDate,
          time: interviewTime,
          location: interviewLocation,
          format: interviewFormat,
          instructions: interviewInstructions,
        }
      : undefined;

    try {
      const res = await api.adminRespondToApplicant(application.id, {
        subject: subject.trim(),
        message: responseMessage.trim(),
        status: selectedStatus,
        interview_details: interviewPayload,
        sender_name: senderName.trim(),
        sender_role: senderRole.trim(),
      });

      setToastMessage(`Response sent successfully! ${res.email_status}`);
      setTimeout(() => {
        onUpdated();
        setActiveTab('history');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch response to applicant.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between border-b border-teal-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-800/60 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  Candidate Dossier & Control
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 font-mono text-slate-300">
                  #APP-{String(application.id).padStart(5, '0')}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
                {application.user?.full_name || 'Applicant'} — {application.job?.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-teal-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex items-center justify-between px-6 bg-slate-50 border-b border-slate-200 text-xs font-bold">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'details'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Applicant Information Stated</span>
            </button>
            <button
              onClick={() => setActiveTab('respond')}
              className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'respond'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Respond & Schedule</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Communication History ({application.responses?.length || (application.admin_response ? 1 : 0)})</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] text-slate-500">Current Status:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                application.status === 'Accepted'
                  ? 'bg-emerald-100 text-emerald-800'
                  : application.status === 'Rejected'
                  ? 'bg-rose-100 text-rose-800'
                  : application.status === 'Interview Scheduled'
                  ? 'bg-purple-100 text-purple-800'
                  : application.status === 'Under Review'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {application.status}
            </span>
          </div>
        </div>

        {/* Toast / Error */}
        {toastMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: ALL INFORMATION STATED BY APPLICANT */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Primary Contact & Credentials Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-teal-600" />
                    Applicant Contact & Profile
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Full Name:</span>
                      <span className="font-bold text-slate-900">{application.user?.full_name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Username:</span>
                      <span className="font-mono font-semibold text-slate-800">{application.user?.username || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Email Address:</span>
                      <a href={`mailto:${application.user?.email}`} className="text-teal-700 font-semibold hover:underline">
                        {application.user?.email}
                      </a>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Phone Number:</span>
                      <span className="font-medium text-slate-800">{application.user?.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Applied On:</span>
                      <span className="text-slate-700">
                        {new Date(application.applied_at || application.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-100 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-teal-600" />
                    Clinical Qualifications Stated
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-teal-100">
                      <span className="text-slate-600">Medical License / Reg No:</span>
                      <span className="font-bold font-mono text-teal-900">
                        {application.license_number || 'Board Certified / Stated on CV'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-teal-100">
                      <span className="text-slate-600">Healthcare Experience:</span>
                      <span className="font-bold text-slate-900">
                        {application.years_of_experience || '3+ Years Clinical Practice'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-teal-100">
                      <span className="text-slate-600">Highest Qualification:</span>
                      <span className="font-semibold text-slate-900">
                        {application.qualification || 'Clinical Degree / Specialization'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-teal-100">
                      <span className="text-slate-600">Current Facility / Employer:</span>
                      <span className="font-medium text-slate-800">{application.current_employer || 'Healthcare Center'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-600">Availability / Notice:</span>
                      <span className="font-semibold text-teal-800">{application.notice_period || 'Immediate'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Statement / Notes Stated by Applicant */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  Personal Statement & Additional Information Stated by Applicant
                </h3>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed italic">
                  {application.notes ? (
                    `"${application.notes}"`
                  ) : (
                    <span className="text-slate-400 not-italic">
                      Applicant submitted standard medical credentials and cover letter dossier without extra remarks.
                    </span>
                  )}
                </div>
              </div>

              {/* Uploaded Documents Dossier */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-600" />
                    Verified Document Dossier ({application.documents?.length || 0} Files)
                  </h3>
                  <button
                    onClick={() => onViewDocuments(application)}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Interactive Document Viewer</span>
                  </button>
                </div>

                {(!application.documents || application.documents.length === 0) ? (
                  <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No documents uploaded for this application yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {application.documents.map((doc) => {
                      const authenticatedViewUrl =
                        doc.file_url?.startsWith('data:') || doc.file_url?.startsWith('http')
                          ? doc.file_url
                          : `${doc.file_url || `/api/documents/${doc.id}/view`}${
                              token ? `?token=${encodeURIComponent(token)}` : ''
                            }`;

                      return (
                        <div
                          key={doc.id}
                          onClick={() => onViewDocuments(application, doc.id)}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-teal-50/50 hover:border-teal-300 transition-all flex flex-col justify-between space-y-2 cursor-pointer group"
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-lg bg-teal-100 group-hover:bg-teal-600 group-hover:text-white text-teal-800 flex items-center justify-center shrink-0 transition-colors">
                              {doc.document_type === 'cv' && <FileText className="w-4 h-4" />}
                              {doc.document_type === 'application_letter' && <FileText className="w-4 h-4" />}
                              {doc.document_type === 'national_id' && <CreditCard className="w-4 h-4" />}
                              {doc.document_type === 'certificate' && <FileBadge className="w-4 h-4" />}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-[10px] uppercase font-bold text-teal-700 truncate">
                                {doc.document_type.replace('_', ' ')}
                              </p>
                              <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-teal-900" title={doc.file_name}>
                                {doc.file_name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                            <span>{(doc.file_size / 1024).toFixed(0)} KB</span>
                            <div className="flex items-center gap-2">
                              <span className="text-teal-700 font-bold group-hover:underline flex items-center gap-0.5">
                                <Eye className="w-3 h-3" />
                                Inspect
                              </span>
                              <a
                                href={authenticatedViewUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-slate-400 hover:text-slate-700 p-0.5"
                                title="Open in separate tab"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Action Button to jump to response */}
              <div className="p-4 bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl text-white flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Ready to respond or schedule with {application.user?.full_name}?</h4>
                  <p className="text-xs text-teal-200 mt-0.5">
                    Send official HR feedback, set application status, or schedule an interview.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('respond')}
                  className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Write Response</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: RESPOND & SCHEDULE INTERVIEW */}
          {activeTab === 'respond' && (
            <form onSubmit={handleSendResponse} className="space-y-5">
              {/* Status Decision Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Update Application Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['Submitted', 'Under Review', 'Interview Scheduled', 'Accepted', 'Rejected'] as ApplicationStatus[]).map(
                    (st) => {
                      const isActive = selectedStatus === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusQuickChange(st)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                            isActive
                              ? st === 'Accepted'
                                ? 'bg-emerald-600 border-emerald-700 text-white shadow-md'
                                : st === 'Rejected'
                                ? 'bg-rose-600 border-rose-700 text-white shadow-md'
                                : st === 'Interview Scheduled'
                                ? 'bg-purple-600 border-purple-700 text-white shadow-md'
                                : st === 'Under Review'
                                ? 'bg-amber-500 border-amber-600 text-white shadow-md'
                                : 'bg-teal-700 border-teal-800 text-white shadow-md'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {st}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Interview Schedule Toggle */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-700" />
                    <span className="text-xs font-bold text-purple-900">Include Official Clinical Interview Schedule</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeInterview}
                      onChange={(e) => setIncludeInterview(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-700"></div>
                  </label>
                </div>

                {includeInterview && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-purple-200/60 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Interview Date
                      </label>
                      <input
                        type="date"
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-600 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Interview Time & Timezone
                      </label>
                      <input
                        type="text"
                        value={interviewTime}
                        onChange={(e) => setInterviewTime(e.target.value)}
                        placeholder="e.g. 10:00 AM (EAT)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-600 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Interview Format
                      </label>
                      <select
                        value={interviewFormat}
                        onChange={(e) => setInterviewFormat(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-600 bg-white"
                      >
                        <option value="In-Person (Deva Hospital)">In-Person (Deva Hospital)</option>
                        <option value="Online Video Call">Online Video Call (Google Meet / Zoom)</option>
                        <option value="Phone Interview">Phone Interview</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Location / Video Call Link
                      </label>
                      <input
                        type="text"
                        value={interviewLocation}
                        onChange={(e) => setInterviewLocation(e.target.value)}
                        placeholder="e.g. Deva Hospital Admin Block Room 3B or https://meet.google.com/xyz"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-600 bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Preparation Instructions for Candidate
                      </label>
                      <input
                        type="text"
                        value={interviewInstructions}
                        onChange={(e) => setInterviewInstructions(e.target.value)}
                        placeholder="e.g. Bring original certificates, medical council registration, and clinical portfolio."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-600 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Message Subject & Body */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Official Response Message & Feedback for {application.user?.full_name}
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows={6}
                  required
                  placeholder="Type your official administrative feedback, interview details, offer remarks, or requirements..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 focus:border-teal-600 text-xs text-slate-800 leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Responder Name (Admin Sign-off)
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Department / Role
                  </label>
                  <input
                    type="text"
                    value={senderRole}
                    onChange={(e) => setSenderRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <p className="text-[11px] text-slate-500">
                  Sending this response will dispatch an automated notification to{' '}
                  <strong className="text-slate-800">{application.user?.email}</strong>.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Official Response...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Dispatch Response & Update Status</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: COMMUNICATION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <History className="w-4 h-4 text-teal-600" />
                Response & Communication Audit Log for {application.user?.full_name}
              </h3>

              {application.responses && application.responses.length > 0 ? (
                <div className="space-y-3">
                  {application.responses.map((resp, i) => (
                    <div key={resp.id || i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{resp.sender_name}</span>
                          <span className="text-[11px] text-slate-500">({resp.sender_role})</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(resp.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="font-bold text-teal-900 pb-1 border-b border-slate-200/60">
                        {resp.subject}
                      </div>

                      <p className="text-slate-700 whitespace-pre-line leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                        {resp.message}
                      </p>

                      {resp.interview_details && (
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1 text-purple-900">
                          <div className="font-bold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Interview Scheduled
                          </div>
                          <p>
                            <strong>Date & Time:</strong> {resp.interview_details.date} at {resp.interview_details.time}
                          </p>
                          <p>
                            <strong>Format & Location:</strong> {resp.interview_details.format} — {resp.interview_details.location}
                          </p>
                          {resp.interview_details.instructions && (
                            <p>
                              <strong>Instructions:</strong> {resp.interview_details.instructions}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : application.admin_response ? (
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {application.admin_responder_name || 'Dr. Evelyn Vance (Chief of HR)'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {application.admin_response_date ? new Date(application.admin_response_date).toLocaleString() : 'Recently'}
                    </span>
                  </div>
                  <p className="text-slate-700 whitespace-pre-line bg-white p-3 rounded-xl border border-slate-200">
                    {application.admin_response}
                  </p>
                </div>
              ) : (
                <div className="py-10 text-center text-slate-400 text-xs">
                  No responses have been dispatched to this applicant yet. Click "Respond & Schedule" above to send an official response.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close Dossier
          </button>
          <div className="text-[11px] text-slate-500">
            Deva Central Hospital HR & Credentialing Portal
          </div>
        </div>
      </div>
    </div>
  );
};
