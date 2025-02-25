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
          project_archived: boolean | null
          project_archived_at: string | null
          project_created_at: string
          project_deleted: boolean | null
          project_deleted_at: string | null
          project_hex_color: string
          project_name: string
          project_slug: string
          project_uid: string
          project_updated_at: string | null
        }
        Insert: {
          project_archived?: boolean | null
          project_archived_at?: string | null
          project_created_at?: string
          project_deleted?: boolean | null
          project_deleted_at?: string | null
          project_hex_color: string
          project_name: string
          project_slug: string
          project_uid?: string
          project_updated_at?: string | null
        }
        Update: {
          project_archived?: boolean | null
          project_archived_at?: string | null
          project_created_at?: string
          project_deleted?: boolean | null
          project_deleted_at?: string | null
          project_hex_color?: string
          project_name?: string
          project_slug?: string
          project_uid?: string
          project_updated_at?: string | null
        }
        Relationships: []
      }
      records: {
        Row: {
          project_uid: string | null
          record_created_at: string
          record_deleted: boolean | null
          record_deleted_at: string | null
          record_ended_at: string | null
          record_started_at: string
          record_uid: string
          record_updated_at: string | null
          task_uid: string | null
        }
        Insert: {
          project_uid?: string | null
          record_created_at?: string
          record_deleted?: boolean | null
          record_deleted_at?: string | null
          record_ended_at?: string | null
          record_started_at?: string
          record_uid?: string
          record_updated_at?: string | null
          task_uid?: string | null
        }
        Update: {
          project_uid?: string | null
          record_created_at?: string
          record_deleted?: boolean | null
          record_deleted_at?: string | null
          record_ended_at?: string | null
          record_started_at?: string
          record_uid?: string
          record_updated_at?: string | null
          task_uid?: string | null
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
          project_uid: string | null
          task_completed: boolean | null
          task_completed_at: string | null
          task_created_at: string
          task_deleted: boolean | null
          task_deleted_at: string | null
          task_name: string
          task_slug: string
          task_uid: string
          task_updated_at: string | null
        }
        Insert: {
          project_uid?: string | null
          task_completed?: boolean | null
          task_completed_at?: string | null
          task_created_at?: string
          task_deleted?: boolean | null
          task_deleted_at?: string | null
          task_name: string
          task_slug: string
          task_uid?: string
          task_updated_at?: string | null
        }
        Update: {
          project_uid?: string | null
          task_completed?: boolean | null
          task_completed_at?: string | null
          task_created_at?: string
          task_deleted?: boolean | null
          task_deleted_at?: string | null
          task_name?: string
          task_slug?: string
          task_uid?: string
          task_updated_at?: string | null
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
