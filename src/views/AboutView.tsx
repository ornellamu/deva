import React from 'react';
import {
  ShieldCheck,
  Award,
  HeartHandshake,
  Users,
  Stethoscope,
  Activity,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { HospitalLogo } from '../components/HospitalLogo.js';

interface AboutViewProps {
  onViewJobs: () => void;
  onOpenGuide: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onViewJobs, onOpenGuide }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <HospitalLogo size="lg" variant="light" className="mb-2" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight">
            About Deva Central Hospital
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Founded with a commitment to clinical excellence, patient-centric compassion, and medical innovation, Deva Hospital is a leading 500-bed tertiary healthcare system serving regional and international communities.
          </p>
        </div>
      </div>

      {/* Hospital Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-serif">Clinical Excellence</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Equipped with 14 modular surgical suites, advanced hybrid catheterization labs, a 40-bed level-1 intensive care unit, and cutting-edge imaging diagnostics.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-serif">Education & Research</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            We foster medical residency programs, accredited nursing fellowships, clinical trial research, and continuous medical education (CME) in partnership with leading universities.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-serif">Staff Empowerment</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Competitive physician remuneration, structured clinical career ladders, mental wellness initiatives, and an inclusive, multidisciplinary working culture.
          </p>
        </div>
      </div>

      {/* Recruitment Policy */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold font-serif text-slate-900">Equal Opportunity & Credentialing Policy</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Deva Hospital provides equal employment opportunities to all qualified applicants regardless of race, color, religion, gender, national origin, age, disability, or veteran status. All clinical appointments are subject to rigorous verification of medical board licensures, national ID validation, academic credentials, and criminal background clearances through our Credentialing Committee.
        </p>

        <div className="pt-4 flex flex-wrap gap-4">
          <button
            onClick={onViewJobs}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-700/20 flex items-center gap-2"
          >
            <span>Explore Current Vacancies</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenGuide}
            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Inspect Technical System Architecture
          </button>
        </div>
      </div>
    </div>
  );
};
