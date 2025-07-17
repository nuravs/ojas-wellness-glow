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
