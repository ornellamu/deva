import React from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  Award,
  Calendar,
  CheckCircle2,
  FileBadge,
  Building2,
} from 'lucide-react';
import { Application } from '../types.js';
import { HospitalLogo } from './HospitalLogo.js';

interface AcceptanceLetterModalProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAcceptance?: () => void;
  isConfirmed?: boolean;
}

export const AcceptanceLetterModal: React.FC<AcceptanceLetterModalProps> = ({
  application,
  isOpen,
  onClose,
  onConfirmAcceptance,
  isConfirmed = false,
}) => {
  if (!isOpen) return null;

  const refCode = `DH-${new Date().getFullYear()}-${String(application.id).padStart(5, '0')}`;
  const decisionDate = application.decision_date
    ? new Date(application.decision_date).toLocaleDateString('en-US', {
        dateStyle: 'long',
      })
    : new Date().toLocaleDateString('en-US', { dateStyle: 'long' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/85 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileBadge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif">Official Offer of Appointment</h3>
              <p className="text-[11px] text-slate-400 font-mono">Reference: {refCode}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print official document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formal Printable Document Canvas */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-white text-slate-900 space-y-8 print:p-0 print:space-y-6">
          {/* Hospital Official Letterhead */}
          <div className="border-b-2 border-teal-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <HospitalLogo size="lg" />
            <div className="text-right sm:text-right text-xs text-slate-500 space-y-0.5">
              <p className="font-bold text-slate-800">Human Capital Directorate & Medical Board</p>
              <p>Deva Central Hospital Complex, Medical Way</p>
              <p>Tel: +1 (800) 555-DEVA • recruitment@devahospital.org</p>
              <p className="font-mono text-teal-800 font-bold">Accredited Tertiary Medical Center</p>
            </div>
          </div>

          {/* Document Reference Header */}
          <div className="flex flex-col sm:flex-row justify-between text-xs text-slate-600 gap-2">
            <div>
              <p className="text-slate-400 uppercase font-bold text-[10px]">Recipient</p>
              <p className="font-bold text-slate-900 text-sm">{application.user?.full_name || 'Selected Candidate'}</p>
              <p className="text-slate-600">{application.user?.email}</p>
              <p className="text-slate-600">{application.user?.phone || 'Candidate Phone on Record'}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-slate-400 uppercase font-bold text-[10px]">Document Info</p>
              <p className="font-mono font-bold text-teal-900">Ref: {refCode}</p>
              <p>Date: {decisionDate}</p>
              <p className="text-emerald-700 font-bold">Status: OFFICIAL APPOINTMENT OFFER</p>
            </div>
          </div>

          {/* Letter Title */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
              Deva Central Hospital Medical Staffing
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-emerald-950">
              OFFICIAL OFFER OF APPOINTMENT: {application.job?.title?.toUpperCase() || 'HEALTHCARE APPOINTMENT'}
            </h2>
            <p className="text-xs text-emerald-800 font-medium">
              Department of {application.job?.department || 'Clinical Medicine'} • Location: {application.job?.location || 'Deva Central Hospital Main Complex'}
            </p>
          </div>

          {/* Body Content */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              Dear <strong>{application.user?.full_name}</strong>,
            </p>
            <p>
              On behalf of the <strong>Deva Central Hospital Medical Advisory Board</strong> and the Directorate of Human Capital,
              we are pleased to inform you that following a comprehensive evaluation of your clinical credentials,
              qualifications, and professional certifications, you have been <strong>ACCEPTED</strong> and formally offered
              the position of <strong>{application.job?.title}</strong> in the Department of <strong>{application.job?.department}</strong>.
            </p>

            {application.admin_response ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-1">
                <p className="font-bold text-teal-900">Direct Note from Hospital Administration:</p>
                <p className="italic whitespace-pre-line">"{application.admin_response}"</p>
              </div>
            ) : null}

            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wide">
                Key Terms & Pre-Employment Stipulations:
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                <li>
                  <strong>Designation:</strong> {application.job?.title} (Full-Time Clinical Staff).
                </li>
                <li>
                  <strong>Department & Facility:</strong> {application.job?.department} — {application.job?.location || 'Deva Hospital Campus'}.
                </li>
                <li>
                  <strong>Credential Verification:</strong> Final appointment is subject to physical verification of your original medical licenses, academic transcripts, and national identification.
                </li>
                <li>
                  <strong>Occupational Health Clearance:</strong> Completion of routine pre-employment health screening organized through the Deva Employee Wellness Clinic.
                </li>
              </ul>
            </div>

            <p>
              We were exceptionally impressed by your professional background and dedication to healthcare excellence.
              We look forward to your valuable contributions toward upholding Deva Hospital's clinical standards of patient care.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
            <div className="space-y-2">
              <div className="h-10 border-b border-slate-300 flex items-end">
                <span className="font-serif italic text-teal-800 text-sm font-bold">Dr. Arthur Pendelton, MD</span>
              </div>
              <div>
                <p className="font-bold text-slate-900">Dr. Arthur Pendelton, MD, FACS</p>
                <p className="text-slate-500">Chief Medical Officer & Board Chair</p>
                <p className="text-[10px] text-slate-400">Deva Central Hospital</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-10 border-b border-slate-300 flex items-end">
                <span className="font-serif italic text-teal-800 text-sm font-bold">Dr. Evelyn Vance, PhD</span>
              </div>
              <div>
                <p className="font-bold text-slate-900">Dr. Evelyn Vance, PhD</p>
                <p className="text-slate-500">Director of Human Capital & Recruitment</p>
                <p className="text-[10px] text-slate-400">Deva Central Hospital</p>
              </div>
            </div>
          </div>

          {/* Official Seal Badge */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-[10px] text-slate-400 font-mono">
            OFFICIAL DIGITAL RECRUITMENT DOCUMENT • DEVA HOSPITAL REGISTRATION #DH-MED-2026 • VERIFIED CLOUD AUDIT TRAIL
          </div>
        </div>

        {/* Footer Actions (hidden when printing) */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>This offer is officially recorded in the Deva Hospital Recruitment Database.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onConfirmAcceptance && (
              <button
                onClick={onConfirmAcceptance}
                disabled={isConfirmed}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 ${
                  isConfirmed
                    ? 'bg-emerald-100 text-emerald-800 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isConfirmed ? 'Offer Acknowledged & Accepted' : 'Confirm & Accept Offer'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
