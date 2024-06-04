export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          email_sent_at: string | null
          email_template: string | null
          id: string
          metadata: Json | null
          project_id: string | null
        }
        Insert: {
          email_sent_at?: string | null
          email_template?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
        }
        Update: {
          email_sent_at?: string | null
          email_template?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          email_recipients: Json | null
          id: string
          name: string | null
          relevance_threshold: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          email_recipients?: Json | null
          id?: string
          name?: string | null
          relevance_threshold?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          email_recipients?: Json | null
          id?: string
          name?: string | null
          relevance_threshold?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      projects_subreddits: {
        Row: {
          project_id: string
          scanned_at: string | null
          subreddit_id: string
        }
        Insert: {
          project_id: string
          scanned_at?: string | null
          subreddit_id: string
        }
        Update: {
          project_id?: string
          scanned_at?: string | null
          subreddit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_subreddits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_subreddits_subreddit_id_fkey"
            columns: ["subreddit_id"]
            isOneToOne: false
            referencedRelation: "subreddits"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_submissions: {
        Row: {
          content_type: string | null
          id: string
          name: string | null
          permalink: string | null
          posted_at: string | null
          reddit_id: string | null
          subreddit_id: string | null
          text: string | null
          title: string | null
          url: string | null
        }
        Insert: {
          content_type?: string | null
          id?: string
          name?: string | null
          permalink?: string | null
          posted_at?: string | null
          reddit_id?: string | null
          subreddit_id?: string | null
          text?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          content_type?: string | null
          id?: string
          name?: string | null
          permalink?: string | null
          posted_at?: string | null
          reddit_id?: string | null
          subreddit_id?: string | null
          text?: string | null
          title?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reddit_submissions_subreddit_id_fkey"
            columns: ["subreddit_id"]
            isOneToOne: false
            referencedRelation: "subreddits"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_submissions_scores: {
        Row: {
          created_at: string
          project_id: string
          reddit_submission_id: string
          score: number | null
          subreddit_id: string
        }
        Insert: {
          created_at?: string
          project_id: string
          reddit_submission_id: string
          score?: number | null
          subreddit_id: string
        }
        Update: {
          created_at?: string
          project_id?: string
          reddit_submission_id?: string
          score?: number | null
          subreddit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_subreddits_reddit_submission_reddit_submission_id_fkey"
            columns: ["reddit_submission_id"]
            isOneToOne: false
            referencedRelation: "reddit_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_subreddits_reddit_submissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_subreddits_reddit_submissions_subreddit_id_fkey"
            columns: ["subreddit_id"]
            isOneToOne: false
            referencedRelation: "subreddits"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_jobs: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          start_time: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          start_time?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          start_time?: string | null
        }
        Relationships: []
      }
      subreddits: {
        Row: {
          created_at: string | null
          id: string
          latest_scanned_submission_name: string | null
          name: string | null
          scanned_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          latest_scanned_submission_name?: string | null
          name?: string | null
          scanned_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          latest_scanned_submission_name?: string | null
          name?: string | null
          scanned_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          full_name: string | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id?: string
          payment_method?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_latest_submission_before: {
        Args: {
          submission_name: string
        }
        Returns: string
      }
      get_subreddits_for_score_scanner: {
        Args: {
          start_time: string
          size: number
        }
        Returns: Database["public"]["CompositeTypes"]["subreddit_for_score_scanner"][]
      }
      get_user_submission_score: {
        Args: {
          p_user_id: string
          query: string
        }
        Returns: Database["public"]["CompositeTypes"]["user_submission_score"][]
      }
      get_user_subreddits: {
        Args: {
          p_user_id: string
        }
        Returns: {
          created_at: string | null
          id: string
          latest_scanned_submission_name: string | null
          name: string | null
          scanned_at: string | null
        }[]
      }
      getnotratedsubmissions: {
        Args: {
          projectid: string
          subredditid: string
          num: number
        }
        Returns: {
          content_type: string | null
          id: string
          name: string | null
          permalink: string | null
          posted_at: string | null
          reddit_id: string | null
          subreddit_id: string | null
          text: string | null
          title: string | null
          url: string | null
        }[]
      }
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      subreddit_for_score_scanner: {
        project_id: string | null
        project_name: string | null
        project_description: string | null
        project_relevance_threshold: number | null
        subreddit_id: string | null
        subreddit_name: string | null
      }
      user_submission_score: {
        subreddit: string | null
        title: string | null
        posted_at: string | null
        text: string | null
        url: string | null
        permalink: string | null
        content_type: string | null
        score: number | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
