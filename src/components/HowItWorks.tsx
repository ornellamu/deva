import React from 'react';
import {
  UserPlus,
  Search,
  UploadCloud,
  FileCheck2,
  MailCheck,
  ArrowRight,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Create an Account',
      description: 'Register with your verified email, phone number, and password to establish your secure candidate profile.',
      icon: UserPlus,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      number: '02',
      title: 'Find a Healthcare Job',
      description: 'Browse current clinical and administrative vacancies by department, specialty, and requirements.',
      icon: Search,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      number: '03',
      title: 'Submit Application & Files',
      description: 'Upload your CV, Application Letter, National ID, and verified medical/academic certificates.',
      icon: UploadCloud,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      number: '04',
      title: 'Recruitment Committee Review',
      description: 'The Deva Hospital Credentialing Committee audits your clinical credentials and departmental fit.',
      icon: FileCheck2,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      number: '05',
      title: 'Receive Decision by Email',
      description: 'Receive your official confirmation and recruitment decision directly delivered to your inbox.',
      icon: MailCheck,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            Simple 5-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight">
            How Hospital Recruitment Works
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            From initial registration to official hospital credentialing and decision delivery, our online recruitment pipeline is transparent, fast, and secure.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-300 font-serif group-hover:text-teal-600 transition-colors">
                      {step.number}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1 text-[11px] font-semibold text-teal-700">
                  <span>Step {idx + 1} of 5</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
