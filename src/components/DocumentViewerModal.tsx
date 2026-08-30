import React, { useState, useEffect } from 'react';
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
  Maximize2,
  ZoomIn,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { DocumentRecord, DocumentType } from '../types.js';

interface DocumentViewerModalProps {
  documents: DocumentRecord[];
  applicantName?: string;
  isOpen: boolean;
  onClose: () => void;
  initialDocumentId?: number;
}

const DOC_TYPE_META: Record<DocumentType, { label: string; icon: any; color: string; bg: string }> = {
  cv: {
    label: 'Curriculum Vitae',
    icon: FileText,
    color: 'border-teal-300 text-teal-700 bg-teal-50',
    bg: 'bg-teal-700',
  },
  application_letter: {
    label: 'Application / Cover Letter',
    icon: FileText,
    color: 'border-blue-300 text-blue-700 bg-blue-50',
    bg: 'bg-blue-700',
  },
  national_id: {
    label: 'National ID / Passport',
    icon: CreditCard,
    color: 'border-emerald-300 text-emerald-700 bg-emerald-50',
    bg: 'bg-emerald-700',
  },
  certificate: {
    label: 'License & Professional Certificate',
    icon: FileBadge,
    color: 'border-purple-300 text-purple-700 bg-purple-50',
    bg: 'bg-purple-700',
  },
};

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  documents,
  applicantName,
  isOpen,
  onClose,
  initialDocumentId,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [iframeError, setIframeError] = useState<boolean>(false);

  useEffect(() => {
    if (documents && documents.length > 0) {
      if (initialDocumentId) {
        const found = documents.find((d) => d.id === initialDocumentId);
        setSelectedDoc(found || documents[0]);
      } else {
        setSelectedDoc(documents[0]);
      }
    } else {
      setSelectedDoc(null);
    }
    setIframeError(false);
    setZoomLevel(1);
  }, [documents, initialDocumentId, isOpen]);

  if (!isOpen || !documents || documents.length === 0) return null;

  const currentDoc = selectedDoc || documents[0];
  const meta = DOC_TYPE_META[currentDoc.document_type] || DOC_TYPE_META.certificate;
  const Icon = meta.icon;

  const token = typeof window !== 'undefined' ? localStorage.getItem('deva_auth_token') || '' : '';

  const getDocViewUrl = (doc: DocumentRecord) => {
    if (doc.file_url && (doc.file_url.startsWith('data:') || doc.file_url.startsWith('http'))) {
      return doc.file_url;
    }
    const base = doc.file_url || `/api/documents/${doc.id}/view`;
    return token ? `${base}?token=${encodeURIComponent(token)}` : base;
  };

  const getDocDownloadUrl = (doc: DocumentRecord) => {
    return `/api/documents/${doc.id}/download${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  };

  const currentViewUrl = getDocViewUrl(currentDoc);
  const currentDownloadUrl = getDocDownloadUrl(currentDoc);

  const isImage =
    currentDoc.mime_type?.startsWith('image/') ||
    /\.(jpg|jpeg|png|webp|gif)$/i.test(currentDoc.file_name);

  const isPdf =
    currentDoc.mime_type === 'application/pdf' ||
    /\.pdf$/i.test(currentDoc.file_name);

  const handleDownload = (doc: DocumentRecord) => {
    const link = document.createElement('a');
    link.href = getDocDownloadUrl(doc);
    link.download = doc.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between border-b border-teal-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600/30 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-bold tracking-wider text-teal-300">
                  Hospital Verification Dossier
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                  {documents.length} File{documents.length > 1 ? 's' : ''}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-white">
                {applicantName ? `Applicant Credentials: ${applicantName}` : 'Applicant Credential Vault'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Sidebar: Document Selector */}
          <div className="md:col-span-4 border-r border-slate-200 p-4 bg-slate-50/70 overflow-y-auto space-y-2 max-h-[30vh] md:max-h-[calc(94vh-80px)]">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
              Uploaded Credentials ({documents.length})
            </p>
            {documents.map((doc, idx) => {
              const docMeta = DOC_TYPE_META[doc.document_type] || DOC_TYPE_META.certificate;
              const DocIcon = docMeta.icon;
              const isSelected = currentDoc.id === doc.id;

              return (
                <button
                  key={doc.id || idx}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setIframeError(false);
                    setZoomLevel(1);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-white border-teal-600 shadow-md ring-2 ring-teal-600/20'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${docMeta.color}`}>
                    <DocIcon className="w-4 h-4" />
                  </div>
                  <div className="truncate flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate" title={doc.file_name}>
                      {doc.file_name}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span className="capitalize font-semibold text-teal-800">{docMeta.label}</span>
                      <span className="font-mono">{(doc.file_size / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Main Area: Document Inspector & Controls */}
          <div className="md:col-span-8 p-4 sm:p-6 flex flex-col justify-between bg-white overflow-y-auto max-h-[60vh] md:max-h-[calc(94vh-80px)]">
            <div className="space-y-4">
              {/* Document Subheader with Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${meta.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 truncate max-w-md" title={currentDoc.file_name}>
                      {currentDoc.file_name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Category: <strong className="text-slate-800">{meta.label}</strong> • Size:{' '}
                      <span className="font-mono font-semibold text-slate-700">
                        {(currentDoc.file_size / 1024).toFixed(1)} KB
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={currentViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-300"
                    title="Open document in a dedicated browser tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                    <span>Open Tab</span>
                  </a>

                  <button
                    onClick={() => handleDownload(currentDoc)}
                    className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                    title="Download file to computer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Document Interactive Preview Canvas */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 overflow-hidden flex flex-col items-center justify-center min-h-[380px] p-2 relative">
                {isPdf && !iframeError ? (
                  <div className="w-full h-full flex flex-col items-center">
                    <iframe
                      src={currentViewUrl}
                      className="w-full h-[450px] rounded-xl border border-slate-200 bg-white"
                      title={currentDoc.file_name}
                      onError={() => setIframeError(true)}
                    />
                  </div>
                ) : isImage ? (
                  <div className="p-4 flex flex-col items-center justify-center max-h-[460px] overflow-auto">
                    <img
                      src={currentViewUrl}
                      alt={currentDoc.file_name}
                      referrerPolicy="no-referrer"
                      style={{ transform: `scale(${zoomLevel})` }}
                      className="max-h-[420px] w-auto object-contain rounded-xl shadow-md border border-slate-200 transition-transform duration-150"
                    />
                    <div className="flex items-center gap-2 mt-3 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs">
                      <button
                        onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                        className="px-2 py-0.5 rounded font-bold text-slate-600 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="font-mono text-slate-700">{Math.round(zoomLevel * 100)}%</span>
                      <button
                        onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                        className="px-2 py-0.5 rounded font-bold text-slate-600 hover:bg-slate-100"
                      >
                        +
                      </button>
                      <button
                        onClick={() => setZoomLevel(1)}
                        className="text-[10px] text-teal-700 font-semibold pl-1 hover:underline"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-3 max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-inner border border-teal-200">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{currentDoc.file_name}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Verified healthcare credential document (<code className="text-[11px]">{currentDoc.mime_type}</code>).
                      </p>
                    </div>
                    <div className="pt-3 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDownload(currentDoc)}
                        className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-md hover:bg-teal-800 transition-all flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Document
                      </button>
                      <a
                        href={currentViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Preview Window
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Meta & Verification Badge */}
            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Verified by Deva Hospital Digital Document Vault</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400 truncate">
                Vault Ref: {currentDoc.storage_id || `APP-${currentDoc.application_id}-DOC-${currentDoc.id}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

