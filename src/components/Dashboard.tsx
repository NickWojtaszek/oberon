import { Activity, Users, FileCheck, TrendingUp, LayoutDashboard } from 'lucide-react';
import { ContentContainer } from './ui/ContentContainer';
import { useTranslation } from 'react-i18next';

export function Dashboard() {
  const { t } = useTranslation('dashboard');

  const stats = [
    {
      label: t('activeProtocols'),
      value: '12',
      change: '+2 this month',
      icon: FileCheck,
      color: 'blue',
    },
    {
      label: t('lockedPersonas'),
      value: '8',
      change: '3 pending review',
      icon: Users,
      color: 'green',
    },
    {
      label: t('variablesReviewed'),
      value: '1,247',
      change: '234 this week',
      icon: Activity,
      color: 'purple',
    },
    {
      label: t('analysisPlans'),
      value: '23',
      change: '5 in progress',
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Persona locked',
      item: 'Clinical Safety Reviewer v3',
      user: 'Dr. Sarah Chen',
      time: '2 hours ago',
    },
    {
      id: 2,
      action: 'Variables reviewed',
      item: 'PROTO-2024-001 Dataset',
      user: 'Dr. James Wilson',
      time: '4 hours ago',
    },
    {
      id: 3,
      action: 'Analysis plan generated',
      item: 'Phase II Oncology Trial',
      user: 'Dr. Maria Garcia',
      time: '1 day ago',
    },
    {
      id: 4,
      action: 'Protocol created',
      item: 'PROTO-2024-003',
      user: 'Dr. Robert Kim',
      time: '2 days ago',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-6">
          <ContentContainer>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900">{t('header.title')}</h1>
                <p className="text-slate-600 text-sm mt-1">{t('header.description')}</p>
              </div>
            </div>
          </ContentContainer>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <ContentContainer className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: 'bg-blue-50 text-blue-600',
                green: 'bg-green-50 text-green-600',
                purple: 'bg-purple-50 text-purple-600',
                orange: 'bg-orange-50 text-orange-600',
              }[stat.color];

              return (
                <div
                  key={stat.label}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-semibold text-slate-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 mb-2">{stat.label}</div>
                  <div className="text-xs text-slate-500">{stat.change}</div>
                </div>
              );
            })}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-lg text-slate-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-900">
                        <span className="font-medium">{activity.action}:</span>{' '}
                        {activity.item}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {activity.user} · {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-lg text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-left">
                  <div className="font-medium">Create New Protocol</div>
                  <div className="text-xs text-blue-100 mt-1">
                    Start a new clinical trial protocol
                  </div>
                </button>
                <button className="w-full px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition-colors text-left">
                  <div className="font-medium">Review Variables</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Continue variable classification
                  </div>
                </button>
                <button className="w-full px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition-colors text-left">
                  <div className="font-medium">Generate Analysis Plan</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Create structured analysis documentation
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg text-slate-900 mb-4">System Health</h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-slate-600 mb-2">AI Services</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-slate-900">Operational</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-2">Database</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-slate-900">Operational</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-2">API Gateway</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-slate-900">Operational</span>
                </div>
              </div>
            </div>
          </div>
        </ContentContainer>
      </div>
    </div>
  );
}