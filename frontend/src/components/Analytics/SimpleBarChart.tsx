import React from 'react';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  height?: number;
  showValues?: boolean;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  height = 200,
  showValues = true
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'
  ];

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-between h-full space-x-2">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          const color = item.color || colors[index % colors.length];
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                {showValues && (
                  <div className="text-xs text-gray-600 mb-1">
                    {item.value}
                  </div>
                )}
                <div
                  className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                  style={{
                    height: barHeight,
                    backgroundColor: color,
                    minHeight: item.value > 0 ? '4px' : '0px'
                  }}
                  title={`${item.label}: ${item.value}`}
                />
              </div>
              <div className="text-xs text-gray-600 mt-2 text-center">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
