// Manuscript Service - Data access layer for manuscripts
// Abstracts storage implementation (localStorage → Backend API)

import { apiClient } from '../lib/apiClient';
import { storage } from '../utils/storageService';
import { config } from '../config/environment';
import type { ManuscriptManifest } from '../types/manuscript';
import type {
  CreateManuscriptRequest,
  UpdateManuscriptRequest,
  UpdateManuscriptContentRequest,
  AddSourceRequest,
  AddReviewCommentRequest,
  ManuscriptListResponse,
  ManuscriptResponse,
} from '../types/api/manuscript.api';

class ManuscriptService {
  private useBackend(): boolean {
    return config.api.useBackend && apiClient.isBackendEnabled();
  }

  /**
   * Helper: Get manuscript from localStorage across all projects
   * @private
   */
  private getFromLocalStorage(manuscriptId: string): ManuscriptManifest | null {
    const allProjects = storage.projects.getAll();
    for (const project of allProjects) {
      // ✅ FIX: Guard against null/undefined projects
      if (!project || !project.id) {
        continue;
      }
      
      const manuscript = storage.manuscripts.get(manuscriptId, project.id);
      if (manuscript) return manuscript;
    }
    return null;
  }

  /**
   * Get all manuscripts for a project
   */
  async getAll(projectId: string): Promise<ManuscriptManifest[]> {
    if (this.useBackend()) {
      try {
        const response = await apiClient.get<ManuscriptListResponse>(
          `/projects/${projectId}/manuscripts`
        );
        return response.manuscripts;
      } catch (error) {
        console.error('Failed to fetch manuscripts from backend, falling back to localStorage:', error);
        // Fallback to localStorage if backend fails
        return storage.manuscripts.getAll(projectId);
      }
    }

    // Use localStorage
    return storage.manuscripts.getAll(projectId);
  }

  /**
   * Get a single manuscript by ID
   */
  async getById(manuscriptId: string): Promise<ManuscriptManifest | null> {
    if (this.useBackend()) {
      try {
        const response = await apiClient.get<ManuscriptResponse>(
          `/manuscripts/${manuscriptId}`
        );
        return response.manuscript;
      } catch (error) {
        console.error('Failed to fetch manuscript from backend:', error);
        // Fallback to localStorage - need to search across all projects
        // This is a limitation of the localStorage approach
        return this.getFromLocalStorage(manuscriptId);
      }
    }

    // Use localStorage - need to search across all projects
    return this.getFromLocalStorage(manuscriptId);
  }

  /**
   * Create a new manuscript
   */
  async create(manuscript: ManuscriptManifest): Promise<ManuscriptManifest> {
    if (this.useBackend()) {
      try {
        const request: CreateManuscriptRequest = {
          projectId: manuscript.projectMeta.projectId,
          title: manuscript.projectMeta.studyTitle,
          studyDesign: manuscript.projectMeta.studyDesign,
        };

        const response = await apiClient.post<ManuscriptResponse>(
          '/manuscripts',
          { ...request, fullManuscript: manuscript }
        );

        return response.manuscript;
      } catch (error) {
        console.error('Failed to create manuscript on backend, using localStorage:', error);
        // Fallback to localStorage
        storage.manuscripts.save(manuscript, manuscript.projectMeta.projectId);
        return manuscript;
      }
    }

    // Use localStorage
    storage.manuscripts.save(manuscript, manuscript.projectMeta.projectId);
    return manuscript;
  }

