/**
 * Cloud sync — the bridge between the phone and Supabase.
 *
 * Philosophy: the app works 100% offline (AsyncStorage stays the fast local
 * cache). When a user signs in, we push what the phone knows, pull what the
 * cloud knows, and merge. Every lesson completion after that is mirrored up
 * in the background. Lose the phone → sign in on a new one → everything's there.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const DOG_ID_KEY = '@heel_dog_id';

type LocalProgress = {
  lessonId: string;
  categoryId: string;
  completed: boolean;
  completedAt?: string;
};

const getUserId = async (): Promise<string | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id ?? null;
  } catch {
    return null;
  }
};

/**
 * Find or create this user's dog record. Caches the id locally.
 * (Multi-dog UI comes later — the schema already supports it, this just
 * manages "the current dog" for now.)
 */
export const ensureDog = async (profile: any): Promise<string | null> => {
  const userId = await getUserId();
  if (!userId) return null;

  const cached = await AsyncStorage.getItem(DOG_ID_KEY);
  if (cached) return cached;

  const name = profile?.dogName || 'My Dog';

  const { data: existing } = await supabase
    .from('dogs')
    .select('id')
    .eq('owner_id', userId)
    .eq('name', name)
    .limit(1);

  if (existing && existing.length > 0) {
    await AsyncStorage.setItem(DOG_ID_KEY, existing[0].id);
    return existing[0].id;
  }

  const { data, error } = await supabase
    .from('dogs')
    .insert({
      owner_id: userId,
      name,
      breed_id: profile?.breedId || null,
      breed_label: profile?.breed || null,
      age_label: profile?.ageLabel || null,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.log('[Sync] ensureDog failed:', error?.message);
    return null;
  }
  await AsyncStorage.setItem(DOG_ID_KEY, data.id);
  return data.id;
};

/** Store the quiz profile in the cloud (skips if a current one already exists). */
export const pushQuizProfile = async (dogId: string, profile: any): Promise<void> => {
  if (!profile) return;
  const { data: cur } = await supabase
    .from('quiz_profiles')
    .select('id')
    .eq('dog_id', dogId)
    .eq('is_current', true)
    .limit(1);
  if (cur && cur.length > 0) return;

  await supabase.from('quiz_profiles').insert({
    dog_id: dogId,
    answers: profile,
    energy_level: profile.energyLevel ?? null,
    experience: profile.experience ?? null,
    motivation_type: profile.motivationType ?? null,
    availability_minutes: profile.availability ?? null,
    challenges: profile.challenges ?? null,
    recommended_categories: profile.recommendedCategories ?? null,
  });
};

/** Mirror the full local progress list up (duplicates silently ignored). */
export const pushProgress = async (dogId: string, progress: LocalProgress[]): Promise<void> => {
  if (!progress || progress.length === 0) return;
  const rows = progress.map(p => ({
    dog_id: dogId,
    category_id: p.categoryId,
    lesson_id: p.lessonId,
    completed_at: p.completedAt || new Date().toISOString(),
  }));
  const { error } = await supabase
    .from('lesson_progress')
    .upsert(rows, { onConflict: 'dog_id,category_id,lesson_id', ignoreDuplicates: true });
  if (error) console.log('[Sync] pushProgress error:', error.message);
};

/** Mirror a single new completion (fire-and-forget from markLessonComplete). */
export const pushLessonCompletion = async (categoryId: string, lessonId: string): Promise<void> => {
  const userId = await getUserId();
  if (!userId) return; // not signed in — purely local, that's fine
  const dogId = await AsyncStorage.getItem(DOG_ID_KEY);
  if (!dogId) return;
  await supabase.from('lesson_progress').upsert(
    {
      dog_id: dogId,
      category_id: categoryId,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'dog_id,category_id,lesson_id', ignoreDuplicates: true }
  );
};

/** Pull the cloud's copy of progress for this dog. */
export const pullProgress = async (dogId: string): Promise<LocalProgress[]> => {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('category_id, lesson_id, completed_at')
    .eq('dog_id', dogId);
  if (error || !data) return [];
  return data.map((r: any) => ({
    lessonId: r.lesson_id,
    categoryId: r.category_id,
    completed: true,
    completedAt: r.completed_at,
  }));
};

/** Check the server-side entitlement (the eventual single source of premium truth). */
export const fetchCloudPremium = async (): Promise<boolean> => {
  const userId = await getUserId();
  if (!userId) return false;
  const { data } = await supabase
    .from('entitlements')
    .select('status, expires_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (!data) return false;
  const activeStatuses = ['active', 'trial', 'beta', 'promo'];
  if (!activeStatuses.includes(data.status)) return false;
  if (data.expires_at && new Date(data.expires_at) <= new Date()) return false;
  return true;
};

/** Redeem a promo code via the server-side function. Returns 'ok' | 'invalid' | 'exhausted' | 'error'. */
export const redeemPromoCode = async (code: string): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc('redeem_promo', { p_code: code });
    if (error) return 'error';
    return data as string;
  } catch {
    return 'error';
  }
};

/**
 * Permanently delete the signed-in user's account and ALL their cloud data.
 * Calls the delete_account() RPC (security definer), which removes the
 * auth.users row; every data table cascades off that. Then signs out locally.
 * Required by Apple App Store guideline 5.1.1(v) for any app with accounts.
 */
export const deleteAccount = async (): Promise<boolean> => {
  const userId = await getUserId();
  if (!userId) return false;
  const { error } = await supabase.rpc('delete_account');
  if (error) {
    console.log('[Sync] deleteAccount error:', error.message);
    return false;
  }
  try { await supabase.auth.signOut(); } catch {}
  return true;
};

/**
 * The big one: full two-way sync, called on sign-in (and pull-to-refresh later).
 * Returns merged progress (union of local + cloud) and cloud premium status.
 */
export const fullSync = async (
  profile: any,
  localProgress: LocalProgress[]
): Promise<{ mergedProgress: LocalProgress[]; premiumFromCloud: boolean } | null> => {
  const userId = await getUserId();
  if (!userId) return null;

  const dogId = await ensureDog(profile);
  if (!dogId) return null;

  await pushQuizProfile(dogId, profile);
  await pushProgress(dogId, localProgress);

  const cloud = await pullProgress(dogId);

  // Union merge: anything completed anywhere counts as completed
  const byKey = new Map<string, LocalProgress>();
  [...localProgress, ...cloud].forEach(p => {
    const key = `${p.categoryId}:${p.lessonId}`;
    const prev = byKey.get(key);
    if (!prev || (p.completedAt && prev.completedAt && p.completedAt < prev.completedAt)) {
      byKey.set(key, p);
    }
  });

  const premiumFromCloud = await fetchCloudPremium();

  return { mergedProgress: Array.from(byKey.values()), premiumFromCloud };
};
