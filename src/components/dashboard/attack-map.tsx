'use client';

import { useState, useEffect } from 'react';
import { GlobeAltIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Attack {
  id: string;
  sourceCountry: string;
  sourceCode: string;
  targetCountry: string;
  targetCode: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  attackType: string;
  timestamp: Date;
  sourceCoords: [number, number];
  targetCoords: [number, number];
  active: boolean;
}

// Accurate world coordinates based on the vector world map image
const countryCoords: { [key: string]: [number, number] } = {
  'US': [220, 200],    // United States
  'CN': [700, 220],    // China
  'RU': [650, 140],    // Russia
  'DE': [520, 160],    // Germany
  'GB': [480, 150],    // United Kingdom
  'JP': [750, 210],    // Japan
  'IN': [620, 250],    // India
  'BR': [320, 320],    // Brazil
  'KR': [740, 200],    // South Korea
  'FR': [500, 170],    // France
  'IT': [520, 180],    // Italy
  'CA': [200, 120],    // Canada
  'AU': [720, 360],    // Australia
  'IR': [580, 210],    // Iran
  'KP': [735, 195],    // North Korea
  'PK': [600, 240],    // Pakistan
  'TR': [560, 180],    // Turkey
  'SA': [570, 230],    // Saudi Arabia
  'NG': [520, 260],    // Nigeria
  'ZA': [540, 360],    // South Africa
  'EG': [550, 220],    // Egypt
  'MX': [180, 240],    // Mexico
};

const mockAttacks: Attack[] = [
  {
    id: '1',
    sourceCountry: 'China',
    sourceCode: 'CN',
    targetCountry: 'United States',
    targetCode: 'US',
    severity: 'critical',
    attackType: 'APT Campaign',
    timestamp: new Date(),
    sourceCoords: countryCoords.CN,
    targetCoords: countryCoords.US,
    active: true,
  },
  {
    id: '2',
    sourceCountry: 'Russia',
    sourceCode: 'RU',
    targetCountry: 'Germany',
    targetCode: 'DE',
    severity: 'high',
    attackType: 'Ransomware',
    timestamp: new Date(Date.now() - 300000),
    sourceCoords: countryCoords.RU,
    targetCoords: countryCoords.DE,
    active: true,
  },
  {
    id: '3',
    sourceCountry: 'North Korea',
    sourceCode: 'KP',
    targetCountry: 'South Korea',
    targetCode: 'KR',
    severity: 'high',
    attackType: 'State Sponsored',
    timestamp: new Date(Date.now() - 150000),
    sourceCoords: countryCoords.KP,
    targetCoords: countryCoords.KR,
    active: true,
  },
];

const severityColors = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#ca8a04',
  low: '#2563eb',
};