  /**
   * Update an existing manuscript
   */
  async update(
    manuscriptId: string,
    updates: Partial<ManuscriptManifest>
  ): Promise<ManuscriptManifest> {
    if (this.useBackend()) {
      try {
        const request: UpdateManuscriptRequest = {
          title: updates.projectMeta?.studyTitle,
          content: updates.manuscriptContent,
          notebookContext: updates.notebookContext,
          reviewComments: updates.reviewComments,
        };

        const response = await apiClient.patch<ManuscriptResponse>(
          `/manuscripts/${manuscriptId}`,
          request
        );

        return response.manuscript;
      } catch (error) {
        console.error('Failed to update manuscript on backend:', error);
        // Fallback: update localStorage
        const existing = this.getFromLocalStorage(manuscriptId);
        if (existing) {
          const updated = { ...existing, ...updates };
          storage.manuscripts.save(updated, updated.projectMeta.projectId);
          return updated;
        }
        throw error;
      }
    }

    // Use localStorage
    const existing = this.getFromLocalStorage(manuscriptId);
    if (!existing) {
      throw new Error(`Manuscript ${manuscriptId} not found`);
    }

    const updated = { ...existing, ...updates };
    storage.manuscripts.save(updated, updated.projectMeta.projectId);
    return updated;
  }

  /**
   * Update manuscript content (specific section)
   */
  async updateContent(
    manuscriptId: string,
    section: keyof ManuscriptManifest['manuscriptContent'],
    content: string
  ): Promise<ManuscriptManifest> {
    if (this.useBackend()) {
      try {
        const request: UpdateManuscriptContentRequest = { section, content };
        const response = await apiClient.patch<ManuscriptResponse>(
          `/manuscripts/${manuscriptId}/content`,
          request
        );
        return response.manuscript;
      } catch (error) {
        console.error('Failed to update manuscript content on backend:', error);
      }
    }

    // Fallback to localStorage
    const existing = this.getFromLocalStorage(manuscriptId);
    if (!existing) {
      throw new Error(`Manuscript ${manuscriptId} not found`);
    }

    const updated = {
      ...existing,
      manuscriptContent: {
        ...existing.manuscriptContent,
        [section]: content,
      },
      projectMeta: {
        ...existing.projectMeta,
        modifiedAt: Date.now(),
      },
    };

    storage.manuscripts.save(updated, updated.projectMeta.projectId);
    return updated;
  }

  /**
   * Delete a manuscript
   */
  async delete(manuscriptId: string): Promise<void> {
    if (this.useBackend()) {
      try {
        await apiClient.delete(`/manuscripts/${manuscriptId}`);
        // Also remove from localStorage for consistency - need to find projectId first
        const existing = this.getFromLocalStorage(manuscriptId);
        if (existing) {
          storage.manuscripts.delete(manuscriptId, existing.projectMeta.projectId);
        }
        return;
      } catch (error) {
        console.error('Failed to delete manuscript from backend:', error);
      }
    }

    // Use localStorage - need to find projectId first
    const existing = this.getFromLocalStorage(manuscriptId);
    if (existing) {
      storage.manuscripts.delete(manuscriptId, existing.projectMeta.projectId);
    }
  }

  /**
   * Add a source to a manuscript
   */
  async addSource(
    manuscriptId: string,
    source: ManuscriptManifest['notebookContext']['linkedSources'][0]
  ): Promise<ManuscriptManifest> {
    if (this.useBackend()) {
      try {
        const request: AddSourceRequest = {
          title: source.title,
          authors: source.authors,
          year: source.year,
          journal: source.journal,
          doi: source.doi,
          pmid: source.pmid,
          abstract: source.abstract,
          keyFindings: source.keyFindings,
        };

        const response = await apiClient.post<ManuscriptResponse>(
          `/manuscripts/${manuscriptId}/sources`,
          request
        );
        return response.manuscript;
      } catch (error) {
        console.error('Failed to add source on backend:', error);
      }
    }

    // Fallback to localStorage
    const existing = this.getFromLocalStorage(manuscriptId);
    if (!existing) {
      throw new Error(`Manuscript ${manuscriptId} not found`);
    }

    const updated = {
      ...existing,
      notebookContext: {
        ...existing.notebookContext,
        linkedSources: [...existing.notebookContext.linkedSources, source],
      },
    };

    storage.manuscripts.save(updated, updated.projectMeta.projectId);
    return updated;
  }

