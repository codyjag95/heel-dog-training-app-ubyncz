/**
 * Funnel analytics. Writes to the app_events table in Supabase.
 * Works signed-in or anonymous (user_id null). Fire-and-forget:
 * analytics must never slow down or break the app.
 *
 * Key events: quiz_started, quiz_completed, paywall_viewed,
 * paywall_dismissed, purchase_started, purchase_success, lesson_completed
 */
import { supabase } from '../lib/supabase';

export function logEvent(event: string, properties: Record<string, any> = {}): void {
  (async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id ?? null;
      await supabase.from('app_events').insert({ user_id: userId, event, properties });
    } catch {
      // Silence is correct here
    }
  })();
}
