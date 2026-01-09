/**
 * Supabase Service Layer
 *
 * This module provides typed service functions for interacting with Supabase.
 * It wraps Supabase queries with proper error handling and type safety.
 */

import { getSupabaseIfConfigured, getSupabaseUntyped } from './supabase';
import type {
  Tables,
} from './database.types';

// Note: We use getSupabaseUntyped() for write operations because Supabase's
// strongly typed client expects exact generic signatures that don't match
// our custom Database types. The operations work correctly at runtime.

// Helper to get untyped client for write ops
const getWriteClient = () => getSupabaseUntyped();

// Re-export types for convenience
export type {
  Profile,
  Project,
  Protocol,
  ProtocolVersion,
  ClinicalData,
  SchemaTemplate,
  Persona,
  StatisticalManifest,
  Manuscript,
  PicoFramework,
  PicoVariable,
  AuditLog,
} from './database.types';

type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

// ============================================
// PROFILES
// ============================================
export const profilesService = {
  async getCurrentProfile(): Promise<SupabaseResponse<Tables<'profiles'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return { data, error };
  },

  async updateProfile(updates: Partial<Tables<'profiles'>>): Promise<SupabaseResponse<Tables<'profiles'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates as any)
      .eq('id', user.id)
      .select()
      .single();

    return { data, error };
  },
};

// ============================================
// PROJECTS
// ============================================
export const projectsService = {
  async getAll(): Promise<SupabaseResponse<Tables<'projects'>[]>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('modified_at', { ascending: false });

    return { data, error };
  },

  async getById(id: string): Promise<SupabaseResponse<Tables<'projects'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  async create(project: Partial<Tables<'projects'>> & { name: string; study_number: string; owner_id: string }): Promise<SupabaseResponse<Tables<'projects'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('projects')
      .insert(project as any)
      .select()
      .single();

    return { data, error };
  },

  async update(id: string, updates: Partial<Tables<'projects'>>): Promise<SupabaseResponse<Tables<'projects'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('projects')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async delete(id: string): Promise<SupabaseResponse<null>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    return { data: null, error };
  },
};

// ============================================
// PROTOCOLS
// ============================================
export const protocolsService = {
  async getByProject(projectId: string): Promise<SupabaseResponse<Tables<'protocols'>[]>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('protocols')
      .select('*')
      .eq('project_id', projectId)
      .order('modified_at', { ascending: false });

    return { data, error };
  },

  async getById(id: string): Promise<SupabaseResponse<Tables<'protocols'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('protocols')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  async create(protocol: Partial<Tables<'protocols'>> & { project_id: string; study_number: string; name: string; created_by: string }): Promise<SupabaseResponse<Tables<'protocols'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('protocols')
      .insert(protocol as any)
      .select()
      .single();

    return { data, error };
  },

  async update(id: string, updates: Partial<Tables<'protocols'>>): Promise<SupabaseResponse<Tables<'protocols'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('protocols')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async delete(id: string): Promise<SupabaseResponse<null>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { error } = await supabase
      .from('protocols')
      .delete()
      .eq('id', id);

    return { data: null, error };
  },
};

// ============================================
// PROTOCOL VERSIONS
// ============================================
export const protocolVersionsService = {
  async getByProtocol(protocolId: string): Promise<SupabaseResponse<Tables<'protocol_versions'>[]>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('protocol_versions')
      .select('*')
      .eq('protocol_id', protocolId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async getById(id: string): Promise<SupabaseResponse<Tables<'protocol_versions'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('protocol_versions')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  async create(version: Partial<Tables<'protocol_versions'>> & { protocol_id: string; version_number: string; created_by: string }): Promise<SupabaseResponse<Tables<'protocol_versions'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('protocol_versions')
      .insert(version as any)
      .select()
      .single();

    return { data, error };
  },

  async update(id: string, updates: Partial<Tables<'protocol_versions'>>): Promise<SupabaseResponse<Tables<'protocol_versions'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('protocol_versions')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async lock(id: string, userId: string): Promise<SupabaseResponse<Tables<'protocol_versions'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('protocol_versions')
      .update({
        status: 'locked',
        locked_at: new Date().toISOString(),
        locked_by: userId,
      } as any)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },
};

