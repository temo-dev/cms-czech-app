export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type GenericRelationship = {
  foreignKeyName: string
  columns: string[]
  isOneToOne?: boolean
  referencedRelation: string
  referencedColumns: string[]
}

export interface Database {
  public: {
    Views: Record<string, never>
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          avatar_url: string | null
          locale: string | null
          exam_date: string | null
          daily_goal_minutes: number
          current_streak_days: number
          last_activity_date: string | null
          total_xp: number
          weekly_xp: number
          subscription_tier: string
          subscription_expires_at: string | null
          notification_prefs: Json
          role: string
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          locale?: string | null
          exam_date?: string | null
          daily_goal_minutes?: number
          current_streak_days?: number
          total_xp?: number
          weekly_xp?: number
          subscription_tier?: string
          subscription_expires_at?: string | null
          notification_prefs?: Json
          role?: string
          created_at?: string
        }
        Update: {
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          role?: string
          subscription_tier?: string
          subscription_expires_at?: string | null
          exam_date?: string | null
          daily_goal_minutes?: number
        }
        Relationships: GenericRelationship[]
      }
      courses: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          skill: string
          is_premium: boolean
          thumbnail_url: string | null
          order_index: number
          instructor_name: string | null
          instructor_bio: string | null
          duration_days: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          skill: string
          is_premium?: boolean
          thumbnail_url?: string | null
          order_index?: number
          instructor_name?: string | null
          instructor_bio?: string | null
          duration_days?: number
          created_at?: string
        }
        Update: {
          slug?: string
          title?: string
          description?: string | null
          skill?: string
          is_premium?: boolean
          thumbnail_url?: string | null
          order_index?: number
          instructor_name?: string | null
          instructor_bio?: string | null
          duration_days?: number
        }
        Relationships: GenericRelationship[]
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          order_index: number
          is_locked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          order_index?: number
          is_locked?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          order_index?: number
          is_locked?: boolean
        }
        Relationships: GenericRelationship[]
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string | null
          duration_minutes: number
          order_index: number
          bonus_unlocked: boolean
          bonus_xp_cost: number
          created_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description?: string | null
          duration_minutes?: number
          order_index?: number
          bonus_unlocked?: boolean
          bonus_xp_cost?: number
          created_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          duration_minutes?: number
          order_index?: number
          bonus_xp_cost?: number
        }
        Relationships: GenericRelationship[]
      }
      lesson_blocks: {
        Row: {
          id: string
          lesson_id: string
          type: string
          order_index: number
        }
        Insert: {
          id?: string
          lesson_id: string
          type: string
          order_index?: number
        }
        Update: {
          type?: string
          order_index?: number
        }
        Relationships: GenericRelationship[]
      }
      lesson_block_exercises: {
        Row: {
          id: string
          block_id: string
          exercise_id: string
          order_index: number
        }
        Insert: {
          id?: string
          block_id: string
          exercise_id: string
          order_index?: number
        }
        Update: {
          order_index?: number
        }
        Relationships: GenericRelationship[]
      }
      exercises: {
        Row: {
          id: string
          type: string
          skill: string | null
          content_json: Json
          asset_urls: string[] | null
          xp_reward: number
          difficulty: string | null
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          skill?: string | null
          content_json: Json
          asset_urls?: string[] | null
          xp_reward?: number
          difficulty?: string | null
          points?: number
          created_at?: string
        }
        Update: {
          type?: string
          skill?: string | null
          content_json?: Json
          xp_reward?: number
          difficulty?: string | null
          points?: number
        }
        Relationships: GenericRelationship[]
      }
      questions: {
        Row: {
          id: string
          section_id: string | null
          type: string
          skill: string | null
          prompt: string
          audio_url: string | null
          image_url: string | null
          passage_text: string | null
          correct_answer: string | null
          explanation: string | null
          points: number
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          section_id?: string | null
          type: string
          skill?: string | null
          prompt: string
          audio_url?: string | null
          image_url?: string | null
          passage_text?: string | null
          correct_answer?: string | null
          explanation?: string | null
          points?: number
          order_index?: number
          created_at?: string
        }
        Update: {
          section_id?: string | null
          type?: string
          skill?: string | null
          prompt?: string
          audio_url?: string | null
          image_url?: string | null
          passage_text?: string | null
          correct_answer?: string | null
          explanation?: string | null
          points?: number
          order_index?: number
        }
        Relationships: GenericRelationship[]
      }
      question_options: {
        Row: {
          id: string
          question_id: string
          text: string
          image_url: string | null
          is_correct: boolean
          order_index: number
        }
        Insert: {
          id?: string
          question_id: string
          text: string
          image_url?: string | null
          is_correct?: boolean
          order_index?: number
        }
        Update: {
          text?: string
          image_url?: string | null
          is_correct?: boolean
          order_index?: number
        }
        Relationships: GenericRelationship[]
      }
      exams: {
        Row: {
          id: string
          title: string
          duration_minutes: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          duration_minutes?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          duration_minutes?: number
          is_active?: boolean
        }
        Relationships: GenericRelationship[]
      }
      exam_sections: {
        Row: {
          id: string
          exam_id: string
          skill: string
          label: string
          question_count: number
          section_duration_minutes: number | null
          order_index: number
        }
        Insert: {
          id?: string
          exam_id: string
          skill: string
          label: string
          question_count?: number
          section_duration_minutes?: number | null
          order_index?: number
        }
        Update: {
          skill?: string
          label?: string
          question_count?: number
          section_duration_minutes?: number | null
          order_index?: number
        }
        Relationships: GenericRelationship[]
      }
      exam_attempts: {
        Row: {
          id: string
          exam_id: string
          user_id: string | null
          status: string
          answers: Json
          remaining_seconds: number | null
          started_at: string
          submitted_at: string | null
        }
        Insert: never
        Update: never
        Relationships: GenericRelationship[]
      }
      exam_results: {
        Row: {
          id: string
          attempt_id: string
          user_id: string | null
          total_score: number
          pass_threshold: number
          section_scores: Json
          weak_skills: string[] | null
          created_at: string
        }
        Insert: never
        Update: never
        Relationships: GenericRelationship[]
      }
      ai_speaking_attempts: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          audio_key: string | null
          status: string
          overall_score: number | null
          metrics: Json | null
          transcript: string | null
          issues: Json | null
          strengths: string[] | null
          improvements: string[] | null
          corrected_answer: string | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: never
        Update: never
        Relationships: GenericRelationship[]
      }
      ai_writing_attempts: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          prompt_text: string | null
          answer_text: string | null
          rubric_type: string | null
          status: string
          overall_score: number | null
          metrics: Json | null
          grammar_notes: Json | null
          vocabulary_notes: Json | null
          corrected_essay: string | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: never
        Update: never
        Relationships: GenericRelationship[]
      }
      teacher_reviews: {
        Row: {
          id: string
          user_id: string
          skill: string
          status: string
          preview_text: string | null
          unread_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill: string
          status?: string
          preview_text?: string | null
          unread_count?: number
          created_at?: string
        }
        Update: {
          status?: string
          unread_count?: number
        }
        Relationships: GenericRelationship[]
      }
      teacher_comments: {
        Row: {
          id: string
          review_id: string
          body: string
          is_teacher: boolean
          author_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          body: string
          is_teacher?: boolean
          author_name?: string | null
          created_at?: string
        }
        Update: {
          body?: string
        }
        Relationships: GenericRelationship[]
      }
      leaderboard_weekly: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          avatar_url: string | null
          weekly_xp: number
          week_start: string
        }
        Insert: never
        Update: never
        Relationships: GenericRelationship[]
      }
    }
    Functions: {
      cms_dashboard_stats: {
        Args: Record<string, never>
        Returns: Json
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
