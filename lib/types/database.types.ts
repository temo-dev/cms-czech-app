export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_speaking_attempts: {
        Row: {
          audio_key: string | null
          corrected_answer: string | null
          created_at: string
          error_message: string | null
          exercise_id: string | null
          id: string
          improvements: string[] | null
          issues: Json | null
          metrics: Json | null
          overall_score: number | null
          status: string
          strengths: string[] | null
          transcript: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          audio_key?: string | null
          corrected_answer?: string | null
          created_at?: string
          error_message?: string | null
          exercise_id?: string | null
          id?: string
          improvements?: string[] | null
          issues?: Json | null
          metrics?: Json | null
          overall_score?: number | null
          status?: string
          strengths?: string[] | null
          transcript?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          audio_key?: string | null
          corrected_answer?: string | null
          created_at?: string
          error_message?: string | null
          exercise_id?: string | null
          id?: string
          improvements?: string[] | null
          issues?: Json | null
          metrics?: Json | null
          overall_score?: number | null
          status?: string
          strengths?: string[] | null
          transcript?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_speaking_attempts_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_speaking_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_speaking_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_writing_attempts: {
        Row: {
          answer_text: string | null
          corrected_essay: string | null
          created_at: string
          error_message: string | null
          exercise_id: string | null
          grammar_notes: Json | null
          id: string
          metrics: Json | null
          overall_score: number | null
          prompt_text: string | null
          rubric_type: string | null
          status: string
          updated_at: string
          user_id: string | null
          vocabulary_notes: Json | null
        }
        Insert: {
          answer_text?: string | null
          corrected_essay?: string | null
          created_at?: string
          error_message?: string | null
          exercise_id?: string | null
          grammar_notes?: Json | null
          id?: string
          metrics?: Json | null
          overall_score?: number | null
          prompt_text?: string | null
          rubric_type?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          vocabulary_notes?: Json | null
        }
        Update: {
          answer_text?: string | null
          corrected_essay?: string | null
          created_at?: string
          error_message?: string | null
          exercise_id?: string | null
          grammar_notes?: Json | null
          id?: string
          metrics?: Json | null
          overall_score?: number | null
          prompt_text?: string | null
          rubric_type?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          vocabulary_notes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_writing_attempts_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_writing_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_writing_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string
          duration_days: number
          id: string
          instructor_bio: string | null
          instructor_name: string | null
          is_premium: boolean
          order_index: number
          skill: string
          slug: string
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          duration_days?: number
          id?: string
          instructor_bio?: string | null
          instructor_name?: string | null
          is_premium?: boolean
          order_index?: number
          skill: string
          slug: string
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          duration_days?: number
          id?: string
          instructor_bio?: string | null
          instructor_name?: string | null
          is_premium?: boolean
          order_index?: number
          skill?: string
          slug?: string
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      dm_members: {
        Row: {
          joined_at: string
          last_read_at: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string
          last_read_at?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          joined_at?: string
          last_read_at?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "dm_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      dm_messages: {
        Row: {
          attachment_mime: string | null
          attachment_name: string | null
          attachment_size: number | null
          attachment_url: string | null
          body: string | null
          created_at: string
          id: string
          message_type: string
          room_id: string
          sender_id: string | null
        }
        Insert: {
          attachment_mime?: string | null
          attachment_name?: string | null
          attachment_size?: number | null
          attachment_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          message_type?: string
          room_id: string
          sender_id?: string | null
        }
        Update: {
          attachment_mime?: string | null
          attachment_name?: string | null
          attachment_size?: number | null
          attachment_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          message_type?: string
          room_id?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dm_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "dm_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      dm_rooms: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id?: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      exam_attempts: {
        Row: {
          answers: Json
          exam_id: string
          id: string
          remaining_seconds: number
          started_at: string
          status: string
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          answers?: Json
          exam_id: string
          id?: string
          remaining_seconds?: number
          started_at?: string
          status?: string
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json
          exam_id?: string
          id?: string
          remaining_seconds?: number
          started_at?: string
          status?: string
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_attempts_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_results: {
        Row: {
          attempt_id: string
          created_at: string
          id: string
          pass_threshold: number
          section_scores: Json
          total_score: number
          user_id: string | null
          weak_skills: string[]
        }
        Insert: {
          attempt_id: string
          created_at?: string
          id?: string
          pass_threshold?: number
          section_scores?: Json
          total_score?: number
          user_id?: string | null
          weak_skills?: string[]
        }
        Update: {
          attempt_id?: string
          created_at?: string
          id?: string
          pass_threshold?: number
          section_scores?: Json
          total_score?: number
          user_id?: string | null
          weak_skills?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "exam_results_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "exam_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_sections: {
        Row: {
          exam_id: string
          id: string
          label: string
          order_index: number
          question_count: number
          section_duration_minutes: number | null
          skill: string
        }
        Insert: {
          exam_id: string
          id?: string
          label: string
          order_index?: number
          question_count?: number
          section_duration_minutes?: number | null
          skill: string
        }
        Update: {
          exam_id?: string
          id?: string
          label?: string
          order_index?: number
          question_count?: number
          section_duration_minutes?: number | null
          skill?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_sections_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          is_active: boolean
          title: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          title: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          title?: string
        }
        Relationships: []
      }
      exercise_attempts: {
        Row: {
          answer: Json
          attempted_at: string
          exercise_id: string
          id: string
          is_correct: boolean
          lesson_block_id: string | null
          user_id: string
          xp_awarded: number
        }
        Insert: {
          answer?: Json
          attempted_at?: string
          exercise_id: string
          id?: string
          is_correct?: boolean
          lesson_block_id?: string | null
          user_id: string
          xp_awarded?: number
        }
        Update: {
          answer?: Json
          attempted_at?: string
          exercise_id?: string
          id?: string
          is_correct?: boolean
          lesson_block_id?: string | null
          user_id?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "exercise_attempts_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_attempts_lesson_block_id_fkey"
            columns: ["lesson_block_id"]
            isOneToOne: false
            referencedRelation: "lesson_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          asset_urls: string[]
          content_json: Json
          created_at: string
          difficulty: string
          id: string
          points: number
          skill: string | null
          type: string
          xp_reward: number
        }
        Insert: {
          asset_urls?: string[]
          content_json?: Json
          created_at?: string
          difficulty?: string
          id?: string
          points?: number
          skill?: string | null
          type: string
          xp_reward?: number
        }
        Update: {
          asset_urls?: string[]
          content_json?: Json
          created_at?: string
          difficulty?: string
          id?: string
          points?: number
          skill?: string | null
          type?: string
          xp_reward?: number
        }
        Relationships: []
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: string
        }
        Relationships: []
      }
      leaderboard_weekly: {
        Row: {
          avatar_url: string | null
          display_name: string
          id: string
          user_id: string
          week_start: string
          weekly_xp: number
        }
        Insert: {
          avatar_url?: string | null
          display_name: string
          id?: string
          user_id: string
          week_start?: string
          weekly_xp?: number
        }
        Update: {
          avatar_url?: string | null
          display_name?: string
          id?: string
          user_id?: string
          week_start?: string
          weekly_xp?: number
        }
        Relationships: []
      }
      lesson_block_exercises: {
        Row: {
          block_id: string
          exercise_id: string
          id: string
          order_index: number
        }
        Insert: {
          block_id: string
          exercise_id: string
          id?: string
          order_index?: number
        }
        Update: {
          block_id?: string
          exercise_id?: string
          id?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_block_exercises_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "lesson_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_block_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_blocks: {
        Row: {
          id: string
          lesson_id: string
          order_index: number
          type: string
        }
        Insert: {
          id?: string
          lesson_id: string
          order_index?: number
          type: string
        }
        Update: {
          id?: string
          lesson_id?: string
          order_index?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_blocks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          bonus_unlocked: boolean
          bonus_xp_cost: number
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          module_id: string
          order_index: number
          title: string
        }
        Insert: {
          bonus_unlocked?: boolean
          bonus_xp_cost?: number
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          module_id: string
          order_index?: number
          title: string
        }
        Update: {
          bonus_unlocked?: boolean
          bonus_xp_cost?: number
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          module_id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_locked: boolean
          order_index: number
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_locked?: boolean
          order_index?: number
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_locked?: boolean
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_streak_days: number
          daily_goal_minutes: number
          display_name: string | null
          email: string
          exam_date: string | null
          id: string
          last_activity_date: string | null
          locale: string
          notification_prefs: Json | null
          role: string
          subscription_expires_at: string | null
          subscription_tier: string
          total_xp: number
          weekly_xp: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_streak_days?: number
          daily_goal_minutes?: number
          display_name?: string | null
          email: string
          exam_date?: string | null
          id: string
          last_activity_date?: string | null
          locale?: string
          notification_prefs?: Json | null
          role?: string
          subscription_expires_at?: string | null
          subscription_tier?: string
          total_xp?: number
          weekly_xp?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_streak_days?: number
          daily_goal_minutes?: number
          display_name?: string | null
          email?: string
          exam_date?: string | null
          id?: string
          last_activity_date?: string | null
          locale?: string
          notification_prefs?: Json | null
          role?: string
          subscription_expires_at?: string | null
          subscription_tier?: string
          total_xp?: number
          weekly_xp?: number
        }
        Relationships: []
      }
      question_options: {
        Row: {
          id: string
          image_url: string | null
          is_correct: boolean
          order_index: number
          question_id: string
          text: string
        }
        Insert: {
          id?: string
          image_url?: string | null
          is_correct?: boolean
          order_index?: number
          question_id: string
          text: string
        }
        Update: {
          id?: string
          image_url?: string | null
          is_correct?: boolean
          order_index?: number
          question_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          audio_url: string | null
          correct_answer: string | null
          created_at: string
          explanation: string
          id: string
          image_url: string | null
          order_index: number
          passage_text: string | null
          points: number
          prompt: string
          section_id: string | null
          skill: string
          type: string
        }
        Insert: {
          audio_url?: string | null
          correct_answer?: string | null
          created_at?: string
          explanation?: string
          id?: string
          image_url?: string | null
          order_index?: number
          passage_text?: string | null
          points?: number
          prompt: string
          section_id?: string | null
          skill: string
          type: string
        }
        Update: {
          audio_url?: string | null
          correct_answer?: string | null
          created_at?: string
          explanation?: string
          id?: string
          image_url?: string | null
          order_index?: number
          passage_text?: string | null
          points?: number
          prompt?: string
          section_id?: string | null
          skill?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "exam_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_comments: {
        Row: {
          author_name: string | null
          body: string
          created_at: string
          id: string
          is_teacher: boolean
          review_id: string
        }
        Insert: {
          author_name?: string | null
          body: string
          created_at?: string
          id?: string
          is_teacher?: boolean
          review_id: string
        }
        Update: {
          author_name?: string | null
          body?: string
          created_at?: string
          id?: string
          is_teacher?: boolean
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_comments_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "teacher_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_reviews: {
        Row: {
          created_at: string
          id: string
          preview_text: string | null
          skill: string
          status: string
          unread_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preview_text?: string | null
          skill: string
          status?: string
          unread_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preview_text?: string | null
          skill?: string
          status?: string
          unread_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string
          id: string
          lesson_block_id: string | null
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          lesson_block_id?: string | null
          lesson_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          lesson_block_id?: string | null
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_block_id_fkey"
            columns: ["lesson_block_id"]
            isOneToOne: false
            referencedRelation: "lesson_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          id: string | null
          total_xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string | null
          total_xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string | null
          total_xp?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cms_dashboard_stats: { Args: never; Returns: Json }
      find_or_create_dm: { Args: { other_user_id: string }; Returns: string }
      increment_xp: {
        Args: { p_amount: number; p_user_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      refresh_leaderboard_weekly: { Args: never; Returns: undefined }
      unlock_lesson_bonus: {
        Args: { p_lesson_id: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
