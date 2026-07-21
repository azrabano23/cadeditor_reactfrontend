import React, { useState } from 'react';
import { 
  BarChart3, Eye, Smartphone, 
  Users, Clock
} from 'lucide-react';

interface ARSession {
  id: string;
  modelId: string;
  modelName: string;
  userId: string;
  userName: string;
  device: 'MetaQuest' | 'HoloLens' | 'Unknown';
  duration: number; // in seconds
  timestamp: Date;
  location?: string;
  actions: string[];
}

interface AnalyticsData {
  totalViews: number;
  totalLaunches: number;
  uniqueUsers: number;
  averageSessionDuration: number;
  mostPopularModel: string;
  deviceBreakdown: { device: string; count: number }[];
  recentSessions: ARSession[];
  weeklyTrend: { date: string; views: number; launches: number }[];
}

interface ARAnalyticsProps {
  onClose?: () => void;
}

const ARAnalytics: React.FC<ARAnalyticsProps> = ({ onClose }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    totalViews: 1247,
    totalLaunches: 892,
    uniqueUsers: 156,
    averageSessionDuration: 342, // seconds
    mostPopularModel: 'Engine Component v2.1',
    deviceBreakdown: [
      { device: 'MetaQuest', count: 634 },
      { device: 'HoloLens', count: 258 },
      { device: 'Unknown', count: 0 }
    ],
    recentSessions: [
      {
        id: '1',
        modelId: 'model-1',
        modelName: 'Engine Component v2.1',
        userId: 'user-1',
        userName: 'John Doe',
        device: 'MetaQuest',
        duration: 420,
        timestamp: new Date('2024-03-15T14:30:00'),
        location: 'San Francisco, CA',
        actions: ['rotate', 'scale', 'measure']
      },
      {
        id: '2',
        modelId: 'model-2',
        modelName: 'Office Chair Design',
        userId: 'user-2',
        userName: 'Jane Smith',
        device: 'HoloLens',
        duration: 280,
        timestamp: new Date('2024-03-15T13:45:00'),
        location: 'New York, NY',
        actions: ['view', 'comment']
      },
      {
        id: '3',
        modelId: 'model-3',
        modelName: 'Smartphone Case',
        userId: 'user-3',
        userName: 'Bob Wilson',
        device: 'MetaQuest',
        duration: 195,
        timestamp: new Date('2024-03-15T12:15:00'),
        location: 'Austin, TX',
        actions: ['inspect', 'measure']
      }
    ],
    weeklyTrend: [
      { date: 'Mar 9', views: 45, launches: 32 },
      { date: 'Mar 10', views: 52, launches: 38 },
      { date: 'Mar 11', views: 48, launches: 35 },
      { date: 'Mar 12', views: 61, launches: 44 },
      { date: 'Mar 13', views: 67, launches: 49 },
      { date: 'Mar 14', views: 73, launches: 52 },
      { date: 'Mar 15', views: 89, launches: 67 }
    ]
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'MetaQuest': return '🥽';
      case 'HoloLens': return '👓';
      default: return '❓';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'rotate': return '🔄';
      case 'scale': return '📏';
      case 'measure': return '📐';
      case 'view': return '👁️';
      case 'comment': return '💬';
      case 'inspect': return '🔍';
      default: return '⚡';
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold">AR Analytics</h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-accent" />
              <span className="text-gray-400">Total Views</span>
            </div>
            <div className="text-3xl font-bold text-white">{analyticsData.totalViews.toLocaleString()}</div>
            <div className="text-green-400 text-sm mt-1">+12% from last period</div>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="w-5 h-5 text-accent" />
              <span className="text-gray-400">AR Launches</span>
            </div>
            <div className="text-3xl font-bold text-white">{analyticsData.totalLaunches.toLocaleString()}</div>
            <div className="text-green-400 text-sm mt-1">+8% from last period</div>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-accent" />
              <span className="text-gray-400">Unique Users</span>
            </div>
            <div className="text-3xl font-bold text-white">{analyticsData.uniqueUsers}</div>
            <div className="text-blue-400 text-sm mt-1">+5 new this week</div>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-accent" />
              <span className="text-gray-400">Avg. Session</span>
            </div>
            <div className="text-3xl font-bold text-white">{formatDuration(analyticsData.averageSessionDuration)}</div>
            <div className="text-yellow-400 text-sm mt-1">+2m from last period</div>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <h3 className="text-lg font-semibold mb-4">Device Usage</h3>
            <div className="space-y-3">
              {analyticsData.deviceBreakdown.map((device) => (
                <div key={device.device} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getDeviceIcon(device.device)}</span>
                    <span className="font-medium">{device.device}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-zinc-700 rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${(device.count / analyticsData.totalLaunches) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">
                      {device.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <h3 className="text-lg font-semibold mb-4">Most Popular Model</h3>
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <div className="font-medium text-white mb-2">{analyticsData.mostPopularModel}</div>
              <div className="text-gray-400 text-sm">Viewed 234 times this period</div>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
          <h3 className="text-lg font-semibold mb-4">Recent AR Sessions</h3>
          <div className="space-y-4">
            {analyticsData.recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{getDeviceIcon(session.device)}</div>
                  <div>
                    <div className="font-medium text-white">{session.modelName}</div>
                    <div className="text-sm text-gray-400">
                      {session.userName} • {session.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Duration</div>
                    <div className="font-medium">{formatDuration(session.duration)}</div>
                  </div>
                  <div className="flex gap-1">
                    {session.actions.map((action, index) => (
                      <span key={index} className="text-lg" title={action}>
                        {getActionIcon(action)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend Chart */}
        <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 mt-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Trend</h3>
          <div className="flex items-end justify-between h-32">
            {analyticsData.weeklyTrend.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex flex-col items-center gap-1 mb-2">
                  <div 
                    className="bg-accent rounded-t-sm"
                    style={{ 
                      height: `${(day.views / Math.max(...analyticsData.weeklyTrend.map(d => d.views))) * 60}px`,
                      width: '20px'
                    }}
                  />
                  <div 
                    className="bg-blue-500 rounded-t-sm"
                    style={{ 
                      height: `${(day.launches / Math.max(...analyticsData.weeklyTrend.map(d => d.launches))) * 60}px`,
                      width: '20px'
                    }}
                  />
                </div>
                <div className="text-xs text-gray-400">{day.date}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-sm"></div>
              <span className="text-sm text-gray-400">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <span className="text-sm text-gray-400">Launches</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARAnalytics; 