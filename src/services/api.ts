import {
  User,
  Job,
  Application,
  AdminStats,
  EmailLog,
  JobFilters,
  ApplicationStatus,
} from '../types.js';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('deva_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  async register(data: {
    full_name: string;
    email: string;
    phone: string;
    username?: string;
    password: string;
    confirm_password: string;
  }): Promise<{ message: string; token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async login(data: {
    email?: string;
    username?: string;
    identifier?: string;
    password: string;
  }): Promise<{ message: string; token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async updateProfile(data: {
    full_name?: string;
    username?: string;
    email?: string;
    phone?: string;
    current_password?: string;
    new_password?: string;
  }): Promise<{ message: string; token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },

  // Jobs
  async getJobs(filters?: Partial<JobFilters>): Promise<{ count: number; jobs: Job[] }> {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'All') params.set('category', filters.category);
    if (filters?.department && filters.department !== 'All') params.set('department', filters.department);
    if (filters?.location) params.set('location', filters.location);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.status) params.set('status', filters.status);

    const qs = params.toString();
    const url = `${API_BASE}/jobs${qs ? `?${qs}` : ''}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async getJobById(id: number): Promise<{ job: Job }> {
    const res = await fetch(`${API_BASE}/jobs/${id}`);
    return handleResponse(res);
  },

  async adminCreateJob(jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Promise<{ message: string; job: Job }> {
    const res = await fetch(`${API_BASE}/jobs/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(jobData),
    });
    return handleResponse(res);
  },

  async adminUpdateJob(id: number, jobData: Partial<Job>): Promise<{ message: string; job: Job }> {
    const res = await fetch(`${API_BASE}/jobs/admin/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(jobData),
    });
    return handleResponse(res);
  },

  async adminDeleteJob(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/jobs/admin/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Applications
  async submitApplication(formData: FormData): Promise<{
    message: string;
    application: Application;
    email_status: string;
  }> {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return handleResponse(res);
  },

  async getMyApplications(): Promise<{ count: number; applications: Application[] }> {
    const res = await fetch(`${API_BASE}/applications/my-applications`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getApplicationById(id: number): Promise<{ application: Application }> {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async adminGetAllApplications(filters?: {
    status?: ApplicationStatus;
    jobId?: number;
    search?: string;
  }): Promise<{ count: number; applications: Application[] }> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.jobId) params.set('jobId', String(filters.jobId));
    if (filters?.search) params.set('search', filters.search);

    const qs = params.toString();
    const url = `${API_BASE}/applications/admin/all${qs ? `?${qs}` : ''}`;
    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async adminUpdateApplicationStatus(
    id: number,
    status: ApplicationStatus,
    payload?: {
      message?: string;
      interview_details?: any;
      sender_name?: string;
      subject?: string;
    }
  ): Promise<{ message: string; application: Application; email_status: string }> {
    const res = await fetch(`${API_BASE}/applications/admin/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status, ...payload }),
    });
    return handleResponse(res);
  },

  async adminRespondToApplicant(
    id: number,
    responsePayload: {
      subject?: string;
      message: string;
      status?: ApplicationStatus;
      interview_details?: any;
      sender_name?: string;
      sender_role?: string;
    }
  ): Promise<{ message: string; application: Application; email_status: string }> {
    const res = await fetch(`${API_BASE}/applications/admin/${id}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(responsePayload),
    });
    return handleResponse(res);
  },

  // Admin Stats & Email Logs
  async adminGetStats(): Promise<{ stats: AdminStats }> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async adminGetEmailLogs(): Promise<{ count: number; logs: EmailLog[] }> {
    const res = await fetch(`${API_BASE}/admin/email-logs`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async adminResetData(): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/admin/reset-data`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },
};
