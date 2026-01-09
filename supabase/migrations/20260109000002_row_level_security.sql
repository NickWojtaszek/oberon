-- Clinical Intelligence Engine - Row Level Security Policies
-- Migration: 20260109000002_row_level_security.sql
--
-- This migration enables RLS and creates security policies for all tables.
-- Ensures users can only access their own data and projects they collaborate on.

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE schema_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistical_manifests ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuscripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pico_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pico_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Check if user owns a project or is a collaborator
CREATE OR REPLACE FUNCTION user_has_project_access(project_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM projects WHERE id = project_uuid AND owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM project_collaborators
    WHERE project_id = project_uuid
    AND user_id = auth.uid()
    AND accepted_at IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has write access to a project
CREATE OR REPLACE FUNCTION user_has_project_write_access(project_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM projects WHERE id = project_uuid AND owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM project_collaborators
    WHERE project_id = project_uuid
    AND user_id = auth.uid()
    AND accepted_at IS NOT NULL
    AND (permissions->>'write')::boolean = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is project owner (admin)
CREATE OR REPLACE FUNCTION user_is_project_owner(project_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM projects WHERE id = project_uuid AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PROFILES POLICIES
-- ============================================
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view profiles of collaborators"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_collaborators pc1
      JOIN project_collaborators pc2 ON pc1.project_id = pc2.project_id
      WHERE pc1.user_id = auth.uid() AND pc2.user_id = profiles.id
    )
    OR
    EXISTS (
      SELECT 1 FROM projects p
      JOIN project_collaborators pc ON p.id = pc.project_id
      WHERE p.owner_id = auth.uid() AND pc.user_id = profiles.id
    )
  );

-- ============================================
-- PROJECTS POLICIES
-- ============================================
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (owner_id = auth.uid() OR user_has_project_access(id));

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their projects"
  ON projects FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their projects"
  ON projects FOR DELETE
  USING (owner_id = auth.uid());

-- ============================================
-- PROJECT COLLABORATORS POLICIES
-- ============================================
CREATE POLICY "Users can view collaborators of accessible projects"
  ON project_collaborators FOR SELECT
  USING (user_has_project_access(project_id));

CREATE POLICY "Owners can manage collaborators"
  ON project_collaborators FOR INSERT
  WITH CHECK (user_is_project_owner(project_id));

CREATE POLICY "Owners can update collaborators"
  ON project_collaborators FOR UPDATE
  USING (user_is_project_owner(project_id));

CREATE POLICY "Owners can remove collaborators"
  ON project_collaborators FOR DELETE
  USING (user_is_project_owner(project_id) OR user_id = auth.uid());

-- ============================================
-- PROTOCOLS POLICIES
-- ============================================
CREATE POLICY "Users can view protocols in accessible projects"
  ON protocols FOR SELECT
  USING (user_has_project_access(project_id));

CREATE POLICY "Users with write access can create protocols"
  ON protocols FOR INSERT
  WITH CHECK (user_has_project_write_access(project_id));

CREATE POLICY "Users with write access can update protocols"
  ON protocols FOR UPDATE
  USING (user_has_project_write_access(project_id));

CREATE POLICY "Owners can delete protocols"
  ON protocols FOR DELETE
  USING (user_is_project_owner(project_id));

-- ============================================
-- PROTOCOL VERSIONS POLICIES
-- ============================================
CREATE POLICY "Users can view protocol versions"
  ON protocol_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM protocols p
      WHERE p.id = protocol_versions.protocol_id
      AND user_has_project_access(p.project_id)
    )
  );

CREATE POLICY "Users with write access can create versions"
  ON protocol_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM protocols p
      WHERE p.id = protocol_versions.protocol_id
      AND user_has_project_write_access(p.project_id)
    )
  );

CREATE POLICY "Users with write access can update draft versions"
  ON protocol_versions FOR UPDATE
  USING (
    status = 'draft' AND
    EXISTS (
      SELECT 1 FROM protocols p
      WHERE p.id = protocol_versions.protocol_id
      AND user_has_project_write_access(p.project_id)
    )
  );

-- ============================================
-- CLINICAL DATA POLICIES
-- ============================================
CREATE POLICY "Users can view clinical data in accessible projects"
  ON clinical_data FOR SELECT
  USING (user_has_project_access(project_id));

CREATE POLICY "Users with write access can insert clinical data"
  ON clinical_data FOR INSERT
  WITH CHECK (user_has_project_write_access(project_id));

