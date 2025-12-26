import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Internship, InternshipStats, ApplicationStatus } from '../models/internship.model';

@Injectable({
  providedIn: 'root'
})
export class InternshipService {
  private readonly tableName = 'internships';
  private readonly bucketName = 'internship-documents';

  constructor(private supabase: SupabaseService) {}

  // Derive status based on application date
  deriveStatus(internship: Internship): ApplicationStatus {
    // If manually set to offer or rejected, keep it
    if (internship.status === 'offer' || internship.status === 'rejected') {
      return internship.status;
    }

    // Otherwise, derive from application date
    if (internship.application_date) {
      return 'applied';
    }

    return 'not_applied';
  }

  async getAll(): Promise<Internship[]> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching internships:', error);
      return [];
    }

    return data || [];
  }

  async getById(id: string): Promise<Internship | null> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching internship:', error);
      return null;
    }

    return data;
  }

  async create(internship: Internship): Promise<Internship | null> {
    internship.status = this.deriveStatus(internship);
    
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .insert([internship])
      .select()
      .single();

    if (error) {
      console.error('Error creating internship:', error);
      return null;
    }

    return data;
  }

  async update(id: string, internship: Partial<Internship>): Promise<Internship | null> {
    internship.updated_at = new Date().toISOString();
    
    if (internship.application_date !== undefined || internship.status) {
      const fullInternship = internship as Internship;
      internship.status = this.deriveStatus(fullInternship);
    }

    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .update(internship)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating internship:', error);
      return null;
    }

    return data;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting internship:', error);
      return false;
    }

    return true;
  }

  // PDF upload for resume
  async uploadResume(internshipId: string, file: File): Promise<string | null> {
    const filePath = `${internshipId}/resume_${Date.now()}.pdf`;
    const url = await this.supabase.uploadFile(this.bucketName, filePath, file);
    
    if (url) {
      await this.update(internshipId, { resume_url: url });
    }

    return url;
  }

  // PDF upload for motivation letter
  async uploadMotivationLetter(internshipId: string, file: File): Promise<string | null> {
    const filePath = `${internshipId}/motivation_${Date.now()}.pdf`;
    const url = await this.supabase.uploadFile(this.bucketName, filePath, file);
    
    if (url) {
      await this.update(internshipId, { motivation_url: url });
    }

    return url;
  }

  // Delete PDFs from storage
  async deleteDocument(internshipId: string, type: 'resume' | 'motivation'): Promise<boolean> {
    const internship = await this.getById(internshipId);
    if (!internship) return false;

    const url = type === 'resume' ? internship.resume_url : internship.motivation_url;
    if (!url) return false;

    // Extract path from URL
    const urlParts = url.split('/');
    const filePath = `${internshipId}/${urlParts[urlParts.length - 1]}`;

    const success = await this.supabase.deleteFile(this.bucketName, filePath);
    
    if (success) {
      const updateData = type === 'resume' 
        ? { resume_url: undefined } 
        : { motivation_url: undefined };
      await this.update(internshipId, updateData);
    }

    return success;
  }

  // Get stats for dashboard
  async getStats(): Promise<InternshipStats> {
    const internships = await this.getAll();
    
    return {
      total: internships.length,
      notApplied: internships.filter(i => i.status === 'not_applied').length,
      applied: internships.filter(i => i.status === 'applied').length,
      offers: internships.filter(i => i.status === 'offer').length,
      rejected: internships.filter(i => i.status === 'rejected').length
    };
  }
}