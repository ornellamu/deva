import React from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Mail,
  AlertTriangle,
  Send,
  Building2,
} from 'lucide-react';
import { Application, ApplicationStatus } from '../types.js';

interface AdminStatusConfirmModalProps {
  application: Application;
  targetStatus: ApplicationStatus;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const AdminStatusConfirmModal: React.FC<AdminStatusConfirmModalProps> = ({
  application,
  targetStatus,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  const isAccepting = targetStatus === 'Accepted';
  const applicantName = application.user?.full_name || 'Applicant';
  const jobTitle = application.job?.title || 'Healthcare Position';
  const department = application.job?.department || 'Clinical Department';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div
          className={`px-6 py-5 text-white flex items-center justify-between ${
            isAccepting
              ? 'bg-gradient-to-r from-emerald-800 to-teal-900'
              : 'bg-gradient-to-r from-slate-800 to-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isAccepting ? 'bg-emerald-600/40 text-emerald-200' : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {isAccepting ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-white">
                Confirm {isAccepting ? 'Acceptance' : 'Rejection'} Decision
              </h2>
              <p className="text-xs opacity-90">
                Application #{application.id} • {applicantName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Automated Email Trigger Alert:</span>
              <p className="mt-0.5 text-amber-700">
                Confirming this action will permanently update the candidate status to{' '}
                <strong className="underline">{targetStatus}</strong> and automatically dispatch the predefined
                hospital recruitment email to <strong>{application.user?.email}</strong>.
              </p>
            </div>
          </div>

          {/* Email Preview Container */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-teal-700" />
                Automated Transactional Email Preview
              </span>
              <span className="text-[10px] text-slate-500 font-mono">To: {application.user?.email}</span>
            </div>

            <div className="p-4 bg-slate-50/50 space-y-2">
              <div className="text-slate-800 font-bold pb-1 border-b border-slate-200">
                Subject: Application Update — {jobTitle}
              </div>

              {isAccepting ? (
                <div className="space-y-2 text-slate-600 leading-relaxed">
                  <p>Dear <strong>{applicantName}</strong>,</p>
                  <p>
                    On behalf of the Management and Medical Advisory Board of <strong>Deva Central Hospital</strong>, we are pleased to inform you that your application for <strong>{jobTitle}</strong> ({department}) has been <strong>ACCEPTED</strong>.
                  </p>
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-800 text-[11px]">
                    <strong>Next Steps:</strong> Our HR Onboarding Officer will contact you within two business days to schedule formal orientation and credential verification.
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-slate-600 leading-relaxed">
                  <p>Dear <strong>{applicantName}</strong>,</p>
                  <p>
                    Thank you for applying for the position of <strong>{jobTitle}</strong> in the <strong>{department}</strong> at Deva Central Hospital.
                  </p>
                  <p>
                    After careful consideration of all candidate credentials, we regret to inform you that we are unable to advance your application for this opening at this time. We wish you every success in your healthcare career.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
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
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 ${
              isAccepting
                ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/25'
                : 'bg-slate-800 hover:bg-slate-900 shadow-slate-800/25'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Confirm & Dispatch Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};
