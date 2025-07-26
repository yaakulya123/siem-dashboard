'use client';

import React, { useState } from 'react';

interface CreateTicketModalProps {
  alertId: string;
  onClose: () => void;
}

export default function CreateTicketModal({ alertId, onClose }: CreateTicketModalProps) {
  const [formData, setFormData] = useState({
    timeOfActivity: '',
    affectedEntities: '',
    reasonTruePositive: '',
    reasonEscalation: '',
    remediationActions: '',
    attackIndicators: '',
  });

  const [showDetails, setShowDetails] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `🚨 Incident Report (Alert ID: ${alertId})\n\n` +
      `Time of activity: ${formData.timeOfActivity}\n` +
      `Affected Entities: ${formData.affectedEntities}\n` +
      `Reason for True Positive: ${formData.reasonTruePositive}\n` +
      `Reason for Escalation: ${formData.reasonEscalation}\n` +
      `Remediation Actions: ${formData.remediationActions}\n` +
      `Attack Indicators: ${formData.attackIndicators}`;

    alert('Report submitted and sent to email!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center p-4">
      <div className="bg-[#111827] text-white p-6 rounded-lg w-full max-w-6xl relative overflow-y-auto max-h-[90vh] p-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-300 hover:text-white text-xl"
        >
          &times;
        </button>

        <h1 className="text-2xl font-semibold mb-4">Case report for multiple alerts</h1>

        <div className="bg-[#1f2937] p-4 rounded-md mb-8">
          <div className="flex gap-4 mb-4">
            <button className="bg-blue-700 px-4 py-1 rounded text-sm">ID {alertId}</button>
            
          </div>

          <table className="w-full text-sm text-left border border-gray-600 border-collapse mb-2">
            <thead className="text-gray-400 bg-[#1f2937]">
              <tr>
                <th className="pb-2 px-2 border border-gray-600">ID</th>
                <th className="px-2 border border-gray-600">Alert rule</th>
                <th className="px-2 border border-gray-600">Description</th>
                <th className="px-2 border border-gray-600">Incident type</th>
                <th className="px-2 border border-gray-600">Severity level</th>
                <th className="px-2 border border-gray-600">Date and time detected</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pt-2 px-2 border border-gray-600">{alertId}</td>
                <td className="px-2 border border-gray-600">Access to Blacklisted External URL Blocked by Firewall</td>
                <td className="max-w-xl px-2 border border-gray-600">
                  This alert was triggered when a user attempted to access an external URL that is listed in the organization’s blacklist or threat intelligence feeds. The firewall or proxy successfully blocked the outbound request, preventing the connection. Note: The blacklist only covers known threats. It does not guarantee protection against new or unknown malicious domains.
                </td>
                <td className="px-2 border border-gray-600">Firewall</td>
                <td className="text-yellow-500 px-2 border border-gray-600">High</td>
                <td className="px-2 border border-gray-600">Jul 14th 2025 at 18:51</td>
              </tr>
            </tbody>
          </table>

          <div
            className="mt-2 text-sm text-blue-400 cursor-pointer select-none"
            onClick={() => setShowDetails(!showDetails)}
          >
            Alert details {showDetails ? '▴' : '▾'}
          </div>

          {showDetails && (
            <div className="mt-3 text-gray-300 text-sm bg-[#111827] p-3 rounded border border-gray-600">
              <p><strong>Source:</strong> Internal Firewall Appliance</p>
              <p><strong>Blocked URL:</strong> `http://malicious-phish-site.biz`</p>
              <p><strong>IP:</strong> 203.0.113.45</p>
              <p><strong>User:</strong> `johndoe@company.com`</p>
              <p><strong>Policy Matched:</strong> “Outbound Traffic Filtering > Block External Threats”</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-medium mb-2">Incident report</h2>
            <p className="text-sm text-gray-400 mb-4">
              Please write a detailed report on the steps taken to analyse and contain this incident, including all relevant information and the rationale for its closure.
            </p>

            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="classification" value="true" defaultChecked />
                <span>True positive</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="classification" value="false" />
                <span>False positive</span>
              </label>
            </div>

            <div className="bg-[#1f2937] p-4 rounded-md grid grid-cols-1 gap-4">
              {[
                { name: 'timeOfActivity', placeholder: 'Time of activity' },
                { name: 'affectedEntities', placeholder: 'List of Affected Entities' },
                { name: 'reasonTruePositive', placeholder: 'Reason for Classifying as True Positive' },
                { name: 'reasonEscalation', placeholder: 'Reason for Escalating the Alert' },
                { name: 'remediationActions', placeholder: 'Recommended Remediation Actions' },
                { name: 'attackIndicators', placeholder: 'List of Attack Indicators' }
              ].map(({ name, placeholder }) => (
                <textarea
                  key={name}
                  name={name}
                  placeholder={placeholder}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  className="w-full bg-[#111827] text-white border border-gray-600 rounded p-3"
                  rows={2}
                />
              ))}
            </div>
          </div>

          <div className="text-right flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => alert("Report sent to email!")}
              className="inline-flex ml-4 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Send to email
            </button>
            <button
              type="submit"
              className="ml-4 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Submit and close alerts
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
