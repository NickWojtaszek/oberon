/**
 * Governance Dashboard - Simplified Academic Settings
 *
 * Two modes:
 * - Solo Mode: Single researcher, simple settings
 * - Team Mode: Collaboration, role assignment (Owner-controlled)
 */

import { useState } from 'react';
import {
  User,
  Users,
  Crown,
  GraduationCap,
  BarChart3,
  Database,
  Building,
  Shield,
  Zap,
  Check,
  X,
  Eye,
  UserPlus,
  Settings,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { FEATURE_FLAGS } from '../../config/featureFlags';
import { useGovernance } from '../../hooks/useGovernance';
import { useProject } from '../../contexts/ProtocolContext';
import type { UserRole, TeamMember } from '../../types/governance';
import { ROLE_DISPLAY_NAMES, ROLE_DESCRIPTIONS, DEFAULT_PERMISSIONS } from '../../types/governance';

export function GovernanceDashboard() {
  const {
    role,
    roleName,
    roleDescription,
    permissions,
    governanceMode,
    maxAIAutonomy,
    availableAIModes,
    isSoloMode,
    isTeamMode,
    teamMembers,
    isPI,
  } = useGovernance();

  const { currentProject, updateProject } = useProject();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('junior');

  // Check if current user is the owner (can manage team)
  const isOwner = isPI && currentProject?.governance?.ownerId === 'demo-user'; // TODO: Replace with real user ID

  // Handle enabling team mode
  const handleEnableTeamMode = () => {
    if (!currentProject || !isOwner) return;

    updateProject(currentProject.id, {
      governance: {
        ...currentProject.governance,
        mode: 'team',
        teamMembers: currentProject.governance?.teamMembers || [],
      },
    });
  };

  // Handle disabling team mode (back to solo)
  const handleDisableTeamMode = () => {
    if (!currentProject || !isOwner) return;

    updateProject(currentProject.id, {
      governance: {
        ...currentProject.governance,
        mode: 'solo',
      },
    });
  };

  // Handle inviting a team member
  const handleInviteMember = () => {
    if (!currentProject || !isOwner || !inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: inviteEmail.split('@')[0], // Use email prefix as name
      email: inviteEmail,
      role: inviteRole,
      permissions: DEFAULT_PERMISSIONS[inviteRole],
      invitedAt: new Date().toISOString(),
    };

    const currentMembers = currentProject.governance?.teamMembers || [];

    updateProject(currentProject.id, {
      governance: {
        ...currentProject.governance,
        teamMembers: [...currentMembers, newMember],
      },
    });

    setInviteEmail('');
    setShowInviteModal(false);
  };

  // Handle removing a team member
  const handleRemoveMember = (memberId: string) => {
    if (!currentProject || !isOwner) return;

    const currentMembers = currentProject.governance?.teamMembers || [];

    updateProject(currentProject.id, {
      governance: {
        ...currentProject.governance,
        teamMembers: currentMembers.filter(m => m.id !== memberId),
      },
    });
  };

  // Handle changing a member's role
  const handleChangeRole = (memberId: string, newRole: UserRole) => {
    if (!currentProject || !isOwner) return;

    const currentMembers = currentProject.governance?.teamMembers || [];

    updateProject(currentProject.id, {
      governance: {
        ...currentProject.governance,
        teamMembers: currentMembers.map(m =>
          m.id === memberId
            ? { ...m, role: newRole, permissions: DEFAULT_PERMISSIONS[newRole] }
            : m
        ),
      },
    });
  };

  const getRoleIcon = (roleType: UserRole) => {
    switch (roleType) {
      case 'pi': return Crown;
      case 'junior': return GraduationCap;
      case 'statistician': return BarChart3;
      case 'data_entry': return Database;
      case 'institutional_admin': return Building;
    }
  };

  const getRoleColor = (roleType: UserRole) => {
    switch (roleType) {
      case 'pi': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'junior': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'statistician': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'data_entry': return 'text-slate-600 bg-slate-50 border-slate-200';
      case 'institutional_admin': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  const getAccessIcon = (level: string) => {
    switch (level) {
      case 'full': return <Check className="w-4 h-4 text-emerald-600" />;
      case 'read': return <Eye className="w-4 h-4 text-blue-600" />;
      case 'comment': return <Eye className="w-4 h-4 text-purple-600" />;
      case 'hidden': return <X className="w-4 h-4 text-slate-400" />;
      default: return <Shield className="w-4 h-4 text-slate-400" />;
    }
  };

  const CurrentRoleIcon = getRoleIcon(role);

  // Don't render if RBAC disabled
  if (!FEATURE_FLAGS.ENABLE_RBAC) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <Settings className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Settings Disabled</h3>
          <p className="text-sm text-slate-600">
            Role-based settings are currently disabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {isTeamMode ? 'Team Settings' : 'My Settings'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {isTeamMode
              ? 'Manage your research team and permissions'
              : 'Configure your role and preferences'}
          </p>
        </div>

        {/* Current Role Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getRoleColor(role)}`}>
              <CurrentRoleIcon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-medium text-slate-900">{roleName}</h2>
                {isOwner && (
                  <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                    Owner
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 mb-4">{roleDescription}</p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Mode:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    isTeamMode
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isTeamMode ? 'Team' : 'Solo'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">AI Level:</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium capitalize">
                    {maxAIAutonomy}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Mode Toggle (Owner only) */}
        {isOwner && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Team Collaboration</h3>
                  <p className="text-sm text-slate-600">
                    {isTeamMode
                      ? 'Invite members and assign roles'
                      : 'Enable to collaborate with others'}
                  </p>
                </div>
              </div>
              <button
                onClick={isTeamMode ? handleDisableTeamMode : handleEnableTeamMode}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isTeamMode
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isTeamMode ? 'Switch to Solo' : 'Enable Team Mode'}
              </button>
            </div>
          </div>
        )}

        {/* Team Members (Team Mode only) */}
        {isTeamMode && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">Team Members</h3>
                <p className="text-sm text-slate-600">{teamMembers.length} member(s)</p>
              </div>
              {isOwner && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite
                </button>
              )}
            </div>

            {/* Owner row */}
            <div className="px-6 py-4 flex items-center gap-4 bg-amber-50/50">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">
                    {currentProject?.governance?.ownerName || 'You'}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                    Owner
                  </span>
                </div>
                <span className="text-sm text-slate-600">Principal Investigator</span>
              </div>
            </div>

            {/* Team member rows */}
            {teamMembers.map((member) => {
              const MemberIcon = getRoleIcon(member.role);
              return (
                <div key={member.id} className="px-6 py-4 flex items-center gap-4 border-t border-slate-100">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRoleColor(member.role)}`}>
                    <MemberIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{member.name}</div>
                    <div className="text-sm text-slate-600">{member.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOwner ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.id, e.target.value as UserRole)}
                        className="text-sm border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="junior">Junior Researcher</option>
                        <option value="statistician">Statistician</option>
                        <option value="data_entry">Data Entry</option>
                      </select>
                    ) : (
                      <span className="text-sm text-slate-600">{ROLE_DISPLAY_NAMES[member.role]}</span>
                    )}
                    {isOwner && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {teamMembers.length === 0 && (
              <div className="px-6 py-8 text-center text-slate-500 border-t border-slate-100">
                <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No team members yet</p>
                {isOwner && (
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                  >
                    Invite your first member
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Permissions Summary */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-medium text-slate-900">Your Permissions</h3>
            <p className="text-sm text-slate-600">What you can access with your current role</p>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              { key: 'canAccessProtocol', label: 'Protocol Design', icon: Shield },
              { key: 'canAccessDatabase', label: 'Database & Data Entry', icon: Database },
              { key: 'canAccessAnalytics', label: 'Analytics', icon: BarChart3 },
              { key: 'canAccessWriting', label: 'Academic Writing', icon: GraduationCap },
            ].map((item) => {
              const accessLevel = permissions[item.key as keyof typeof permissions] as string;
              const Icon = item.icon;
              return (
                <div key={item.key} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getAccessIcon(accessLevel)}
                    <span className="text-xs text-slate-600 capitalize">{accessLevel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900">AI Assistance Level</h3>
              <p className="text-sm text-slate-600">Available AI modes for your role</p>
            </div>
          </div>

          <div className="flex gap-3">
            {['audit', 'co-pilot', 'pilot'].map((mode) => {
              const isAvailable = availableAIModes.includes(mode as any);
              const isCurrent = maxAIAutonomy === mode;
              return (
                <div
                  key={mode}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 text-center transition-all ${
                    isCurrent
                      ? 'border-purple-300 bg-purple-50'
                      : isAvailable
                      ? 'border-slate-200 bg-white'
                      : 'border-slate-100 bg-slate-50 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isAvailable ? (
                      isCurrent ? (
                        <Check className="w-4 h-4 text-purple-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )
                    ) : (
                      <X className="w-4 h-4 text-slate-300" />
                    )}
                    <span className={`text-sm font-medium capitalize ${
                      isCurrent ? 'text-purple-700' : isAvailable ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      {mode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {mode === 'audit' && 'AI suggests only'}
                    {mode === 'co-pilot' && 'AI assists with approval'}
                    {mode === 'pilot' && 'Full AI autonomy'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-medium text-slate-900">Invite Team Member</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@university.edu"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="junior">Junior Researcher - Data entry & manuscript drafting</option>
                  <option value="statistician">Statistician - Analytics & commenting</option>
                  <option value="data_entry">Data Entry - Database access only</option>
                </select>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> {ROLE_DESCRIPTIONS[inviteRole]}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteMember}
                disabled={!inviteEmail.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
