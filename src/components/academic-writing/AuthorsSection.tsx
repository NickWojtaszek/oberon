/**
 * Authors Section
 * Manage manuscript authors in generic journal format
 */

import { useState } from 'react';
import { Plus, X, GripVertical, Mail, Building2, MapPin } from 'lucide-react';

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  affiliation: string;
  department?: string;
  city?: string;
  country?: string;
  orcid?: string;
  isCorresponding: boolean;
  contributionRoles: string[];
}

interface AuthorsSectionProps {
  authors: Author[];
  onAuthorsChange: (authors: Author[]) => void;
}

const CONTRIBUTION_ROLES = [
  'Conceptualization',
  'Data curation',
  'Formal analysis',
  'Funding acquisition',
  'Investigation',
  'Methodology',
  'Project administration',
  'Resources',
  'Software',
  'Supervision',
  'Validation',
  'Visualization',
  'Writing - original draft',
  'Writing - review & editing'
];

export function AuthorsSection({ authors, onAuthorsChange }: AuthorsSectionProps) {
  const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null);

  const addAuthor = () => {
    const newAuthor: Author = {
      id: `author-${Date.now()}`,
      firstName: '',
      lastName: '',
      email: '',
      affiliation: '',
      isCorresponding: authors.length === 0, // First author is corresponding by default
      contributionRoles: []
    };
    onAuthorsChange([...authors, newAuthor]);
    setEditingAuthorId(newAuthor.id);
  };

  const removeAuthor = (id: string) => {
    onAuthorsChange(authors.filter(a => a.id !== id));
  };

  const updateAuthor = (id: string, updates: Partial<Author>) => {
    onAuthorsChange(authors.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const toggleContributionRole = (authorId: string, role: string) => {
    const author = authors.find(a => a.id === authorId);
    if (!author) return;

    const hasRole = author.contributionRoles.includes(role);
    const updatedRoles = hasRole
      ? author.contributionRoles.filter(r => r !== role)
      : [...author.contributionRoles, role];

    updateAuthor(authorId, { contributionRoles: updatedRoles });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900">Authors & Contributors</h2>
            <p className="text-sm text-slate-600 mt-1">
              Manage authorship and contribution roles
            </p>
          </div>
          <button
            onClick={addAuthor}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Author
          </button>
        </div>
      </div>

      {/* Authors List */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {authors.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-slate-900 mb-2">No Authors Added</h3>
            <p className="text-sm text-slate-600 mb-6">
              Add authors and define their contributions to the manuscript
            </p>
            <button
              onClick={addAuthor}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Author
            </button>
          </div>
        ) : (
          <div className="max-w-[1600px] mx-auto space-y-6">
            {authors.map((author, index) => (
              <div
                key={author.id}
                className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors"
              >
                {/* Author Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <GripVertical className="w-5 h-5" />
                    <span className="text-sm font-medium">#{index + 1}</span>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={author.firstName}
                        onChange={(e) => updateAuthor(author.id, { firstName: e.target.value })}
                        placeholder="John"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={author.lastName}
                        onChange={(e) => updateAuthor(author.id, { lastName: e.target.value })}
                        placeholder="Doe"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => removeAuthor(author.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Contact & Affiliation */}
                <div className="pl-16 space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={author.email}
                      onChange={(e) => updateAuthor(author.id, { email: e.target.value })}
                      placeholder="john.doe@institution.edu"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Affiliation */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-2">
                      <Building2 className="w-3 h-3" />
                      Affiliation
                    </label>
                    <input
                      type="text"
                      value={author.affiliation}
                      onChange={(e) => updateAuthor(author.id, { affiliation: e.target.value })}
                      placeholder="University Medical Center"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Department, City, Country */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={author.department || ''}
                        onChange={(e) => updateAuthor(author.id, { department: e.target.value })}
                        placeholder="Cardiology"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={author.city || ''}
                        onChange={(e) => updateAuthor(author.id, { city: e.target.value })}
                        placeholder="Boston"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={author.country || ''}
                        onChange={(e) => updateAuthor(author.id, { country: e.target.value })}
                        placeholder="USA"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* ORCID */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      ORCID iD (optional)
                    </label>
                    <input
                      type="text"
                      value={author.orcid || ''}
                      onChange={(e) => updateAuthor(author.id, { orcid: e.target.value })}
                      placeholder="0000-0000-0000-0000"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Corresponding Author */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`corresponding-${author.id}`}
                      checked={author.isCorresponding}
                      onChange={(e) => {
                        // Unset all other corresponding authors
                        const updated = authors.map(a => ({
                          ...a,
                          isCorresponding: a.id === author.id ? e.target.checked : false
                        }));
                        onAuthorsChange(updated);
                      }}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor={`corresponding-${author.id}`} className="text-sm text-slate-700">
                      Corresponding Author
                    </label>
                  </div>

                  {/* Contribution Roles */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">
                      Contribution Roles (CRediT Taxonomy)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CONTRIBUTION_ROLES.map(role => {
                        const isSelected = author.contributionRoles.includes(role);
                        return (
                          <button
                            key={role}
                            onClick={() => toggleContributionRole(author.id, role)}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                              isSelected
                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            {role}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {authors.length > 0 && (
        <div className="px-8 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-600">
            {authors.length} author{authors.length !== 1 ? 's' : ''} • 
            {' '}{authors.filter(a => a.isCorresponding).length > 0 ? '1 corresponding author' : 'No corresponding author set'}
          </div>
        </div>
      )}
    </div>
  );
}
