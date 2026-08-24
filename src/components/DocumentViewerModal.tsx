import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Eye,
  FileBadge,
  CreditCard,
  Building2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { DocumentRecord, DocumentType } from '../types.js';

interface DocumentViewerModalProps {
  documents: DocumentRecord[];
  applicantName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const DOC_TYPE_META: Record<DocumentType, { label: string; icon: any; color: string }> = {
  cv: { label: 'Curriculum Vitae', icon: FileText, color: 'bg-teal-50 text-teal-700 border-teal-200' },
  application_letter: { label: 'Application Letter', icon: FileText, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  national_id: { label: 'National ID / Passport', icon: CreditCard, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  certificate: { label: 'Certificate / Licensure', icon: FileBadge, color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  documents,
  applicantName,
  isOpen,
  onClose,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord>(documents[0] || null);

  if (!isOpen || documents.length === 0) return null;

  const currentDoc = selectedDoc || documents[0];
  const meta = DOC_TYPE_META[currentDoc.document_type] || DOC_TYPE_META.certificate;
  const Icon = meta.icon;

  const handleDownload = (doc: DocumentRecord) => {
    const link = document.createElement('a');
    link.href = doc.file_url;
    link.download = doc.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-white">Credential Verification Dossier</h2>
              <p className="text-xs text-teal-300">
                {applicantName ? `Applicant: ${applicantName} • ` : ''}{documents.length} Verified Document(s)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Sidebar: Document List */}
          <div className="md:col-span-4 border-r border-slate-200 p-4 bg-slate-50/70 overflow-y-auto space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
              Uploaded Documents ({documents.length})
            </p>
            {documents.map((doc) => {
              const docMeta = DOC_TYPE_META[doc.document_type] || DOC_TYPE_META.certificate;
              const DocIcon = docMeta.icon;
              const isSelected = currentDoc.id === doc.id;

              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-white border-teal-600 shadow-sm ring-1 ring-teal-600/20'
                      : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${docMeta.color}`}>
                    <DocIcon className="w-4 h-4" />
                  </div>
                  <div className="truncate flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{doc.file_name}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                      <span className="capitalize">{docMeta.label}</span>
                      <span>{(doc.file_size / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Area: Document Preview & Actions */}
          <div className="md:col-span-8 p-6 flex flex-col justify-between bg-white overflow-y-auto">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${meta.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{currentDoc.file_name}</h3>
                    <p className="text-xs text-slate-500">
                      Type: <strong>{meta.label}</strong> • MIME: <code className="text-[11px]">{currentDoc.mime_type}</code>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(currentDoc)}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File</span>
                </button>
              </div>

              {/* Preview Window */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
                {currentDoc.mime_type.startsWith('image/') ? (
                  <div className="max-h-96 overflow-hidden rounded-xl shadow-md border border-slate-200">
                    <img
                      src={currentDoc.file_url}
                      alt={currentDoc.file_name}
                      referrerPolicy="no-referrer"
                      className="max-h-96 w-auto object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <div className="space-y-3 max-w-sm">
                    <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-inner">
                      <FileText className="w-7 h-7" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">{currentDoc.file_name}</h4>
                    <p className="text-xs text-slate-500">
                      Standard healthcare credential document. You can download the file or open it in a new window for deep scrutiny.
                    </p>
                    <div className="pt-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleDownload(currentDoc)}
                        className="px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold shadow-sm hover:bg-teal-800 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download File
                      </button>
                      <a
                        href={currentDoc.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Preview
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Note */}
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Cloud Storage ID: <code className="text-slate-600">{currentDoc.storage_id}</code></span>
              <span>Encrypted Deva Document Vault</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
