'use client';

import { useState, useEffect, useRef } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import * as d3 from 'd3';
import { geoPath, geoMercator, geoGraticule, geoOrthographic } from 'd3-geo';
import { feature } from 'topojson-client';

interface Attack {
  id: string;
  sourceCountry: string;
  sourceCode: string;
  targetCountry: string;
  targetCode: string;
  severity: 'critical' | 'major' | 'minor';
  attackType: string;
  timestamp: Date;
  sourceCoords: [number, number];
  targetCoords: [number, number];
  active: boolean;
}

interface CountryFeature {
  type: string;
  id: string;
  properties: {
    name: string;
  };
  geometry: {
    type: string;
    coordinates: any[];
  };
}

// Country coordinates in [longitude, latitude] format
const countryCoords: { [key: string]: [number, number] } = {
  'US': [-95.7129, 37.0902],    // United States
  'CN': [104.1954, 35.8617],    // China
  'RU': [105.3188, 61.5240],    // Russia
  'DE': [10.4515, 51.1657],     // Germany
  'GB': [-3.4360, 55.3781],     // United Kingdom
  'JP': [138.2529, 36.2048],    // Japan
  'IN': [78.9629, 20.5937],     // India
  'BR': [-51.9253, -14.2350],   // Brazil
  'KR': [127.7669, 35.9078],    // South Korea
  'FR': [2.2137, 46.2276],      // France
  'IT': [12.5674, 41.8719],     // Italy
  'CA': [-106.3468, 56.1304],   // Canada
  'AU': [133.7751, -25.2744],   // Australia
  'IR': [53.6880, 32.4279],     // Iran
  'KP': [127.5101, 40.3399],    // North Korea
  'PK': [69.3451, 30.3753],     // Pakistan
  'TR': [35.2433, 38.9637],     // Turkey
  'SA': [45.0792, 23.8859],     // Saudi Arabia
  'NG': [8.6753, 9.0820],       // Nigeria
  'ZA': [22.9375, -30.5595],    // South Africa
  'EG': [30.8025, 26.8206],     // Egypt
  'MX': [-102.5528, 23.6345],   // Mexico
  'ID': [113.9213, -0.7893],    // Indonesia
  'SG': [103.8198, 1.3521],     // Singapore
  'IL': [34.8516, 31.0461],     // Israel
  'UA': [31.1656, 48.3794],     // Ukraine
  'KZ': [66.9237, 48.0196],     // Kazakhstan
  'AR': [-63.6167, -38.4161],   // Argentina
  'TH': [100.9925, 15.8700],    // Thailand
  'VN': [108.2772, 14.0583],    // Vietnam
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
    severity: 'major',
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
    severity: 'major',
    attackType: 'State Sponsored',
    timestamp: new Date(Date.now() - 150000),
    sourceCoords: countryCoords.KP,
    targetCoords: countryCoords.KR,
    active: true,
  },
  {
    id: '4',
    sourceCountry: 'Iran',
    sourceCode: 'IR',
    targetCountry: 'Israel',
    targetCode: 'IL',
    severity: 'critical',
    attackType: 'DDoS Attack',
    timestamp: new Date(Date.now() - 450000),
    sourceCoords: countryCoords.IR,
    targetCoords: countryCoords.IL,
    active: true,
  },
  {
    id: '5',
    sourceCountry: 'Vietnam',
    sourceCode: 'VN',
    targetCountry: 'Singapore',
    targetCode: 'SG',
    severity: 'minor',
    attackType: 'Phishing Campaign',
    timestamp: new Date(Date.now() - 600000),
    sourceCoords: countryCoords.VN,
    targetCoords: countryCoords.SG,
    active: true,
  },
];

// Enhanced severity colors with better visual impact
const severityColors = {
  critical: '#ff3b3b',  // Brighter red
  major: '#ff7700',     // Brighter orange
  minor: '#ffcc00',     // Brighter yellow
};

