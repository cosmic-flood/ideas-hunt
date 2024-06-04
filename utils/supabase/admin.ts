import { toDateTime } from '@/utils/helpers';
import { stripe } from '@/utils/stripe/config';
import Stripe from 'stripe';
import type { Tables, TablesInsert } from 'types_db';
import { createAdminClient } from '@/utils/supabase/admin-client';

type Product = Tables<'products'>;
type Price = Tables<'prices'>;

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createAdminClient();

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error: upsertError } = await supabaseAdmin
    .from('products')
    .upsert([productData]);
  if (upsertError)
    throw new Error(`Product insert/update failed: ${upsertError.message}`);
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3,
) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    description: price.nickname ?? null,
    metadata: price.metadata,
    active: price.active,
    currency: price.currency,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
  };

  const { error: upsertError } = await supabaseAdmin
    .from('prices')
    .upsert([priceData]);

  if (upsertError?.message.includes('foreign key constraint')) {
    if (retryCount < maxRetries) {
      console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await upsertPriceRecord(price, retryCount + 1, maxRetries);
    } else {
      throw new Error(
        `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`,
      );
    }
  } else if (upsertError) {
    throw new Error(`Price insert/update failed: ${upsertError.message}`);
  } else {
    console.log(`Price inserted/updated: ${price.id}`);
  }
};

const deleteProductRecord = async (product: Stripe.Product) => {
  const { error: deletionError } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', product.id);
  if (deletionError)
    throw new Error(`Product deletion failed: ${deletionError.message}`);
  console.log(`Product deleted: ${product.id}`);
};

const deletePriceRecord = async (price: Stripe.Price) => {
  const { error: deletionError } = await supabaseAdmin
    .from('prices')
    .delete()
    .eq('id', price.id);
  if (deletionError)
    throw new Error(`Price deletion failed: ${deletionError.message}`);
  console.log(`Price deleted: ${price.id}`);
};

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  const { error: upsertError } = await supabaseAdmin
    .from('customers')
    .upsert([{ id: uuid, stripe_customer_id: customerId }]);

  if (upsertError)
    throw new Error(
      `Supabase customer record creation failed: ${upsertError.message}`,
    );

  return customerId;
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error('Stripe customer creation failed.');

  return newCustomer.id;
};

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  // Check if the customer already exists in Supabase
  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', uuid)
      .maybeSingle();

  if (queryError) {
    throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
  }

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined;
  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id,
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from('customers')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', uuid);

      if (updateError)
        throw new Error(
          `Supabase customer record update failed: ${updateError.message}`,
        );
      console.warn(
        `Supabase customer record mismatched Stripe ID. Supabase record updated.`,
      );
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  } else {
    console.warn(
      `Supabase customer record was missing. A new record was created.`,
    );

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert,
    );
    if (!upsertedStripeCustomer)
      throw new Error('Supabase customer record creation failed.');

    return upsertedStripeCustomer;
  }
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod,
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq('id', uuid);
  if (updateError)
    throw new Error(`Customer update failed: ${updateError.message}`);
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false,
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (noCustomerError)
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`);

  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData: TablesInsert<'subscriptions'> = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    //TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.current_period_start,
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.current_period_end,
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null,
  };

  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);
  if (upsertError)
    throw new Error(
      `Subscription insert/update failed: ${upsertError.message}`,
    );
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`,
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod,
    );
};

/******************* reddit start **********************/
type ScheduleJob = Tables<'schedule_jobs'>;
type Subreddit = Tables<'subreddits'>;
type RedditSubmission = Tables<'reddit_submissions'>;

const getScheduleJob = async (jobName: string): Promise<ScheduleJob | null> => {
  const { data, error } = await supabaseAdmin
    .from('schedule_jobs')
    .select('*')
    .eq('name', jobName)
    .single();

  if (error) {
    return null;
  }

  return data;
};

const saveScheduleJobStartTime = async (jobName: string, dateTime: Date) => {
  const { error } = await supabaseAdmin
    .from('schedule_jobs')
    .update({
      start_time: dateTime.toISOString(),
    })
    .eq('name', jobName);

  if (error) {
    console.error('Error saving ScheduleJob start_time', error);
  }
};

const scanSubreddits = async (
  time: Date,
  limit: number = 20,
): Promise<Subreddit[]> => {
  const { data, error } = await supabaseAdmin
    .from('subreddits')
    .select('*')
    .or(`scanned_at.lt.${time.toISOString()},scanned_at.is.null`)
    .limit(limit);

  if (error) {
    return [];
  }

  for (let subreddit of data!) {
    subreddit.scanned_at = new Date().toISOString();
    await saveSubredditLatestScan(subreddit);
  }

  return data;
};

const getLatestSubmissionBefore = async (
  submissionName: string,
): Promise<string | null> => {
  const { data, error } = await supabaseAdmin
    .rpc('get_latest_submission_before', {
      submission_name: submissionName,
    })
    .returns<string>();

  if (error) {
    console.log(`No submission found before ${submissionName}`);
    return null;
  }

  return data;
};

