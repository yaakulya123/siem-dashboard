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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <GlobeAltIcon className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Global Threat Map
          </h3>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Live monitoring active
        </div>
      </div>

      <div className="relative">
        <div className="relative w-full h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
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
                    r="4"
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
                      opacity="0.5"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Tooltip */}
        {hoveredAttack && (
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border max-w-xs z-10">
            <div className="flex items-center mb-2">
              <ExclamationTriangleIcon 
                className={`h-4 w-4 mr-2 ${
                  hoveredAttack.severity === 'critical' ? 'text-red-500' :
                  hoveredAttack.severity === 'high' ? 'text-orange-500' :
                  hoveredAttack.severity === 'medium' ? 'text-yellow-500' :
                  'text-blue-500'
                }`}
              />
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                hoveredAttack.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                hoveredAttack.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                hoveredAttack.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {hoveredAttack.severity.toUpperCase()}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {hoveredAttack.attackType}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {hoveredAttack.sourceCountry} → {hoveredAttack.targetCountry}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {hoveredAttack.timestamp.toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-300">Critical</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-300">High</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-yellow-600 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-300">Medium</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-300">Low</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {attacks.length} active threats detected
        </p>
      </div>
    </div>
  );
} 