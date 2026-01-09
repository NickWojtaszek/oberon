/**
 * Supabase Database Type Definitions
 *
 * These types define the database schema for the Clinical Intelligence Engine.
 * They are used by the Supabase client for type-safe queries.
 *
 * To regenerate these types from your Supabase project:
 * npx supabase gen types typescript --project-id your-project-id > src/lib/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // ============================================
      // USERS & AUTHENTICATION
      // ============================================
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'pi' | 'junior' | 'statistician' | 'data_entry' | 'institutional_admin';
          institution: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'pi' | 'junior' | 'statistician' | 'data_entry' | 'institutional_admin';
          institution?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'pi' | 'junior' | 'statistician' | 'data_entry' | 'institutional_admin';
          institution?: string | null;
          updated_at?: string;
        };
      };

      // ============================================
      // PROJECTS
      // ============================================
      projects: {
        Row: {
          id: string;
          name: string;
          study_number: string;
          description: string;
          phase: string | null;
          status: 'active' | 'paused' | 'completed' | 'archived';
          owner_id: string;
          study_design: Json | null;
          study_methodology: Json | null;
          governance: Json | null;
          settings: Json | null;
          created_at: string;
          modified_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          study_number: string;
          description?: string;
          phase?: string | null;
          status?: 'active' | 'paused' | 'completed' | 'archived';
          owner_id: string;
          study_design?: Json | null;
          study_methodology?: Json | null;
          governance?: Json | null;
          settings?: Json | null;
          created_at?: string;
          modified_at?: string;
        };
        Update: {
          name?: string;
          study_number?: string;
          description?: string;
          phase?: string | null;
          status?: 'active' | 'paused' | 'completed' | 'archived';
          study_design?: Json | null;
          study_methodology?: Json | null;
          governance?: Json | null;
          settings?: Json | null;
          modified_at?: string;
        };
      };

      // Project collaborators (many-to-many)
      project_collaborators: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          role: 'pi' | 'junior' | 'statistician' | 'data_entry';
          permissions: Json;
          invited_at: string;
          accepted_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          role?: 'pi' | 'junior' | 'statistician' | 'data_entry';
          permissions?: Json;
          invited_at?: string;
          accepted_at?: string | null;
        };
        Update: {
          role?: 'pi' | 'junior' | 'statistician' | 'data_entry';
          permissions?: Json;
          accepted_at?: string | null;
        };
      };

      // ============================================
      // PROTOCOLS
      // ============================================
      protocols: {
        Row: {
          id: string;
          project_id: string;
          study_number: string;
          name: string;
          description: string | null;
          metadata: Json | null;
          created_at: string;
          modified_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          study_number: string;
          name: string;
          description?: string | null;
          metadata?: Json | null;
          created_at?: string;
          modified_at?: string;
          created_by: string;
        };
        Update: {
          study_number?: string;
          name?: string;
          description?: string | null;
          metadata?: Json | null;
          modified_at?: string;
        };
      };

      // Protocol versions (version history)
      protocol_versions: {
        Row: {
          id: string;
          protocol_id: string;
          version_number: string;
          status: 'draft' | 'active' | 'locked' | 'superseded';
          schema_blocks: Json;
          changelog: string | null;
          created_at: string;
          created_by: string;
          locked_at: string | null;
          locked_by: string | null;
        };
        Insert: {
          id?: string;
          protocol_id: string;
          version_number: string;
          status?: 'draft' | 'active' | 'locked' | 'superseded';
          schema_blocks: Json;
          changelog?: string | null;
          created_at?: string;
          created_by: string;
          locked_at?: string | null;
          locked_by?: string | null;
        };
        Update: {
          version_number?: string;
          status?: 'draft' | 'active' | 'locked' | 'superseded';
          schema_blocks?: Json;
          changelog?: string | null;
          locked_at?: string | null;
          locked_by?: string | null;
        };
      };

      // ============================================
      // CLINICAL DATA
      // ============================================
      clinical_data: {
        Row: {
          id: string;
          project_id: string;
          protocol_id: string;
          protocol_version: string;
          table_name: string;
          record_id: string;
          data: Json;
          created_at: string;
          modified_at: string;
          created_by: string;
          modified_by: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          protocol_id: string;
          protocol_version: string;
          table_name: string;
          record_id: string;
          data: Json;
          created_at?: string;
          modified_at?: string;
          created_by: string;
          modified_by?: string | null;
        };
        Update: {
          data?: Json;
          modified_at?: string;
          modified_by?: string | null;
        };
      };

      // ============================================
      // SCHEMA TEMPLATES
      // ============================================
      schema_templates: {
        Row: {
          id: string;
          project_id: string | null;  // null = global template
          name: string;
          description: string | null;
          template_type: 'section' | 'field' | 'block';
          blocks: Json;
          is_public: boolean;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          name: string;
          description?: string | null;
          template_type?: 'section' | 'field' | 'block';
          blocks: Json;
          is_public?: boolean;
          created_at?: string;
          created_by: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          template_type?: 'section' | 'field' | 'block';
          blocks?: Json;
          is_public?: boolean;
        };
      };

      // ============================================
      // PERSONAS
      // ============================================
      personas: {
        Row: {
          id: string;
          project_id: string | null;  // null = user's global persona
          user_id: string;
          name: string;
          role: 'pi' | 'junior' | 'statistician' | 'data_entry';
          email: string | null;
          permissions: Json;
          ai_autonomy_cap: 'audit-only' | 'suggest' | 'co-pilot' | 'supervisor';
          blinded: boolean;
          certified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          user_id: string;
          name: string;
          role?: 'pi' | 'junior' | 'statistician' | 'data_entry';
          email?: string | null;
          permissions?: Json;
          ai_autonomy_cap?: 'audit-only' | 'suggest' | 'co-pilot' | 'supervisor';
          blinded?: boolean;
          certified?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          role?: 'pi' | 'junior' | 'statistician' | 'data_entry';
          email?: string | null;
          permissions?: Json;
          ai_autonomy_cap?: 'audit-only' | 'suggest' | 'co-pilot' | 'supervisor';
          blinded?: boolean;
          certified?: boolean;
        };
      };

      // ============================================
      // STATISTICAL MANIFESTS
      // ============================================
      statistical_manifests: {
        Row: {
          id: string;
          project_id: string;
          protocol_id: string;
          protocol_version: string;
          manifest_data: Json;
          total_records_analyzed: number;
          generated_by: string;
          generated_at: string;
          locked: boolean;
          locked_at: string | null;
          locked_by: string | null;
          lock_reason: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          protocol_id: string;
          protocol_version: string;
          manifest_data: Json;
          total_records_analyzed?: number;
          generated_by: string;
          generated_at?: string;
          locked?: boolean;
          locked_at?: string | null;
          locked_by?: string | null;
          lock_reason?: string | null;
        };
        Update: {
          manifest_data?: Json;
          total_records_analyzed?: number;
          locked?: boolean;
          locked_at?: string | null;
          locked_by?: string | null;
          lock_reason?: string | null;
        };
      };

      // ============================================
      // MANUSCRIPTS
      // ============================================
      manuscripts: {
        Row: {
          id: string;
          project_id: string;
          protocol_id: string | null;
          title: string;
          project_meta: Json;
          manuscript_structure: Json;
          notebook_context: Json;
          manuscript_content: Json;
          review_comments: Json;
          created_at: string;
          modified_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          protocol_id?: string | null;
          title: string;
          project_meta: Json;
          manuscript_structure?: Json;
          notebook_context?: Json;
          manuscript_content?: Json;
          review_comments?: Json;
          created_at?: string;
          modified_at?: string;
          created_by: string;
        };
        Update: {
          title?: string;
          project_meta?: Json;
          manuscript_structure?: Json;
          notebook_context?: Json;
          manuscript_content?: Json;
          review_comments?: Json;
          modified_at?: string;
        };
      };

      // ============================================
      // PICO FRAMEWORKS (Research Hypotheses)
      // ============================================
      pico_frameworks: {
        Row: {
          id: string;
          project_id: string;
          population: string;
          intervention: string;
          comparison: string;
          outcome: string;
          research_question: string;
          validated_at: string | null;
          validated_by: string | null;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          population: string;
          intervention: string;
          comparison: string;
          outcome: string;
          research_question: string;
          validated_at?: string | null;
          validated_by?: string | null;
          created_at?: string;
          created_by: string;
        };
        Update: {
          population?: string;
          intervention?: string;
          comparison?: string;
          outcome?: string;
          research_question?: string;
          validated_at?: string | null;
          validated_by?: string | null;
        };
      };

      // PICO Variables (grounding to protocol schema)
      pico_variables: {
        Row: {
          id: string;
          pico_id: string;
          name: string;
          variable_type: string;
          grounded: boolean;
          bound_to_schema_block: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          pico_id: string;
          name: string;
          variable_type: string;
          grounded?: boolean;
          bound_to_schema_block?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          variable_type?: string;
          grounded?: boolean;
          bound_to_schema_block?: string | null;
        };
      };

      // ============================================
      // AUDIT TRAIL
      // ============================================
      audit_logs: {
        Row: {
          id: string;
          project_id: string | null;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          old_value: Json | null;
          new_value: Json | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          old_value?: Json | null;
          new_value?: Json | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: never; // Audit logs should never be updated
      };
    };

    Views: {
      // Add views here if needed
    };

    Functions: {
      // Add database functions here if needed
    };

    Enums: {
      project_status: 'active' | 'paused' | 'completed' | 'archived';
      user_role: 'pi' | 'junior' | 'statistician' | 'data_entry' | 'institutional_admin';
      protocol_status: 'draft' | 'active' | 'locked' | 'superseded';
      ai_autonomy_level: 'audit-only' | 'suggest' | 'co-pilot' | 'supervisor';
    };
  };
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Insertable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type Updatable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Specific table types for convenience
export type Profile = Tables<'profiles'>;
export type Project = Tables<'projects'>;
export type ProjectCollaborator = Tables<'project_collaborators'>;
export type Protocol = Tables<'protocols'>;
export type ProtocolVersion = Tables<'protocol_versions'>;
export type ClinicalData = Tables<'clinical_data'>;
export type SchemaTemplate = Tables<'schema_templates'>;
export type Persona = Tables<'personas'>;
export type StatisticalManifest = Tables<'statistical_manifests'>;
export type Manuscript = Tables<'manuscripts'>;
export type PicoFramework = Tables<'pico_frameworks'>;
export type PicoVariable = Tables<'pico_variables'>;
export type AuditLog = Tables<'audit_logs'>;
