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

// Simulate alert data over last 6 hours
const generateAlertData = () => {
  const now = new Date();
  const hours = [...Array(6)].map((_, i) => {
    const date = new Date(now.getTime() - i * 60 * 60 * 1000);
    const label = `${date.getHours()}:00`;

    return {
      time: label,
      critical: i === 0 ? 0 : Math.floor(Math.random() * 2),
      major: i === 0 ? 0 : Math.floor(Math.random() * 2),
      minor: i === 0 ? 2 : Math.floor(Math.random() * 5),
    };
  });

  return hours.reverse();
};

export function AlertsGraph() {
  const data = generateAlertData();

  return (
    <div className="h-full flex flex-col bg-[#0f172a] rounded-xl shadow-md text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700/30 to-indigo-700/30 backdrop-blur-sm px-4 py-3 rounded-t-xl">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <h3 className="text-base font-medium text-white">Severity Alerts Graph</h3>
        </div>
        <p className="text-xs text-blue-200/80">Last 24 hours</p>
      </div>

      {/* Chart Section */}
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" label={{ value: 'No. of Alerts', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
              labelStyle={{ color: '#93c5fd' }}
            />
            <Legend wrapperStyle={{ color: '#e2e8f0' }} />
            <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} name="Critical Alerts" dot={{ r: 3 }} />
            <Line type="monotone" dataKey="major" stroke="#fbbf24" strokeWidth={2} name="Major Alerts" dot={{ r: 3 }} />
            <Line type="monotone" dataKey="minor" stroke="#3b82f6" strokeWidth={2} name="Minor Alerts" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
