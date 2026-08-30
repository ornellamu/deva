import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { HomeView } from './views/HomeView.js';
import { JobsView } from './views/JobsView.js';
import { JobDetailView } from './views/JobDetailView.js';
import { MyApplicationsView } from './views/MyApplicationsView.js';
import { AdminDashboardView } from './views/AdminDashboardView.js';
import { AboutView } from './views/AboutView.js';
import { AuthModal } from './components/AuthModal.js';
import { ProfileModal } from './components/ProfileModal.js';
import { ApplicationModal } from './components/ApplicationModal.js';
import { SubmissionSuccessModal } from './components/SubmissionSuccessModal.js';
import { DeploymentGuideModal } from './components/DeploymentGuideModal.js';
import { Job, JobFilters, Application } from './types.js';
import { api } from './services/api.js';

function MainApp() {
  const { user } = useAuth();

  // Navigation View
  const [currentView, setCurrentView] = useState<'home' | 'jobs' | 'job-detail' | 'my-applications' | 'admin' | 'about'>('home');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Jobs data
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Job Search Filters
  const [filters, setFilters] = useState<JobFilters>({
    category: 'All',
    department: 'All',
    search: '',
    location: '',
  });

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Success Modal
  const [submittedApplication, setSubmittedApplication] = useState<Application | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Load jobs from API
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await api.getJobs(filters);
      setJobs(res.jobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Load user applications to determine applied status
  const fetchAppliedJobs = async () => {
    if (!user) {
      setAppliedJobIds([]);
      return;
    }
    try {
      const res = await api.getMyApplications();
      const ids = res.applications.map((app) => app.job_id);
      setAppliedJobIds(ids);
    } catch (err) {
      console.error('Error fetching user applications:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  useEffect(() => {
    fetchAppliedJobs();
    if (!user) {
      if (currentView === 'admin' || currentView === 'my-applications') {
        setCurrentView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setIsAuthModalOpen(false);
      setIsProfileModalOpen(false);
    } else if (user.role !== 'admin' && currentView === 'admin') {
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [user]);

  // Derived unique departments
  const departments = Array.from(new Set(jobs.map((j) => j.department))).filter(Boolean);

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      department: 'All',
      search: '',
      location: '',
    });
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setCurrentView('job-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleApplicationSuccess = (application: Application) => {
    setIsApplicationModalOpen(false);
    setSubmittedApplication(application);
    setIsSuccessModalOpen(true);
    setAppliedJobIds((prev) => [...prev, application.job_id]);
  };

  const handleNavigate = (view: string) => {
    if (view === 'home' || view === 'jobs' || view === 'my-applications' || view === 'admin' || view === 'about') {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 text-slate-900 font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
      />

      {/* Main App Content Views */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            jobs={jobs}
            appliedJobIds={appliedJobIds}
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={handleResetFilters}
            departments={departments}
            onSelectJob={handleSelectJob}
            onViewAllJobs={() => {
              setCurrentView('jobs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
            onOpenGuide={() => setIsGuideModalOpen(true)}
          />
        )}

        {currentView === 'jobs' && (
          <JobsView
            jobs={jobs}
            appliedJobIds={appliedJobIds}
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={handleResetFilters}
            departments={departments}
            onSelectJob={handleSelectJob}
          />
        )}

        {currentView === 'job-detail' && selectedJob && (
          <JobDetailView
            job={selectedJob}
            hasApplied={appliedJobIds.includes(selectedJob.id)}
            onBack={() => {
              setCurrentView('jobs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onApply={() => setIsApplicationModalOpen(true)}
            onOpenAuth={handleOpenAuth}
            onNavigateToAdmin={() => {
              setCurrentView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'my-applications' && (
          <MyApplicationsView
            onBrowseJobs={() => {
              setCurrentView('jobs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardView
            onOpenGuide={() => setIsGuideModalOpen(true)}
            onNavigateHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            onViewJobs={() => {
              setCurrentView('jobs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenGuide={() => setIsGuideModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenGuide={() => setIsGuideModalOpen(true)}
      />

      {/* Auth Modal (Login / Register / Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          fetchAppliedJobs();
        }}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Application Submission Modal */}
      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}

      {/* Submission Success Modal with Confetti */}
      {submittedApplication && (
        <SubmissionSuccessModal
          application={submittedApplication}
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          onViewPortal={() => {
            setIsSuccessModalOpen(false);
            setCurrentView('my-applications');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* 13-Stage Full-Stack Development & Deployment Guide Modal */}
      <DeploymentGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