  /**
   * Remove a source from a manuscript
   */
  async removeSource(manuscriptId: string, sourceId: string): Promise<ManuscriptManifest> {
    if (this.useBackend()) {
      try {
        const response = await apiClient.delete<ManuscriptResponse>(
          `/manuscripts/${manuscriptId}/sources/${sourceId}`
        );
        return response.manuscript;
      } catch (error) {
        console.error('Failed to remove source on backend:', error);
      }
    }

    // Fallback to localStorage
    const existing = this.getFromLocalStorage(manuscriptId);
    if (!existing) {
      throw new Error(`Manuscript ${manuscriptId} not found`);
    }

    const updated = {
      ...existing,
      notebookContext: {
        ...existing.notebookContext,
        linkedSources: existing.notebookContext.linkedSources.filter(s => s.id !== sourceId),
      },
    };

    storage.manuscripts.save(updated, updated.projectMeta.projectId);
    return updated;
  }

  /**
   * Add a review comment
   */
  async addReviewComment(
    manuscriptId: string,
    comment: ManuscriptManifest['reviewComments'][0]
  ): Promise<ManuscriptManifest> {
    if (this.useBackend()) {
      try {
        const request: AddReviewCommentRequest = {
          section: comment.section,
          lineNumber: comment.lineNumber,
          comment: comment.comment,
          severity: comment.severity,
          author: comment.author,
        };

        const response = await apiClient.post<ManuscriptResponse>(
          `/manuscripts/${manuscriptId}/comments`,
          request
        );
        return response.manuscript;
      } catch (error) {
        console.error('Failed to add comment on backend:', error);
      }
    }

    // Fallback to localStorage
    const existing = this.getFromLocalStorage(manuscriptId);
    if (!existing) {
      throw new Error(`Manuscript ${manuscriptId} not found`);
    }

    const updated = {
      ...existing,
      reviewComments: [...existing.reviewComments, comment],
    };

    storage.manuscripts.save(updated, updated.projectMeta.projectId);
    return updated;
  }

  /**
   * Resolve a review comment
   */
  async resolveComment(manuscriptId: string, commentId: string): Promise<ManuscriptManifest> {
    if (this.useBackend()) {
      try {
        const response = await apiClient.patch<ManuscriptResponse>(
          `/manuscripts/${manuscriptId}/comments/${commentId}/resolve`,
          {}
        );
        return response.manuscript;
      } catch (error) {
        console.error('Failed to resolve comment on backend:', error);
      }
    }

    // Fallback to localStorage
    const existing = this.getFromLocalStorage(manuscriptId);
    if (!existing) {
      throw new Error(`Manuscript ${manuscriptId} not found`);
    }

    const updated = {
      ...existing,
      reviewComments: existing.reviewComments.map(c =>
        c.id === commentId ? { ...c, resolved: true } : c
      ),
    };

    storage.manuscripts.save(updated, updated.projectMeta.projectId);
    return updated;
  }

  /**
   * Delete a review comment
   */
  async deleteComment(manuscriptId: string, commentId: string): Promise<ManuscriptManifest> {
    if (this.useBackend()) {
      try {
        const response = await apiClient.delete<ManuscriptResponse>(
          `/manuscripts/${manuscriptId}/comments/${commentId}`
        );
        return response.manuscript;
      } catch (error) {
        console.error('Failed to delete comment on backend:', error);
      }
    }

    // Fallback to localStorage
    const existing = this.getFromLocalStorage(manuscriptId);
    if (!existing) {
      throw new Error(`Manuscript ${manuscriptId} not found`);
    }

    const updated = {
      ...existing,
      reviewComments: existing.reviewComments.filter(c => c.id !== commentId),
    };

    storage.manuscripts.save(updated, updated.projectMeta.projectId);
    return updated;
  }
}

// Export singleton instance
export const manuscriptService = new ManuscriptService();