export function AttackMap() {
  const [attacks, setAttacks] = useState<Attack[]>(mockAttacks);
  const [hoveredAttack, setHoveredAttack] = useState<Attack | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const sourceCountries = Object.keys(countryCoords);
        const sourceCode = sourceCountries[Math.floor(Math.random() * sourceCountries.length)];
        let targetCode = sourceCountries[Math.floor(Math.random() * sourceCountries.length)];
        
        while (targetCode === sourceCode) {
          targetCode = sourceCountries[Math.floor(Math.random() * sourceCountries.length)];
        }
        
        const severities: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low'];
        const attackTypes = ['APT Campaign', 'Ransomware', 'DDoS Attack', 'Phishing Campaign', 'Malware', 'Brute Force'];
        
        const newAttack: Attack = {
          id: Date.now().toString(),
          sourceCountry: getCountryName(sourceCode),
          sourceCode,
          targetCountry: getCountryName(targetCode),
          targetCode,
          severity: severities[Math.floor(Math.random() * severities.length)],
          attackType: attackTypes[Math.floor(Math.random() * attackTypes.length)],
          timestamp: new Date(),
          sourceCoords: countryCoords[sourceCode],
          targetCoords: countryCoords[targetCode],
          active: true,
        };
        
        setAttacks(prev => [newAttack, ...prev.slice(0, 9)]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getCountryName = (code: string): string => {
    const countryNames: { [key: string]: string } = {
      'US': 'United States', 'CN': 'China', 'RU': 'Russia', 'DE': 'Germany',
      'GB': 'United Kingdom', 'JP': 'Japan', 'IN': 'India', 'BR': 'Brazil',
      'KR': 'South Korea', 'FR': 'France', 'IT': 'Italy', 'CA': 'Canada',
      'AU': 'Australia', 'IR': 'Iran', 'KP': 'North Korea', 'PK': 'Pakistan',
      'TR': 'Turkey', 'SA': 'Saudi Arabia', 'NG': 'Nigeria', 'ZA': 'South Africa',
      'EG': 'Egypt', 'MX': 'Mexico',
    };
    return countryNames[code] || code;
  };

  const calculatePath = (source: [number, number], target: [number, number]) => {
    const [srcX, srcY] = source;
    const [tgtX, tgtY] = target;
    const midX = (srcX + tgtX) / 2;
    const midY = Math.min(srcY, tgtY) - 50;
    return `M ${srcX} ${srcY} Q ${midX} ${midY} ${tgtX} ${tgtY}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
            <GlobeAltIcon className="h-5 w-5 text-white" />
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Live monitoring active</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="status-dot active"></div>
          <span className="text-sm text-green-600 dark:text-green-400">Real-time updates</span>
        </div>
      </div>

      <div className="relative">
        <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-gray-200/70 dark:border-gray-700/40 shadow-md">
          {/* World Map Background Image */}
          <img
            src="/vector-world-map.jpg"
            alt="World Map"
            className="w-full h-full object-cover"
          />
          
          {/* SVG Overlay for Attack Visualization */}
          <svg
            viewBox="0 0 900 400"
            className="absolute inset-0 w-full h-full"
          >
            {/* Attack paths */}
            {attacks.map((attack, index) => {
              const path = calculatePath(attack.sourceCoords, attack.targetCoords);
              const animationDelay = index * 0.8;
              
              return (
                <g key={attack.id}>
                  <defs>
                    <path
                      id={`path-${attack.id}`}
                      d={path}
                    />
                  </defs>
                  <path
                    d={path}
                    fill="none"
                    stroke={severityColors[attack.severity]}
                    strokeWidth="3"
                    strokeOpacity="0.8"
                    strokeDasharray="10,5"
                    className="cursor-pointer drop-shadow-lg"
                    onMouseEnter={() => setHoveredAttack(attack)}
                    onMouseLeave={() => setHoveredAttack(null)}
                  />
                  
                  <circle
                    r="5"
                    fill={severityColors[attack.severity]}
                    opacity="0.9"
                    className="drop-shadow-md"
                  >
                    <animateMotion
                      dur="6s"
                      repeatCount="indefinite"
                      begin={`${animationDelay}s`}
                    >
                      <mpath href={`#path-${attack.id}`} />
                    </animateMotion>
                  </circle>
                </g>
              );
            })}

            {/* Country markers */}
            {Object.entries(countryCoords).map(([code, [x, y]]) => {
              const isSource = attacks.some(attack => attack.sourceCode === code);
              const isTarget = attacks.some(attack => attack.targetCode === code);
              const isActive = isSource || isTarget;
              
              return (
                <g key={code}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isActive ? "8" : "5"}
                    fill={isSource ? "#dc2626" : isTarget ? "#2563eb" : "#6b7280"}
                    opacity={isActive ? "0.9" : "0.7"}
                    className={`${isActive ? "animate-pulse" : ""} drop-shadow-md`}
                    stroke="white"
                    strokeWidth="1"
                  />
                  {isActive && (
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill="none"
                      stroke={isSource ? "#dc2626" : "#2563eb"}
                      strokeWidth="2"
                      strokeOpacity="0.5"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Hover tooltip */}
          {hoveredAttack && (
            <div
              className="absolute bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 text-sm max-w-xs"
              style={{
                left: `${(hoveredAttack.sourceCoords[0] + hoveredAttack.targetCoords[0]) / 2}px`,
                top: `${(hoveredAttack.sourceCoords[1] + hoveredAttack.targetCoords[1]) / 2}px`,
                transform: 'translate(-50%, -130%)',
              }}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                <ExclamationTriangleIcon
                  className="h-4 w-4"
                  style={{ color: severityColors[hoveredAttack.severity] }}
                />
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {hoveredAttack.severity} {hoveredAttack.attackType}
                </span>
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-xs">
                <div className="mb-1">
                  <span className="font-medium">From:</span> {hoveredAttack.sourceCountry}
                </div>
                <div className="mb-1">
                  <span className="font-medium">To:</span> {hoveredAttack.targetCountry}
                </div>
                <div>
                  <span className="font-medium">Time:</span>{' '}
                  {hoveredAttack.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-100 dark:border-gray-700/30 shadow-sm">
          <div className="text-xs text-gray-500 dark:text-gray-400">Active Attacks</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">{attacks.length}</div>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-100 dark:border-gray-700/30 shadow-sm">
          <div className="text-xs text-gray-500 dark:text-gray-400">Critical Threats</div>
          <div className="text-lg font-bold text-red-600 dark:text-red-400">
            {attacks.filter(a => a.severity === 'critical').length}
          </div>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-100 dark:border-gray-700/30 shadow-sm">
          <div className="text-xs text-gray-500 dark:text-gray-400">Source Countries</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {new Set(attacks.map(a => a.sourceCode)).size}
          </div>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-100 dark:border-gray-700/30 shadow-sm">
          <div className="text-xs text-gray-500 dark:text-gray-400">Target Countries</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {new Set(attacks.map(a => a.targetCode)).size}
          </div>
        </div>
      </div>
    </div>
  );
} 