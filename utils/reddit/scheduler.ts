import { SupabaseClient } from '@supabase/supabase-js';
import { getScheduleJob } from '@/utils/supabase/admin';
import type { Tables } from '@/types_db';

type Subreddit = Tables<'subreddits'>;

export class Scheduler {
  private readonly _name: string = 'reddit_scanner';

  constructor(private supabase: SupabaseClient) {}

  async scan(size: number = 30): Promise<Subreddit[] | undefined> {
    const scheduler = await getScheduleJob(this._name);
    if (!scheduler) {
      console.error(`${this._name} scheduler not found.`);
      return undefined;
    }

    if (!scheduler.start_time) {
      console.error(`${this._name} scheduler start time is null.`);
      return undefined;
    }

    if (!scheduler.enabled) {
      console.warn(`${this._name} scheduler is disabled.`);
      return undefined;
    }

    const startAt = new Date(scheduler.start_time);

    const { data, error } = await this.supabase
      .from('subreddits')
      .select('*')
      .or(`scanned_at.lt.${startAt.toISOString()},scanned_at.is.null`)
      .limit(size);

    if (error) {
      console.error('Failed to scan subreddits:', error);
      return [];
    }

    if (data.length > 0) {
      // mark these subreddits as scanned
      await this.markAsScanned(data);
    }

    console.log(`Scheduler scanned ${data.length} subreddits for processing.`);

    return data;
  }

  async restart() {
    const { error } = await this.supabase
      .from('schedule_jobs')
      .update({
        start_time: new Date().toISOString(),
      })
      .eq('name', this._name);

    if (error) {
      console.error('Failed to restart scheduler: ', error);
    } else {
      console.log('Scheduler restarted.');
    }
  }

  private async markAsScanned(subreddits: Subreddit[]) {
    const scannedAt = new Date().toISOString();
    const { error } = await this.supabase
      .from('subreddits')
      .update({ scanned_at: scannedAt })
      .in(
        'id',
        subreddits.map((s) => s.id),
      );

    if (error) {
      console.error('Failed to mark subreddits as scanned:', error);
    }
  }
}
