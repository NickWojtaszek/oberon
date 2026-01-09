-- Clinical Intelligence Engine - Initial Database Schema
-- Migration: 20260109000001_initial_schema.sql
--
-- This migration creates the core tables for the Clinical Intelligence Engine.
-- Run this in your Supabase SQL Editor or via Supabase CLI.

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE project_status AS ENUM ('active', 'paused', 'completed', 'archived');
CREATE TYPE user_role AS ENUM ('pi', 'junior', 'statistician', 'data_entry', 'institutional_admin');
CREATE TYPE protocol_status AS ENUM ('draft', 'active', 'locked', 'superseded');
CREATE TYPE ai_autonomy_level AS ENUM ('audit-only', 'suggest', 'co-pilot', 'supervisor');
CREATE TYPE template_type AS ENUM ('section', 'field', 'block');

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'junior',
  institution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- PROJECTS
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  study_number TEXT NOT NULL,
  description TEXT DEFAULT '',
  phase TEXT,
  status project_status DEFAULT 'active',
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  study_design JSONB,
  study_methodology JSONB,
  governance JSONB,
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  modified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_study_number ON projects(study_number);

-- ============================================
-- PROJECT COLLABORATORS
-- ============================================
CREATE TABLE project_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role DEFAULT 'junior',
  permissions JSONB DEFAULT '{"read": true, "write": false, "admin": false}'::jsonb,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(project_id, user_id)
);

CREATE INDEX idx_collaborators_project ON project_collaborators(project_id);
CREATE INDEX idx_collaborators_user ON project_collaborators(user_id);

-- ============================================
-- PROTOCOLS
-- ============================================
CREATE TABLE protocols (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  study_number TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  modified_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id)
);

CREATE INDEX idx_protocols_project ON protocols(project_id);
CREATE INDEX idx_protocols_study_number ON protocols(study_number);

-- ============================================
-- PROTOCOL VERSIONS
-- ============================================
CREATE TABLE protocol_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  protocol_id UUID NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  status protocol_status DEFAULT 'draft',
  schema_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  changelog TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id),
  locked_at TIMESTAMPTZ,
  locked_by UUID REFERENCES profiles(id),
  UNIQUE(protocol_id, version_number)
);

CREATE INDEX idx_protocol_versions_protocol ON protocol_versions(protocol_id);
CREATE INDEX idx_protocol_versions_status ON protocol_versions(status);

-- ============================================
-- CLINICAL DATA
-- ============================================
CREATE TABLE clinical_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  protocol_id UUID NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
  protocol_version TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  modified_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id),
  modified_by UUID REFERENCES profiles(id),
  UNIQUE(project_id, protocol_id, protocol_version, table_name, record_id)
);

CREATE INDEX idx_clinical_data_project ON clinical_data(project_id);
CREATE INDEX idx_clinical_data_protocol ON clinical_data(protocol_id);
CREATE INDEX idx_clinical_data_table ON clinical_data(table_name);

-- ============================================
-- SCHEMA TEMPLATES
-- ============================================
CREATE TABLE schema_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE, -- null = global template
  name TEXT NOT NULL,
  description TEXT,
  template_type template_type DEFAULT 'block',
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id)
);

CREATE INDEX idx_schema_templates_project ON schema_templates(project_id);
CREATE INDEX idx_schema_templates_public ON schema_templates(is_public) WHERE is_public = TRUE;

-- ============================================
-- PERSONAS
-- ============================================
CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE, -- null = user's global persona
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role user_role DEFAULT 'junior',
  email TEXT,
  permissions JSONB DEFAULT '{}'::jsonb,
  ai_autonomy_cap ai_autonomy_level DEFAULT 'suggest',
  blinded BOOLEAN DEFAULT FALSE,
  certified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_personas_project ON personas(project_id);
CREATE INDEX idx_personas_user ON personas(user_id);

-- ============================================
-- STATISTICAL MANIFESTS
-- ============================================
CREATE TABLE statistical_manifests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  protocol_id UUID NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
  protocol_version TEXT NOT NULL,
  manifest_data JSONB NOT NULL,
  total_records_analyzed INTEGER DEFAULT 0,
  generated_by UUID NOT NULL REFERENCES profiles(id),
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  locked BOOLEAN DEFAULT FALSE,
  locked_at TIMESTAMPTZ,
  locked_by UUID REFERENCES profiles(id),
  lock_reason TEXT
);

CREATE INDEX idx_statistical_manifests_project ON statistical_manifests(project_id);
CREATE INDEX idx_statistical_manifests_protocol ON statistical_manifests(protocol_id);
CREATE INDEX idx_statistical_manifests_locked ON statistical_manifests(locked) WHERE locked = TRUE;

-- ============================================
-- MANUSCRIPTS
-- ============================================
CREATE TABLE manuscripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  protocol_id UUID REFERENCES protocols(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  project_meta JSONB NOT NULL,
  manuscript_structure JSONB DEFAULT '{}'::jsonb,
  notebook_context JSONB DEFAULT '{}'::jsonb,
  manuscript_content JSONB DEFAULT '{}'::jsonb,
  review_comments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  modified_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id)
);

CREATE INDEX idx_manuscripts_project ON manuscripts(project_id);

-- ============================================
-- PICO FRAMEWORKS (Research Hypotheses)
-- ============================================
CREATE TABLE pico_frameworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  population TEXT NOT NULL,
  intervention TEXT NOT NULL,
  comparison TEXT NOT NULL,
  outcome TEXT NOT NULL,
  research_question TEXT NOT NULL,
  validated_at TIMESTAMPTZ,
  validated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id)
);

CREATE INDEX idx_pico_frameworks_project ON pico_frameworks(project_id);

-- ============================================
-- PICO VARIABLES
-- ============================================
CREATE TABLE pico_variables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pico_id UUID NOT NULL REFERENCES pico_frameworks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  variable_type TEXT NOT NULL,
  grounded BOOLEAN DEFAULT FALSE,
  bound_to_schema_block UUID, -- Reference to protocol_versions schema block ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pico_variables_pico ON pico_variables(pico_id);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_project ON audit_logs(project_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================
CREATE OR REPLACE FUNCTION update_modified_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_modified_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_modified_at();

CREATE TRIGGER update_protocols_modified_at
  BEFORE UPDATE ON protocols
  FOR EACH ROW EXECUTE FUNCTION update_modified_at();

CREATE TRIGGER update_clinical_data_modified_at
  BEFORE UPDATE ON clinical_data
  FOR EACH ROW EXECUTE FUNCTION update_modified_at();

CREATE TRIGGER update_manuscripts_modified_at
  BEFORE UPDATE ON manuscripts
  FOR EACH ROW EXECUTE FUNCTION update_modified_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_modified_at();
