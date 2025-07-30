'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface DashboardMetrics {
  total_alerts: number;
  alerts_last_24hr: number;
  critical_alerts: number;
  major_alerts: number;
  minor_alerts: number;
  open_tickets: number;
  resolved_today: number;
  avg_response_time: string;
  compliance_score: string;
  active_agents: number;
  wazuh_health: string;
}

interface AlertsGraphProps {
  data: DashboardMetrics;
}

const generateAlertData = (critical: number, major: number, minor: number) => {
  const now = new Date();
  const hours = [...Array(6)].map((_, i) => {
    const date = new Date(now.getTime() - i * 60 * 60 * 1000);
    const label = `${date.getHours()}:00`;

    return {
      time: label,
      critical: Math.floor(critical / 6),
      major: Math.floor(major / 6),
      minor: Math.floor(minor / 6),
    };
  });

  return hours.reverse();
};

export function AlertsGraph({ data }: AlertsGraphProps) {
  const chartData = generateAlertData(
    data.critical_alerts,
    data.major_alerts,
    data.minor_alerts
  );

  return (
    <div className="h-full flex flex-col bg-[#0f172a] rounded-xl shadow-md text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700/30 to-indigo-700/30 backdrop-blur-sm px-4 py-3 rounded-t-xl">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <h3 className="text-base font-medium text-white">Severity Alerts Graph</h3>
        </div>
        <p className="text-xs text-blue-200/80">Last 6 hours</p>
      </div>

      {/* Chart Section */}
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="#cbd5e1" />
            <YAxis
              stroke="#cbd5e1"
              label={{
                value: 'No. of Alerts',
                angle: -90,
                position: 'insideLeft',
                fill: '#cbd5e1',
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                borderColor: '#334155',
                color: '#f1f5f9',
              }}
              labelStyle={{ color: '#93c5fd' }}
            />
            <Legend wrapperStyle={{ color: '#e2e8f0' }} />
            <Line
              type="monotone"
              dataKey="critical"
              stroke="#ef4444"
              strokeWidth={2}
              name="Critical Alerts"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="major"
              stroke="#fbbf24"
              strokeWidth={2}
              name="Major Alerts"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="minor"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Minor Alerts"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
