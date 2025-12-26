export type ApplicationStatus = 'not_applied' | 'applied' | 'offer' | 'rejected';
export type ApplicationMethod = 'email' | 'form' | 'link';
export type WorkMode = 'onsite' | 'remote' | 'hybrid';
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';

export interface Internship {
  id?: string;
  created_at?: string;
  updated_at?: string;
  company_name: string;
  industry: string;
  company_size: CompanySize;
  position: string;
  tech_stack: string;
  country: string;
  city: string;
  work_mode: WorkMode;
  application_date: string;
  application_method: ApplicationMethod;
  application_reference: string;
  status: ApplicationStatus;
  resume_version?: string;
  resume_url?: string;
  motivation_version?: string;
  motivation_url?: string;
  notes?: string;
}

export interface InternshipStats {
  total: number;
  notApplied: number;
  applied: number;
  offers: number;
  rejected: number;
}