const saveSubredditLatestScan = async (subreddit: Subreddit) => {
  const { error } = await supabaseAdmin
    .from('subreddits')
    .update({
      latest_scanned_submission_name: subreddit.latest_scanned_submission_name,
      scanned_at: subreddit.scanned_at,
    })
    .eq('id', subreddit.id);

  if (error) {
    console.error('Error saving latest scanned submission', error);
  }
};

const insertRedditSubmissions = async (
  redditSubmission: RedditSubmission[],
) => {
  const { error } = await supabaseAdmin
    .from('reddit_submissions')
    .insert(redditSubmission);

  if (error) {
    console.error('Error inserting reddit submissions', error);
  }
};

/******************* reddit end **********************/

/******************* openai start **********************/

interface SubredditForScore {
  project_id: string;
  project_name: string;
  project_description: string;
  project_relevance_threshold: number;
  subreddit_id: string;
  subreddit_name: string;
}

const getSubredditsForScoreScanner = async (
  time: Date,
  limit: number = 10,
): Promise<SubredditForScore[]> => {
  const { data, error } = await supabaseAdmin
    .rpc('get_subreddits_for_score_scanner', {
      start_time: time.toISOString(),
      size: limit,
    })
    .returns<SubredditForScore[]>();

  if (error) {
    return [];
  }

  return data;
};

const fetchNotRatedRedditSubmissions = async (
  projectId: string,
  subredditId: string,
  limit: number = 20,
): Promise<RedditSubmission[]> => {
  const { data, error } = await supabaseAdmin.rpc('getnotratedsubmissions', {
    projectid: projectId,
    subredditid: subredditId,
    num: limit,
  });

  if (error) {
    return [];
  }

  return data;
};

type SubmissionScore = Tables<'reddit_submissions_scores'>;

const insertSubmissionScores = async (submissionScores: SubmissionScore[]) => {
  const { error } = await supabaseAdmin
    .from('reddit_submissions_scores')
    .insert(submissionScores);

  if (error) {
    console.error('Error inserting reddit submissions', error);
  }
};

const updateProjectRedditScanAt = async (
  projectId: string,
  subredditId: string,
  dateTime: Date,
) => {
  const { error } = await supabaseAdmin
    .from('projects_subreddits')
    .update({
      scanned_at: dateTime.toISOString(),
    })
    .eq('project_id', projectId)
    .eq('subreddit_id', subredditId);

  if (error) {
    console.error('Error saving latest scanned submission', error);
  }
};

/******************* openai end **********************/
/******************* notifications start **********************/
type Notification = Tables<'notifications'>;

const insertNotifications = async (notifications: Notification[]) => {
  const { error } = await supabaseAdmin
    .from('notifications')
    .insert(notifications);

  if (error) {
    console.error('Error inserting notifications', error, notifications);
  }
};

const fetchNotSentNotifications = async (
  limit: number = 10,
): Promise<Notification[]> => {
  const { data, error } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .is('email_sent_at', null)
    .limit(limit);

  if (error) {
    return [];
  }

  return data;
};

const updateNotificationSentTime = async (notificationId: string) => {
  const { error } = await supabaseAdmin
    .from('notifications')
    .update({
      email_sent_at: new Date().toISOString(),
    })
    .eq('id', notificationId);

  if (error) {
    console.error('Error setNotificationAsSent', error);
  }
};

interface EmailRecipient {
  name: string;
  email: string;
}

const fetchNotificationRecipients = async (
  projectId: string,
): Promise<EmailRecipient[]> => {
  const { data: project, error: projectError } = await supabaseAdmin
    .from('projects')
    .select('email_recipients, user_id')
    .eq('id', projectId)
    .single();

  if (projectError) {
    return [];
  }

  if (
    project.email_recipients !== null &&
    (project.email_recipients as any[]).length > 0
  ) {
    return project.email_recipients as unknown as EmailRecipient[];
  }

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.getUserById(project.user_id!);

  if (userError) {
    return [];
  }

  return [{ name: '', email: userData.user.email! }];
};

/******************* notifications end **********************/

export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,

  /******************* reddit start **********************/
  getScheduleJob,
  saveScheduleJobStartTime,
  scanSubreddits,
  saveSubredditLatestScan,
  insertRedditSubmissions,
  getLatestSubmissionBefore,
  /******************* reddit end **********************/
  /******************* openai start **********************/
  getSubredditsForScoreScanner,
  fetchNotRatedRedditSubmissions,
  insertSubmissionScores,
  updateProjectRedditScanAt,
  /******************* openai end **********************/
  /******************* notifications start **********************/
  insertNotifications,
  fetchNotSentNotifications,
  updateNotificationSentTime,
  fetchNotificationRecipients,
  /******************* notifications end **********************/
};

export type { SubredditForScore, Notification };
