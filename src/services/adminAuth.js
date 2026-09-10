import { getSupabase } from '../lib/supabase';

export async function getAdminStatus() {
  const supabase = getSupabase();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const user = userData.user;
  if (!user) return { user: null, admin: null, isAdmin: false };

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id,email')
    .eq('user_id', user.id)
    .maybeSingle();
  if (error) throw error;
  return { user, admin: data, isAdmin: Boolean(data) };
}

export async function signInAdmin(email, password) {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const status = await getAdminStatus();
  if (!status.isAdmin) {
    await supabase.auth.signOut();
    throw new Error('Este usuario no está habilitado como administrador.');
  }
  return status;
}

export async function signOutAdmin() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}

export function subscribeToAuth(callback) {
  return getSupabase().auth.onAuthStateChange(() => callback());
}
