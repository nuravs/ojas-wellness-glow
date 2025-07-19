export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          appointment_type: string
          created_at: string
          doctor_name: string
          id: string
          location: string | null
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          appointment_type: string
          created_at?: string
          doctor_name: string
          id?: string
          location?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          appointment_type?: string
          created_at?: string
          doctor_name?: string
          id?: string
          location?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      brain_gym_exercises: {
        Row: {
          category: string
          created_at: string
          description: string
          difficulty_level: number
          estimated_duration: number
          id: string
          instructions: Json
          name: string
          target_skills: string[]
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          difficulty_level?: number
          estimated_duration: number
          id?: string
          instructions: Json
          name: string
          target_skills: string[]
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          difficulty_level?: number
          estimated_duration?: number
          id?: string
          instructions?: Json
          name?: string
          target_skills?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      brain_gym_sessions: {
        Row: {
          completed: boolean
          completed_at: string | null
          completion_time: number | null
          created_at: string
          difficulty_level: number
          exercise_id: string
          id: string
          mistakes_count: number | null
          score: number | null
          session_data: Json | null
          started_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          completion_time?: number | null
          created_at?: string
          difficulty_level: number
          exercise_id: string
          id?: string
          mistakes_count?: number | null
          score?: number | null
          session_data?: Json | null
          started_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          completion_time?: number | null
          created_at?: string
          difficulty_level?: number
          exercise_id?: string
          id?: string
          mistakes_count?: number | null
          score?: number | null
          session_data?: Json | null
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brain_gym_sessions_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "brain_gym_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      comorbidities: {
        Row: {
          caregiver_visible: boolean | null
          condition_name: string
          created_at: string | null
          diagnosed_date: string | null
          id: string
          notes: string | null
          severity: Database["public"]["Enums"]["severity_level"] | null
          status: Database["public"]["Enums"]["comorbidity_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          caregiver_visible?: boolean | null
          condition_name: string
          created_at?: string | null
          diagnosed_date?: string | null
          id?: string
          notes?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          status?: Database["public"]["Enums"]["comorbidity_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          caregiver_visible?: boolean | null
          condition_name?: string
          created_at?: string | null
          diagnosed_date?: string | null
          id?: string
          notes?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          status?: Database["public"]["Enums"]["comorbidity_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_routines: {
        Row: {
          completed_tasks: string[] | null
          created_at: string
          id: string
          notes: string | null
          routine_data: Json
          routine_date: string
          updated_at: string
          user_id: string
          wellness_score: number | null
        }
        Insert: {
          completed_tasks?: string[] | null
          created_at?: string
          id?: string
          notes?: string | null
          routine_data: Json
          routine_date?: string
          updated_at?: string
          user_id: string
          wellness_score?: number | null
        }
        Update: {
          completed_tasks?: string[] | null
          created_at?: string
          id?: string
          notes?: string | null
          routine_data?: Json
          routine_date?: string
          updated_at?: string
          user_id?: string
          wellness_score?: number | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          location: string | null
          logged_at: string
          notes: string | null
          severity: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          location?: string | null
          logged_at?: string
          notes?: string | null
          severity?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          location?: string | null
          logged_at?: string
          notes?: string | null
          severity?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medication_conditions: {
        Row: {
          comorbidity_id: string
          created_at: string | null
          id: string
          medication_id: string
        }
        Insert: {
          comorbidity_id: string
          created_at?: string | null
          id?: string
          medication_id: string
        }
        Update: {
          comorbidity_id?: string
          created_at?: string | null
          id?: string
          medication_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_medication_conditions_comorbidity"
            columns: ["comorbidity_id"]
            isOneToOne: false
            referencedRelation: "comorbidities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_medication_conditions_medication"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_logs: {
        Row: {
          actual_time: string | null
          created_at: string | null
          id: string
          logged_by: string
          medication_id: string
          notes: string | null
          scheduled_time: string | null
          status: string
          user_id: string
        }
        Insert: {
          actual_time?: string | null
          created_at?: string | null
          id?: string
          logged_by: string
          medication_id: string
          notes?: string | null
          scheduled_time?: string | null
          status: string
          user_id: string
        }
        Update: {
          actual_time?: string | null
          created_at?: string | null
          id?: string
          logged_by?: string
          medication_id?: string
          notes?: string | null
          scheduled_time?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          active: boolean | null
          caregiver_visible: boolean | null
          created_at: string | null
          daily_consumption: number | null
          dosage: string
          frequency: Json | null
          id: string
          instructions: string | null
          name: string
          next_refill_date: string | null
          pills_remaining: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          caregiver_visible?: boolean | null
          created_at?: string | null
          daily_consumption?: number | null
          dosage: string
          frequency?: Json | null
          id?: string
          instructions?: string | null
          name: string
          next_refill_date?: string | null
          pills_remaining?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          caregiver_visible?: boolean | null
          created_at?: string | null
          daily_consumption?: number | null
          dosage?: string
          frequency?: Json | null
          id?: string
          instructions?: string | null
          name?: string
          next_refill_date?: string | null
          pills_remaining?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      patient_caregivers: {
        Row: {
          approved_at: string | null
          caregiver_id: string | null
          id: string
          invited_at: string | null
          patient_id: string | null
          status: string | null
        }
        Insert: {
          approved_at?: string | null
          caregiver_id?: string | null
          id?: string
          invited_at?: string | null
          patient_id?: string | null
          status?: string | null
        }
        Update: {
          approved_at?: string | null
          caregiver_id?: string | null
          id?: string
          invited_at?: string | null
          patient_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_caregivers_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "patient_caregivers_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      positive_factors: {
        Row: {
          created_at: string
          factor_text: string
          id: string
          logged_date: string
          updated_at: string
          user_id: string
          wellness_score: number
        }
        Insert: {
          created_at?: string
          factor_text: string
          id?: string
          logged_date?: string
          updated_at?: string
          user_id: string
          wellness_score: number
        }
        Update: {
          created_at?: string
          factor_text?: string
          id?: string
          logged_date?: string
          updated_at?: string
          user_id?: string
          wellness_score?: number
        }
        Relationships: []
      }
      support_group_members: {
        Row: {
          anonymous: boolean
          display_name: string | null
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          anonymous?: boolean
          display_name?: string | null
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          anonymous?: boolean
          display_name?: string | null
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      support_group_posts: {
        Row: {
          anonymous: boolean
          content: string
          created_at: string
          group_id: string
          id: string
          moderated: boolean
          pinned: boolean
          post_type: string
          reply_count: number
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anonymous?: boolean
          content: string
          created_at?: string
          group_id: string
          id?: string
          moderated?: boolean
          pinned?: boolean
          post_type?: string
          reply_count?: number
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anonymous?: boolean
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          moderated?: boolean
          pinned?: boolean
          post_type?: string
          reply_count?: number
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_group_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      support_groups: {
        Row: {
          condition_focus: string | null
          created_at: string
          created_by: string
          description: string | null
          group_type: string
          id: string
          is_private: boolean
          member_count: number
          moderated: boolean
          name: string
          updated_at: string
        }
        Insert: {
          condition_focus?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          group_type: string
          id?: string
          is_private?: boolean
          member_count?: number
          moderated?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          condition_focus?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          group_type?: string
          id?: string
          is_private?: boolean
          member_count?: number
          moderated?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      symptoms: {
        Row: {
          details: Json | null
          id: string
          logged_at: string | null
          notes: string | null
          severity: number | null
          symptom_type: string
          user_id: string
        }
        Insert: {
          details?: Json | null
          id?: string
          logged_at?: string | null
          notes?: string | null
          severity?: number | null
          symptom_type: string
          user_id: string
        }
        Update: {
          details?: Json | null
          id?: string
          logged_at?: string | null
          notes?: string | null
          severity?: number | null
          symptom_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          consent_given: boolean | null
          created_at: string | null
          date_of_birth: string | null
          emergency_contact: string | null
          full_name: string
          linked_user_id: string | null
          phone: string | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          consent_given?: boolean | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          full_name: string
          linked_user_id?: string | null
          phone?: string | null
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          consent_given?: boolean | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          full_name?: string
          linked_user_id?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vitals: {
        Row: {
          created_at: string
          id: string
          measured_at: string
          notes: string | null
          out_of_range: boolean | null
          updated_at: string
          user_id: string
          values: Json
          vital_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          measured_at?: string
          notes?: string | null
          out_of_range?: boolean | null
          updated_at?: string
          user_id: string
          values: Json
          vital_type: string
        }
        Update: {
          created_at?: string
          id?: string
          measured_at?: string
          notes?: string | null
          out_of_range?: boolean | null
          updated_at?: string
          user_id?: string
          values?: Json
          vital_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_caregiver_view_patient: {
        Args: { patient_user_id: string }
        Returns: boolean
      }
      create_caregiver_request: {
        Args: { patient_user_id: string; caregiver_user_id: string }
        Returns: string
      }
      decrement_group_member_count: {
        Args: { group_id: string }
        Returns: undefined
      }
      get_patient_caregiver_relationships: {
        Args: { user_id: string }
        Returns: Json
      }
      get_user_medications: {
        Args: { medication_user_id: string }
        Returns: Json
      }
      get_user_profile: {
        Args: { profile_user_id: string }
        Returns: Json
      }
      increment_group_member_count: {
        Args: { group_id: string }
        Returns: undefined
      }
      log_medication: {
        Args: {
          med_id: string
          med_user_id: string
          log_status: string
          log_time: string
        }
        Returns: boolean
      }
      update_caregiver_request_status: {
        Args: { request_id: string; new_status: string }
        Returns: boolean
      }
      update_medication_visibility: {
        Args: { med_id: string; med_user_id: string; is_visible: boolean }
        Returns: boolean
      }
      update_user_profile: {
        Args: { profile_user_id: string; profile_updates: Json }
        Returns: Json
      }
    }
    Enums: {
      comorbidity_status: "active" | "controlled" | "monitoring" | "inactive"
      severity_level: "mild" | "moderate" | "severe"
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
    Enums: {
      comorbidity_status: ["active", "controlled", "monitoring", "inactive"],
      severity_level: ["mild", "moderate", "severe"],
    },
  },
} as const
