import React from 'react';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenGuide }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Hospital Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white font-serif">DEVA HOSPITAL</span>
                <p className="text-xs text-teal-400 font-medium">Tertiary Medical & Research Center</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Deva Hospital is committed to delivering world-class healthcare through clinical excellence,
              compassionate patient care, cutting-edge medical research, and nurturing exceptional healthcare professionals.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5 text-teal-400">
                <ShieldCheck className="w-4 h-4" />
                <span>JCI Accredited</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-400">
                <Award className="w-4 h-4" />
                <span>Magnet Nursing Facility</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-white uppercase tracking-wider">Recruitment</p>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('jobs')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Clinical Vacancies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Application Workflow
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenGuide}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors text-left flex items-center gap-1"
                >
                  13-Stage System Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Clinical Departments
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Medical Specialties */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-white uppercase tracking-wider">Specialties</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Cardiology & Surgery</li>
              <li>Critical Care & ICU</li>
              <li>Diagnostic Pathology</li>
              <li>Emergency Trauma</li>
              <li>Oncology & Pharmacy</li>
            </ul>
          </div>

          {/* Column 4: Contact & HR */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-white uppercase tracking-wider">Recruitment Office</p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Deva Central Hospital Campus, Human Resources Wing Level 2</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+1 (800) 555-DEVA (3382)</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>recruitment@devahospital.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Deva Central Hospital Directorate. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Equal Opportunity Healthcare Employer</span>
            <span className="hover:text-slate-400 cursor-pointer">Applicant Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Credentialing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