CREATE POLICY "Users with write access can update clinical data"
  ON clinical_data FOR UPDATE
  USING (user_has_project_write_access(project_id));

CREATE POLICY "Owners can delete clinical data"
  ON clinical_data FOR DELETE
  USING (user_is_project_owner(project_id));

-- ============================================
-- SCHEMA TEMPLATES POLICIES
-- ============================================
CREATE POLICY "Users can view public templates or their own"
  ON schema_templates FOR SELECT
  USING (
    is_public = TRUE
    OR created_by = auth.uid()
    OR (project_id IS NOT NULL AND user_has_project_access(project_id))
  );

CREATE POLICY "Users can create templates"
  ON schema_templates FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    (project_id IS NULL OR user_has_project_write_access(project_id))
  );

CREATE POLICY "Users can update their own templates"
  ON schema_templates FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates"
  ON schema_templates FOR DELETE
  USING (created_by = auth.uid());

-- ============================================
-- PERSONAS POLICIES
-- ============================================
CREATE POLICY "Users can view their personas"
  ON personas FOR SELECT
  USING (
    user_id = auth.uid()
    OR (project_id IS NOT NULL AND user_has_project_access(project_id))
  );

CREATE POLICY "Users can create their own personas"
  ON personas FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their personas"
  ON personas FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their personas"
  ON personas FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- STATISTICAL MANIFESTS POLICIES
-- ============================================
CREATE POLICY "Users can view manifests in accessible projects"
  ON statistical_manifests FOR SELECT
  USING (user_has_project_access(project_id));

CREATE POLICY "Users with write access can create manifests"
  ON statistical_manifests FOR INSERT
  WITH CHECK (user_has_project_write_access(project_id));

CREATE POLICY "Users can update unlocked manifests"
  ON statistical_manifests FOR UPDATE
  USING (
    locked = FALSE AND user_has_project_write_access(project_id)
  );

-- Only PI (owner) can lock/unlock manifests
CREATE POLICY "Only owners can lock manifests"
  ON statistical_manifests FOR UPDATE
  USING (user_is_project_owner(project_id));

-- ============================================
-- MANUSCRIPTS POLICIES
-- ============================================
CREATE POLICY "Users can view manuscripts in accessible projects"
  ON manuscripts FOR SELECT
  USING (user_has_project_access(project_id));

CREATE POLICY "Users with write access can create manuscripts"
  ON manuscripts FOR INSERT
  WITH CHECK (user_has_project_write_access(project_id));

CREATE POLICY "Users with write access can update manuscripts"
  ON manuscripts FOR UPDATE
  USING (user_has_project_write_access(project_id));

CREATE POLICY "Owners can delete manuscripts"
  ON manuscripts FOR DELETE
  USING (user_is_project_owner(project_id));

-- ============================================
-- PICO FRAMEWORKS POLICIES
-- ============================================
CREATE POLICY "Users can view PICO in accessible projects"
  ON pico_frameworks FOR SELECT
  USING (user_has_project_access(project_id));

CREATE POLICY "Users with write access can create PICO"
  ON pico_frameworks FOR INSERT
  WITH CHECK (user_has_project_write_access(project_id));

CREATE POLICY "Users with write access can update PICO"
  ON pico_frameworks FOR UPDATE
  USING (user_has_project_write_access(project_id));

CREATE POLICY "Owners can delete PICO"
  ON pico_frameworks FOR DELETE
  USING (user_is_project_owner(project_id));

-- ============================================
-- PICO VARIABLES POLICIES
-- ============================================
CREATE POLICY "Users can view PICO variables"
  ON pico_variables FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pico_frameworks pf
      WHERE pf.id = pico_variables.pico_id
      AND user_has_project_access(pf.project_id)
    )
  );

CREATE POLICY "Users can manage PICO variables"
  ON pico_variables FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pico_frameworks pf
      WHERE pf.id = pico_variables.pico_id
      AND user_has_project_write_access(pf.project_id)
    )
  );

-- ============================================
-- AUDIT LOGS POLICIES
-- ============================================
-- Audit logs are read-only after creation
CREATE POLICY "Users can view audit logs for accessible projects"
  ON audit_logs FOR SELECT
  USING (
    user_id = auth.uid()
    OR (project_id IS NOT NULL AND user_has_project_access(project_id))
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- GRANT PERMISSIONS TO AUTHENTICATED USERS
-- ============================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
