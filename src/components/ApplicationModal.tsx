import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Trash2,
  Plus,
  Building2,
  ShieldCheck,
  Loader2,
  FileBadge,
  CreditCard,
} from 'lucide-react';
import { Job, Application } from '../types.js';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

interface ApplicationModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (application: Application) => void;
}

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE_MB = 10;

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  job,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [letterFile, setLetterFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [yearsExperience, setYearsExperience] = useState<string>('');
  const [licenseNumber, setLicenseNumber] = useState<string>('');
  const [qualification, setQualification] = useState<string>('');
  const [currentEmployer, setCurrentEmployer] = useState<string>('');
  const [noticePeriod, setNoticePeriod] = useState<string>('Immediate');
  const [notes, setNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cvInputRef = useRef<HTMLInputElement>(null);
  const letterInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateSingleFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `Invalid format for "${file.name}". Only PDF, DOC, DOCX, JPG, and PNG are allowed.`;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File "${file.name}" exceeds the 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`;
    }
    return null;
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files) as File[];
      const validFiles: File[] = [];

      for (const file of selected) {
        const error = validateSingleFile(file);
        if (error) {
          setErrorMessage(error);
          return;
        }
        validFiles.push(file);
      }

      setCertificateFiles((prev) => [...prev, ...validFiles]);
      setErrorMessage(null);
    }
  };

  const removeCertificate = (index: number) => {
    setCertificateFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Document Validation
    if (!cvFile) {
      setErrorMessage('Please upload your CV before submitting your application.');
      return;
    }
    if (!letterFile) {
      setErrorMessage('Please upload your Application / Cover Letter.');
      return;
    }
    if (!idFile) {
      setErrorMessage('Please upload your National ID or Passport document.');
      return;
    }
    if (certificateFiles.length === 0) {
      setErrorMessage('Please upload at least one relevant academic or professional certificate.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('job_id', String(job.id));
      if (notes.trim()) formData.append('notes', notes.trim());
      if (yearsExperience.trim()) formData.append('years_of_experience', yearsExperience.trim());
      if (licenseNumber.trim()) formData.append('license_number', licenseNumber.trim());
      if (qualification.trim()) formData.append('qualification', qualification.trim());
      if (currentEmployer.trim()) formData.append('current_employer', currentEmployer.trim());
      if (noticePeriod.trim()) formData.append('notice_period', noticePeriod.trim());

      formData.append('cv', cvFile);
      formData.append('application_letter', letterFile);
      formData.append('national_id', idFile);

      certificateFiles.forEach((cert) => {
        formData.append('certificates', cert);
      });

      const response = await api.submitApplication(formData);
      onSuccess(response.application);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMessage(err.message || 'Failed to submit application. Please check your files.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-teal-800 to-teal-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-200">Deva Hospital Application</span>
            </div>
            <h2 className="text-xl font-bold font-serif text-white mt-1">{job.title}</h2>
            <p className="text-xs text-teal-200">{job.department} • Ref: DH-REQ-{job.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Applicant Identification Summary */}
          {user && (
            <div className="p-3.5 bg-teal-50/70 border border-teal-100 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-900">Applying as: {user.full_name}</p>
                <p className="text-slate-500">{user.email} • {user.phone}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-teal-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Verified Candidate
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Required Application Documents
            </h3>
            <p className="text-xs text-slate-500">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per document).
            </p>

            {/* Document 1: CV */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">Curriculum Vitae (CV)</span>
                      <span className="text-[10px] font-bold text-rose-600 uppercase">*Required</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {cvFile ? `${cvFile.name} (${(cvFile.size / 1024).toFixed(0)} KB)` : 'Upload comprehensive medical/clinical CV'}
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={cvInputRef}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const err = validateSingleFile(e.target.files[0]);
                      if (err) setErrorMessage(err);
                      else {
                        setCvFile(e.target.files[0]);
                        setErrorMessage(null);
                      }
                    }
                  }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                />

                {cvFile ? (
                  <button
                    type="button"
                    onClick={() => setCvFile(null)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => cvInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-teal-600 text-xs font-semibold text-slate-700 hover:text-teal-700 shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload CV</span>
                  </button>
                )}
              </div>
            </div>

            {/* Document 2: Application Letter */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">Application / Cover Letter</span>
                      <span className="text-[10px] font-bold text-rose-600 uppercase">*Required</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {letterFile ? `${letterFile.name} (${(letterFile.size / 1024).toFixed(0)} KB)` : 'Formal application letter addressed to Deva Hospital HR'}
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={letterInputRef}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const err = validateSingleFile(e.target.files[0]);
                      if (err) setErrorMessage(err);
                      else {
                        setLetterFile(e.target.files[0]);
                        setErrorMessage(null);
                      }
                    }
                  }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                />

                {letterFile ? (
                  <button
                    type="button"
                    onClick={() => setLetterFile(null)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => letterInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-teal-600 text-xs font-semibold text-slate-700 hover:text-teal-700 shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Letter</span>
                  </button>
                )}
              </div>
            </div>

            {/* Document 3: National ID */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">National ID or Passport</span>
                      <span className="text-[10px] font-bold text-rose-600 uppercase">*Required</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {idFile ? `${idFile.name} (${(idFile.size / 1024).toFixed(0)} KB)` : 'Valid government identification card or passport'}
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={idInputRef}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const err = validateSingleFile(e.target.files[0]);
                      if (err) setErrorMessage(err);
                      else {
                        setIdFile(e.target.files[0]);
                        setErrorMessage(null);
                      }
                    }
                  }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                />

                {idFile ? (
                  <button
                    type="button"
                    onClick={() => setIdFile(null)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => idInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-teal-600 text-xs font-semibold text-slate-700 hover:text-teal-700 shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload ID</span>
                  </button>
                )}
              </div>
            </div>

            {/* Document 4: Certificates (Multiple files) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    <FileBadge className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">Academic & Professional Certificates</span>
                      <span className="text-[10px] font-bold text-rose-600 uppercase">*Required (1+)</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Degrees, Diplomas, Board Licensures, ACLS/BLS, Specialized Fellowships
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={certInputRef}
                  onChange={handleCertificateChange}
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => certInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-teal-600 text-xs font-semibold text-slate-700 hover:text-teal-700 shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Certificate(s)</span>
                </button>
              </div>

              {/* Uploaded Certificates List */}
              {certificateFiles.length > 0 && (
                <div className="mt-3 space-y-2 pt-2 border-t border-slate-200">
                  {certificateFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium text-slate-800 truncate">{file.name}</span>
                        <span className="text-[10px] text-slate-400">({(file.size / 1024).toFixed(0)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCertificate(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Remove Certificate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Applicant Qualifications & Professional Information Stated */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Applicant Qualifications & Professional Details
            </h3>
            <p className="text-xs text-slate-500">
              Provide your clinical credentials, licensure, and professional background for review by hospital administration.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Medical License / Registration No.
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g. KMPDC-MD-88492 or RN-55102"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Years of Healthcare Experience
                </label>
                <input
                  type="text"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  placeholder="e.g. 6 Years Clinical Experience"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Highest Qualification / Specialization
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. MBChB, MMed Cardiology, BSN Nursing"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Employer / Medical Center
                </label>
                <input
                  type="text"
                  value={currentEmployer}
                  onChange={(e) => setCurrentEmployer(e.target.value)}
                  placeholder="e.g. Metropolitan General Hospital"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Available Notice Period
                </label>
                <select
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800 bg-white"
                >
                  <option value="Immediate">Immediate Availability</option>
                  <option value="1 Week">1 Week Notice</option>
                  <option value="2 Weeks">2 Weeks Notice</option>
                  <option value="1 Month">1 Month Notice</option>
                  <option value="2 Months">2 Months Notice</option>
                  <option value="3 Months">3 Months Notice</option>
                </select>
              </div>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Personal Statement & Additional Information Stated
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="State any specific achievements, clinical sub-specialties, shift availability, or comments for the recruiting administration..."
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-700/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading Documents & Submitting...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Submit Official Application</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
