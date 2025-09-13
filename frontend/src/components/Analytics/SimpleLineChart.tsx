import React from 'react';

interface LineChartData {
  label: string;
  value: number;
}

interface SimpleLineChartProps {
  data: LineChartData[];
  height?: number;
  color?: string;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  height = 200,
  color = '#3B82F6'
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y, index) => (
          <line
            key={index}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="#E5E7EB"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((item.value - minValue) / range) * 100;
          
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              className="hover:r-3 transition-all duration-200"
            >
              <title>{`${item.label}: ${item.value}`}</title>
            </circle>
          );
        })}
      </svg>
      
      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        {data.map((item, index) => (
          <span key={index} className="text-center">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};
