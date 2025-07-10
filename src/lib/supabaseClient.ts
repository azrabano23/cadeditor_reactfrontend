import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for HoloDraft
export interface HoloDraftFile {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  original_name: string;
  file_size: number;
  original_format: string;
  status: 'uploading' | 'uploaded' | 'converting' | 'converted' | 'error';
  converted_url?: string;
  original_url?: string;
  error_message?: string;
  conversion_started_at?: string;
  conversion_completed_at?: string;
}

export interface HoloDraftUser {
  id: string;
  created_at: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_type?: 'free' | 'pro' | 'enterprise';
}

// Authentication functions
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// File management functions
export async function uploadFile(file: File, userId: string): Promise<{ data: HoloDraftFile | null, error: any }> {
  try {
    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${userId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cad-files')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('cad-files')
      .getPublicUrl(filePath);

    // Insert file record into database
    const fileRecord = {
      user_id: userId,
      original_name: file.name,
      file_size: file.size,
      original_format: fileExt?.toLowerCase() || '',
      status: 'uploaded' as const,
      original_url: publicUrl,
    };

    const { data, error } = await supabase
      .from('holodraft_files')
      .insert([fileRecord])
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getUserFiles(userId: string): Promise<{ data: HoloDraftFile[] | null, error: any }> {
  const { data, error } = await supabase
    .from('holodraft_files')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function updateFileStatus(
  fileId: string, 
  status: HoloDraftFile['status'], 
  additionalData?: Partial<HoloDraftFile>
): Promise<{ data: HoloDraftFile | null, error: any }> {
  const updateData = {
    status,
    updated_at: new Date().toISOString(),
    ...additionalData,
  };

  const { data, error } = await supabase
    .from('holodraft_files')
    .update(updateData)
    .eq('id', fileId)
    .select()
    .single();

  return { data, error };
}

export async function deleteFile(fileId: string, userId: string): Promise<{ error: any }> {
  // First get the file record to find the storage path
  const { data: fileRecord, error: fetchError } = await supabase
    .from('holodraft_files')
    .select('*')
    .eq('id', fileId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !fileRecord) {
    return { error: fetchError || new Error('File not found') };
  }

  // Delete from storage if original_url exists
  if (fileRecord.original_url) {
    const path = fileRecord.original_url.split('/').pop();
    if (path) {
      await supabase.storage
        .from('cad-files')
        .remove([`uploads/${userId}/${path}`]);
    }
  }

  // Delete from database
  const { error } = await supabase
    .from('holodraft_files')
    .delete()
    .eq('id', fileId)
    .eq('user_id', userId);

  return { error };
}

// Conversion tracking
export async function startConversion(fileId: string): Promise<{ error: any }> {
  const { error } = await supabase
    .from('holodraft_files')
    .update({
      status: 'converting',
      conversion_started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', fileId);

  return { error };
}

export async function completeConversion(
  fileId: string, 
  convertedUrl: string
): Promise<{ error: any }> {
  const { error } = await supabase
    .from('holodraft_files')
    .update({
      status: 'converted',
      converted_url: convertedUrl,
      conversion_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', fileId);

  return { error };
}

export async function failConversion(
  fileId: string, 
  errorMessage: string
): Promise<{ error: any }> {
  const { error } = await supabase
    .from('holodraft_files')
    .update({
      status: 'error',
      error_message: errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq('id', fileId);

  return { error };
}

// Real-time subscriptions
export function subscribeToFileChanges(
  userId: string, 
  callback: (payload: any) => void
) {
  return supabase
    .channel('holodraft_files_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'holodraft_files',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

// Analytics and usage tracking
export async function trackFileUpload(userId: string, fileSize: number, format: string) {
  const { error } = await supabase
    .from('holodraft_analytics')
    .insert([{
      user_id: userId,
      event_type: 'file_upload',
      metadata: {
        file_size: fileSize,
        format: format,
      },
    }]);

  return { error };
}

export async function trackConversion(userId: string, inputFormat: string, outputFormat: string, conversionTime: number) {
  const { error } = await supabase
    .from('holodraft_analytics')
    .insert([{
      user_id: userId,
      event_type: 'file_conversion',
      metadata: {
        input_format: inputFormat,
        output_format: outputFormat,
        conversion_time_ms: conversionTime,
      },
    }]);

  return { error };
}