// Glow effect definitions
const glowEffects = {
  critical: '0 0 8px #ff3b3b, 0 0 12px rgba(255, 59, 59, 0.6)',
  major: '0 0 8px #ff7700, 0 0 12px rgba(255, 119, 0, 0.6)',
  minor: '0 0 8px #ffcc00, 0 0 12px rgba(255, 204, 0, 0.6)',
};

export function AttackMap() {
  const [worldData, setWorldData] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 450 });
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const globeRef = useRef<SVGSVGElement>(null);
  const rotationRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);

  // Load world map data
  useEffect(() => {
    fetch('/data/countries-110m.json')
      .then(response => response.json())
      .then(data => {
        setWorldData(data);
      })
      .catch(error => console.error('Error loading world data:', error));
  }, []);

  // Get container dimensions
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        const { width, height } = containerRef.current!.getBoundingClientRect();
        setDimensions({ width, height });
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  // Render the main map
  useEffect(() => {
    if (!worldData || !svgRef.current) return;

    const width = dimensions.width * 0.75; // Use 75% of the container width for the main map
    const height = dimensions.height;
    const svg = d3.select(svgRef.current);

    // Clear previous content
    svg.selectAll('*').remove();

    // Create defs for patterns and filters
    const defs = svg.append('defs');
    
    // Add subtle noise pattern
    const noisePattern = defs.append('pattern')
      .attr('id', 'noisePattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 200)
      .attr('height', 200)
      .attr('patternTransform', 'scale(0.5)');
      
    noisePattern.append('rect')
      .attr('width', 200)
      .attr('height', 200)
      .attr('fill', '#0f172a');
      
    // Add subtle dots to the pattern
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 200;
      const y = Math.random() * 200;
      const size = Math.random() * 1 + 0.5;
      const opacity = Math.random() * 0.2 + 0.1;
      
      noisePattern.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', size)
        .attr('fill', '#ffffff')
        .attr('opacity', opacity);
    }

    // Create projection and path generator with better fit
    const projection = geoMercator()
      .scale((width / 7.0) * 0.85) // Increased scale
      .center([70, 20]) // Shifted center significantly more to move the map to the extreme left
      .translate([width * 0.52, height / 2]); // Move translation point much further left

    const pathGenerator = geoPath().projection(projection);
    
    // Create graticule
    const graticule = geoGraticule();
    
    // Background rectangle (ocean) with gradient and pattern
    const bgGradient = defs.append('linearGradient')
      .attr('id', 'ocean-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');
      
    bgGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#0f172a');
      
    bgGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#1e293b');
    
    // Background with gradient
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#ocean-gradient)');
      
    // Add noise pattern overlay
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#noisePattern)')
      .attr('opacity', 0.3);

    // Draw graticule with enhanced styling
    svg.append('path')
      .datum(graticule())
      .attr('d', pathGenerator as any)
      .attr('fill', 'none')
      .attr('stroke', '#334155')
      .attr('stroke-width', 0.5)
      .attr('stroke-opacity', 0.5);

    // Convert TopoJSON to GeoJSON
    const countries = feature(
      worldData,
      worldData.objects.countries
    );

    // Create map gradient
    const mapGradient = defs.append('linearGradient')
      .attr('id', 'country-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');
      
    mapGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#1f2937');
      
    mapGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#374151');

    // Draw countries with enhanced styling
    svg.selectAll('.country')
      .data((countries as any).features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', pathGenerator as any)
      .attr('fill', 'url(#country-gradient)')
      .attr('stroke', '#4b5563')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.9);

  }, [worldData, dimensions]);

  // Render the rotating globe
  useEffect(() => {
    if (!worldData || !globeRef.current) return;

    const width = dimensions.width * 0.25; // Use 25% of the container width for the globe
    const height = dimensions.height;
    const svg = d3.select(globeRef.current);

    // Clear previous content
    svg.selectAll('*').remove();

    // Create defs for patterns and filters
    const defs = svg.append('defs');
    
    // Create globe gradient
    const globeGradient = defs.append('radialGradient')
      .attr('id', 'globe-gradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
      
    globeGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#2563eb');
      
    globeGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#1e40af');

    // Create glow filter
    const glowFilter = defs.append('filter')
      .attr('id', 'globe-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
      
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'blur');
      
    glowFilter.append('feComposite')
      .attr('in', 'blur')
      .attr('in2', 'SourceGraphic')
      .attr('operator', 'out')
      .attr('result', 'glow');
      
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'glow');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Background for the globe section
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#0f172a');

    // Create a group for the globe, centered in the available space
    const globeGroup = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create orthographic projection for the globe
    const globeRadius = Math.min(width, height) * 0.35;
    const globeProjection = geoOrthographic()
      .scale(globeRadius)
      .translate([0, 0])
      .clipAngle(90);

    const globePathGenerator = geoPath().projection(globeProjection);

    // Draw the globe base
    globeGroup.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', globeRadius)
      .attr('fill', 'url(#globe-gradient)')
      .attr('stroke', '#4b5563')
      .attr('stroke-width', 0.5)
      .style('filter', 'url(#globe-glow)');

    // Convert TopoJSON to GeoJSON
    const countries = feature(
      worldData,
      worldData.objects.countries
    );

    // Draw countries on the globe
    const globeCountries = globeGroup.append('g');
    
    globeCountries.selectAll('.globe-country')
      .data((countries as any).features)
      .enter()
      .append('path')
      .attr('class', 'globe-country')
      .attr('fill', 'none')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 0.5)
      .attr('stroke-opacity', 0.3);

    // Draw graticule
    const globeGraticule = geoGraticule();
    globeGroup.append('path')
      .datum(globeGraticule())
      .attr('fill', 'none')
      .attr('stroke', '#4b5563')
      .attr('stroke-width', 0.3)
      .attr('stroke-opacity', 0.3)
      .attr('d', globePathGenerator as any);

    // Add scanning effect
    const scanLine = globeGroup.append('ellipse')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('rx', globeRadius)
      .attr('ry', globeRadius * 0.1)
      .attr('fill', 'rgba(37, 99, 235, 0.3)')
      .style('filter', 'blur(4px)');

    // Add "Scanning" text
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#4ade80')
      .text('Scanning for threats');

    // Animation function
    const animateGlobe = () => {
      rotationRef.current += 0.5;
      
      // Update globe rotation
      globeProjection.rotate([rotationRef.current, -20, 0]);
      
      // Update countries
      globeCountries.selectAll('.globe-country')
        .attr('d', globePathGenerator as any);
      
      // Update graticule
      globeGroup.select('path')
        .attr('d', globePathGenerator as any);
      
      // Animate scan line
      const scanY = Math.sin(rotationRef.current * 0.05) * globeRadius;
      scanLine.attr('cy', scanY);
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animateGlobe);
    };
    
    // Start animation
    animateGlobe();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [worldData, dimensions]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
            <GlobeAltIcon className="h-5 w-5 text-white" />
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Global Threat Map</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 dark:text-green-400">Real-time updates</span>
        </div>
      </div>

      <div className="relative">
        <div 
          ref={containerRef}
          className="relative w-full h-[380px] rounded-xl overflow-hidden border border-gray-200/70 dark:border-gray-700/40 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 flex"
        >
          {/* Main map */}
          <svg
            ref={svgRef}
            className="w-[75%] h-full"
            preserveAspectRatio="xMinYMid meet"
          ></svg>
          
          {/* Rotating globe */}
          <svg
            ref={globeRef}
            className="w-[25%] h-full"
            preserveAspectRatio="xMidYMid meet"
          ></svg>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30">
            <div className="text-xs text-gray-400 mb-1">Monitored Regions</div>
            <div className="text-2xl font-bold text-white">24</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30">
            <div className="text-xs text-gray-400 mb-1">Security Zones</div>
            <div className="text-2xl font-bold text-blue-500">
              6
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30">
            <div className="text-xs text-gray-400 mb-1">Coverage</div>
            <div className="text-2xl font-bold text-white">
              92%
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30">
            <div className="text-xs text-gray-400 mb-1">Network Points</div>
            <div className="text-2xl font-bold text-white">
              187
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 