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
      keep_alive: {
        Row: {
          is_set: boolean
        }
        Insert: {
          is_set: boolean
        }
        Update: {
          is_set?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          id: string
          mode: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name: string
          id: string
          mode?: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          mode?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          archived: boolean | null
          archived_at: string | null
          created_at: string
          deleted: boolean | null
          deleted_at: string | null
          hex_color: string
          name: string
          project_uid: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          archived?: boolean | null
          archived_at?: string | null
          created_at?: string
          deleted?: boolean | null
          deleted_at?: string | null
          hex_color: string
          name: string
          project_uid?: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          archived?: boolean | null
          archived_at?: string | null
          created_at?: string
          deleted?: boolean | null
          deleted_at?: string | null
          hex_color?: string
          name?: string
          project_uid?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      records: {
        Row: {
          created_at: string
          deleted: boolean | null
          deleted_at: string | null
          ended_at: string | null
          project_uid: string | null
          record_uid: string
          started_at: string
          task_uid: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          deleted_at?: string | null
          ended_at?: string | null
          project_uid?: string | null
          record_uid?: string
          started_at?: string
          task_uid?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          deleted_at?: string | null
          ended_at?: string | null
          project_uid?: string | null
          record_uid?: string
          started_at?: string
          task_uid?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "records_project_uid_fkey"
            columns: ["project_uid"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_uid"]
          },
          {
            foreignKeyName: "records_task_uid_fkey"
            columns: ["task_uid"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["task_uid"]
          },
        ]
      }
      tasks: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          deleted: boolean | null
          deleted_at: string | null
          name: string
          project_uid: string | null
          slug: string
          task_uid: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          deleted?: boolean | null
          deleted_at?: string | null
          name: string
          project_uid?: string | null
          slug: string
          task_uid?: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          deleted?: boolean | null
          deleted_at?: string | null
          name?: string
          project_uid?: string | null
          slug?: string
          task_uid?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_uid_fkey"
            columns: ["project_uid"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_uid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      coalesce_updated_at_or_created_at_sort: {
        Args: {
          target_table: string
          selected_columns?: string
          sort_direction?: string
          nulls_position?: string
          where_clause?: string
        }
        Returns: Json[]
      }
      uuid_generate_v7: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v8: {
        Args: Record<PropertyKey, never>
        Returns: string
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
  public: {
    Enums: {},
  },
} as const
