export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      dialects: {
        Row: {
          country_code: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          country_code: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          country_code?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          has_offline_dictionary_access: boolean
          subscription_valid_until: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          has_offline_dictionary_access?: boolean
          subscription_valid_until?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          has_offline_dictionary_access?: boolean
          subscription_valid_until?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      word_form_dialects: {
        Row: {
          dialect_id: string
          word_form_id: string
        }
        Insert: {
          dialect_id: string
          word_form_id: string
        }
        Update: {
          dialect_id?: string
          word_form_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "word_form_dialects_dialect_id_fkey"
            columns: ["dialect_id"]
            isOneToOne: false
            referencedRelation: "dialects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "word_form_dialects_word_form_id_fkey"
            columns: ["word_form_id"]
            isOneToOne: false
            referencedRelation: "word_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      word_forms: {
        Row: {
          arabic_script_variant: string | null
          audio_url: string | null
          conjugation_details: string
          created_at: string
          id: string
          transliteration: string
          updated_at: string
          word_id: string
        }
        Insert: {
          arabic_script_variant?: string | null
          audio_url?: string | null
          conjugation_details: string
          created_at?: string
          id?: string
          transliteration: string
          updated_at?: string
          word_id: string
        }
        Update: {
          arabic_script_variant?: string | null
          audio_url?: string | null
          conjugation_details?: string
          created_at?: string
          id?: string
          transliteration?: string
          updated_at?: string
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "word_forms_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
        ]
      }
      words: {
        Row: {
          created_at: string
          english_definition: string | null
          english_term: string
          general_frequency_tag: Database["public"]["Enums"]["frequency_tag"]
          id: string
          part_of_speech: string
          primary_arabic_script: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          english_definition?: string | null
          english_term: string
          general_frequency_tag?: Database["public"]["Enums"]["frequency_tag"]
          id?: string
          part_of_speech: string
          primary_arabic_script: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          english_definition?: string | null
          english_term?: string
          general_frequency_tag?: Database["public"]["Enums"]["frequency_tag"]
          id?: string
          part_of_speech?: string
          primary_arabic_script?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      frequency_tag:
        | "VERY_FREQUENT"
        | "FREQUENT"
        | "COMMON"
        | "UNCOMMON"
        | "RARE"
        | "NOT_DEFINED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      frequency_tag: [
        "VERY_FREQUENT",
        "FREQUENT",
        "COMMON",
        "UNCOMMON",
        "RARE",
        "NOT_DEFINED",
      ],
    },
  },
} as const

// Add a default export to prevent router from treating this as a route
const DatabaseTypes = {};
export default DatabaseTypes;