import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  MailCheck,
  FileCheck2,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Application } from '../types.js';

interface SubmissionSuccessModalProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
  onViewPortal: () => void;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  application,
  isOpen,
  onClose,
  onViewPortal,
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#059669', '#0284c7', '#f59e0b'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const refCode = `DH-${new Date().getFullYear()}-${String(application.id).padStart(5, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-50 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Application Confirmed
            </span>
            <h2 className="text-2xl font-bold font-serif text-slate-900 mt-2">
              Application Submitted Successfully
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your submission for <strong>{application.job?.title || 'Clinical Position'}</strong> has been registered.
            </p>
          </div>

          {/* Reference Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/80">
              <span className="text-slate-500">Application Reference</span>
              <span className="font-mono font-bold text-teal-800">{refCode}</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/80">
              <span className="text-slate-500">Department</span>
              <span className="font-semibold text-slate-800">{application.job?.department}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Status</span>
              <span className="font-bold text-teal-700">{application.status}</span>
            </div>
          </div>

          {/* Key Checklist Notices */}
          <div className="space-y-2.5 text-left text-xs text-slate-600 bg-teal-50/60 p-4 rounded-2xl border border-teal-100">
            <div className="flex items-start gap-2.5">
              <FileCheck2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <span>All 4 document categories (CV, Letter, ID, Certificates) verified and stored securely in cloud storage.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <MailCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <span>An official confirmation email has been dispatched to your registered email address.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <span>The Hospital Credentialing Committee will evaluate your dossier and send the recruitment verdict by email.</span>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              Browse More Jobs
            </button>
            <button
              onClick={() => {
                onClose();
                onViewPortal();
              }}
              className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-700/25 transition-all flex items-center justify-center gap-1.5"
            >
              <span>View My Applications</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
