import React from 'react';
import { X, Mail, Calendar, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { EmailLog } from '../types.js';
import { HospitalLogo } from './HospitalLogo.js';

interface EmailDetailModalProps {
  email: EmailLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmailDetailModal: React.FC<EmailDetailModalProps> = ({ email, isOpen, onClose }) => {
  if (!isOpen || !email) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif">Official Hospital Correspondence</h3>
              <p className="text-[11px] text-slate-400">Delivered to: {email.recipient_email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Email Metadata */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 text-xs space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Subject</span>
              <h2 className="text-base font-bold text-slate-900 font-serif">{email.subject}</h2>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              {email.delivery_status || 'Delivered to In-App Portal'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600 border-t border-slate-200">
            <div>
              <strong>From:</strong> Deva Hospital Recruitment
            </div>
            <div>
              <strong>To:</strong> {email.recipient_name} ({email.recipient_email})
            </div>
            <div>
              <strong>Date:</strong> {new Date(email.sent_at).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white space-y-6">
          {email.html_content ? (
            <div
              className="email-html-container prose prose-sm max-w-none text-slate-800"
              dangerouslySetInnerHTML={{ __html: email.html_content }}
            />
          ) : (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-sans">
              {email.text_content || email.body_preview}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Official digital correspondence issued by Deva Central Hospital</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            Close Letter
          </button>
        </div>
      </div>
    </div>
  );
};