// ============================================
// CLINICAL DATA
// ============================================
export const clinicalDataService = {
  async getByProject(projectId: string): Promise<SupabaseResponse<Tables<'clinical_data'>[]>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('clinical_data')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async getByProtocol(
    projectId: string,
    protocolId: string,
    protocolVersion?: string
  ): Promise<SupabaseResponse<Tables<'clinical_data'>[]>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    let query = supabase
      .from('clinical_data')
      .select('*')
      .eq('project_id', projectId)
      .eq('protocol_id', protocolId);

    if (protocolVersion) {
      query = query.eq('protocol_version', protocolVersion);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    return { data, error };
  },

  async create(record: Partial<Tables<'clinical_data'>> & { project_id: string; protocol_id: string; protocol_version: string; table_name: string; record_id: string; created_by: string }): Promise<SupabaseResponse<Tables<'clinical_data'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('clinical_data')
      .insert(record as any)
      .select()
      .single();

    return { data, error };
  },

  async update(id: string, updates: Partial<Tables<'clinical_data'>>): Promise<SupabaseResponse<Tables<'clinical_data'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('clinical_data')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async delete(id: string): Promise<SupabaseResponse<null>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { error } = await supabase
      .from('clinical_data')
      .delete()
      .eq('id', id);

    return { data: null, error };
  },
};

// ============================================
// SCHEMA TEMPLATES
// ============================================
export const schemaTemplatesService = {
  async getByProject(projectId: string): Promise<SupabaseResponse<Tables<'schema_templates'>[]>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('schema_templates')
      .select('*')
      .or(`project_id.eq.${projectId},is_public.eq.true`)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async create(template: Partial<Tables<'schema_templates'>> & { name: string; created_by: string }): Promise<SupabaseResponse<Tables<'schema_templates'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('schema_templates')
      .insert(template as any)
      .select()
      .single();

    return { data, error };
  },

  async update(id: string, updates: Partial<Tables<'schema_templates'>>): Promise<SupabaseResponse<Tables<'schema_templates'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('schema_templates')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async delete(id: string): Promise<SupabaseResponse<null>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { error } = await supabase
      .from('schema_templates')
      .delete()
      .eq('id', id);

    return { data: null, error };
  },
};

// ============================================
// PERSONAS
// ============================================
export const personasService = {
  async getByUser(): Promise<SupabaseResponse<Tables<'personas'>[]>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async getByProject(projectId: string): Promise<SupabaseResponse<Tables<'personas'>[]>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async create(persona: Partial<Tables<'personas'>> & { user_id: string; name: string }): Promise<SupabaseResponse<Tables<'personas'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('personas')
      .insert(persona as any)
      .select()
      .single();

    return { data, error };
  },

  async update(id: string, updates: Partial<Tables<'personas'>>): Promise<SupabaseResponse<Tables<'personas'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('personas')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async delete(id: string): Promise<SupabaseResponse<null>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { error } = await supabase
      .from('personas')
      .delete()
      .eq('id', id);

    return { data: null, error };
  },
};

// ============================================
// STATISTICAL MANIFESTS
// ============================================
export const statisticalManifestsService = {
  async getByProject(projectId: string): Promise<SupabaseResponse<Tables<'statistical_manifests'>[]>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('statistical_manifests')
      .select('*')
      .eq('project_id', projectId)
      .order('generated_at', { ascending: false });

    return { data, error };
  },

  async getLatest(projectId: string): Promise<SupabaseResponse<Tables<'statistical_manifests'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('statistical_manifests')
      .select('*')
      .eq('project_id', projectId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    return { data, error };
  },

  async create(manifest: Partial<Tables<'statistical_manifests'>> & { project_id: string; protocol_id: string; protocol_version: string; generated_by: string }): Promise<SupabaseResponse<Tables<'statistical_manifests'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('statistical_manifests')
      .insert(manifest as any)
      .select()
      .single();

    return { data, error };
  },

  async lock(
    id: string,
    userId: string,
    reason?: string
  ): Promise<SupabaseResponse<Tables<'statistical_manifests'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('statistical_manifests')
      .update({
        locked: true,
        locked_at: new Date().toISOString(),
        locked_by: userId,
        lock_reason: reason,
      } as any)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },
};

