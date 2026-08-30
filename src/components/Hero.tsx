import React from 'react';
import {
  Briefcase,
  UserPlus,
  ShieldCheck,
  Award,
  Users,
  Activity,
  HeartPulse,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { HospitalLogo } from './HospitalLogo.js';

interface HeroProps {
  onViewJobs: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenGuide: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewJobs, onOpenAuth, onOpenGuide }) => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-slate-900 to-slate-900 text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Abstract Medical Subtle Grid Background & Geometric Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <HospitalLogo size="md" variant="light" className="bg-white/5 px-3 py-1.5 rounded-2xl border border-white/10" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif leading-[1.15]">
              Build Your Career in <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-200">Healthcare</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Join Deva Hospital’s multidisciplinary team of medical specialists, registered nurses,
              allied health practitioners, laboratory scientists, and clinical administrators. Discover open
              positions, upload your verified credentials, and receive fast recruitment decisions directly to your email.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onViewJobs}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2.5 group"
              >
                <Briefcase className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                <span>View Available Jobs</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              {!user && (
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-white/10 hover:bg-white/15 border border-white/20 text-white backdrop-blur-sm transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5 text-teal-300" />
                  <span>Create Account</span>
                </button>
              )}

              <button
                onClick={onOpenGuide}
                className="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>System Guide & Schemas</span>
              </button>
            </div>

            {/* Hospital Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-serif">500+</div>
                <div className="text-xs text-slate-400 mt-0.5">Inpatient Bed Capacity</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-teal-300 font-serif">Level 1</div>
                <div className="text-xs text-slate-400 mt-0.5">Trauma & ICU Center</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-300 font-serif">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">Automated Email Review</div>
              </div>
            </div>
          </div>

          {/* Right Visual Card Preview */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-600/30 text-teal-400 flex items-center justify-center border border-teal-500/30">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Active Recruitment Cycle</h2>
                    <p className="text-xs text-slate-400">All Clinical & Non-Clinical Divisions</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Intake Open
                </span>
              </div>

              {/* Fast Process Checklist */}
              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/40">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-semibold text-white">Online Application & Document Vault</span>
                    <p className="text-slate-400 mt-0.5">Upload CV, cover letter, National ID, and medical certificates in PDF/DOCX.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/40">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-semibold text-white">Immediate Email Confirmation</span>
                    <p className="text-slate-400 mt-0.5">Instant delivery of formal application reference code to your inbox.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/40">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="font-semibold text-white">Direct Decision Notification</span>
                    <p className="text-slate-400 mt-0.5">Hospital Credentialing Committee issues Accepted/Rejected verdict via email.</p>
                  </div>
                </div>
              </div>

              {/* Quick Trust Footnote */}
              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  Encrypted & Secure
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  Deva Directorate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
