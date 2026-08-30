import React from 'react';
import hospitalLogoImg from '../assets/images/deva_hospital_logo_1788100066918.jpg';

interface HospitalLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
}

export const HospitalLogo: React.FC<HospitalLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'dark',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-16 h-16 rounded-2xl',
  };

  const textClasses = {
    sm: { title: 'text-sm', subtitle: 'text-[10px]' },
    md: { title: 'text-lg', subtitle: 'text-xs' },
    lg: { title: 'text-xl', subtitle: 'text-xs' },
    xl: { title: 'text-2xl', subtitle: 'text-sm' },
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';
  const subTextColor = variant === 'light' ? 'text-teal-300' : 'text-slate-500';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} shrink-0 overflow-hidden bg-white shadow-md border border-teal-500/30 flex items-center justify-center p-0.5`}
      >
        <img
          src={hospitalLogoImg}
          alt="Deva Hospital Emblem Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-[inherit]"
        />
      </div>
      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`${textClasses[size].title} font-bold font-serif tracking-tight ${textColor}`}>
              DEVA HOSPITAL
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-600/20 text-teal-700 border border-teal-600/30">
              CAREERS
            </span>
          </div>
          <p className={`${textClasses[size].subtitle} ${subTextColor} font-medium tracking-normal mt-0.5`}>
            Medical & Healthcare Recruitment
          </p>
        </div>
      )}
    </div>
  );
};
