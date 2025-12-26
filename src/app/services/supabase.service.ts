import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

// No-op lock function to bypass Navigator LockManager issues
const noOpLock = async (name: string, acquireTimeout: number, fn: () => Promise<any>) => {
  return await fn();
};

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          lock: noOpLock
        }
      }
    );
  }

  get client() {
    return this.supabase;
  }

  // Storage operations for PDFs
  async uploadFile(bucket: string, path: string, file: File): Promise<string | null> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return urlData.publicUrl;
  }

  async deleteFile(bucket: string, path: string): Promise<boolean> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }
}