// ============================================
// MANUSCRIPTS
// ============================================
export const manuscriptsService = {
  async getByProject(projectId: string): Promise<SupabaseResponse<Tables<'manuscripts'>[]>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('manuscripts')
      .select('*')
      .eq('project_id', projectId)
      .order('modified_at', { ascending: false });

    return { data, error };
  },

  async getById(id: string): Promise<SupabaseResponse<Tables<'manuscripts'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('manuscripts')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  async create(manuscript: Partial<Tables<'manuscripts'>> & { project_id: string; title: string; created_by: string }): Promise<SupabaseResponse<Tables<'manuscripts'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('manuscripts')
      .insert(manuscript as any)
      .select()
      .single();

    return { data, error };
  },

  async update(id: string, updates: Partial<Tables<'manuscripts'>>): Promise<SupabaseResponse<Tables<'manuscripts'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('manuscripts')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async delete(id: string): Promise<SupabaseResponse<null>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { error } = await supabase
      .from('manuscripts')
      .delete()
      .eq('id', id);

    return { data: null, error };
  },
};

// ============================================
// PICO FRAMEWORKS
// ============================================
export const picoFrameworksService = {
  async getByProject(projectId: string): Promise<SupabaseResponse<Tables<'pico_frameworks'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('pico_frameworks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return { data, error };
  },

  async create(pico: Partial<Tables<'pico_frameworks'>> & { project_id: string; population: string; intervention: string; comparison: string; outcome: string; research_question: string; created_by: string }): Promise<SupabaseResponse<Tables<'pico_frameworks'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('pico_frameworks')
      .insert(pico as any)
      .select()
      .single();

    return { data, error };
  },

  async update(id: string, updates: Partial<Tables<'pico_frameworks'>>): Promise<SupabaseResponse<Tables<'pico_frameworks'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('pico_frameworks')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async validate(
    id: string,
    userId: string
  ): Promise<SupabaseResponse<Tables<'pico_frameworks'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('pico_frameworks')
      .update({
        validated_at: new Date().toISOString(),
        validated_by: userId,
      } as any)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },
};

// ============================================
// PICO VARIABLES
// ============================================
export const picoVariablesService = {
  async getByPico(picoId: string): Promise<SupabaseResponse<Tables<'pico_variables'>[]>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('pico_variables')
      .select('*')
      .eq('pico_id', picoId);

    return { data, error };
  },

  async create(variable: Partial<Tables<'pico_variables'>> & { pico_id: string; name: string; variable_type: string }): Promise<SupabaseResponse<Tables<'pico_variables'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('pico_variables')
      .insert(variable as any)
      .select()
      .single();

    return { data, error };
  },

  async updateGrounding(
    id: string,
    grounded: boolean,
    boundToSchemaBlock?: string
  ): Promise<SupabaseResponse<Tables<'pico_variables'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('pico_variables')
      .update({
        grounded,
        bound_to_schema_block: boundToSchemaBlock,
      } as any)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },
};

// ============================================
// AUDIT LOGS
// ============================================
export const auditLogsService = {
  async log(
    action: string,
    entityType: string,
    entityId: string,
    options?: {
      projectId?: string;
      oldValue?: object;
      newValue?: object;
      metadata?: object;
    }
  ): Promise<SupabaseResponse<Tables<'audit_logs'>>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action,
        entity_type: entityType,
        entity_id: entityId,
        project_id: options?.projectId,
        old_value: options?.oldValue as any,
        new_value: options?.newValue as any,
        metadata: options?.metadata as any,
      } as any)
      .select()
      .single();

    return { data, error };
  },

  async getByProject(projectId: string, limit = 100): Promise<SupabaseResponse<Tables<'audit_logs'>[]>> {
    const supabase = getSupabaseIfConfigured();
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data, error };
  },
};
