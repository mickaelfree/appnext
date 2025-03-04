'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Configure global defaults
ChartJS.defaults.color = '#94a3b8'; // text color
ChartJS.defaults.borderColor = '#334155'; // grid lines
ChartJS.defaults.scale.grid.display = false;

interface ProgressChartProps {
  type: 'line' | 'bar';
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
  title?: string;
  height?: number;
}

export function ProgressChart({ 
  type, 
  labels, 
  datasets, 
  title = '',
  height = 300
}: ProgressChartProps) {
  // Create chart data
  const data: ChartData<'line' | 'bar'> = {
    labels,
    datasets: datasets.map(dataset => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.borderColor || (type === 'line' ? '#3b82f6' : undefined),
      backgroundColor: dataset.backgroundColor || (type === 'line' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.5)'),
      borderWidth: 2,
      tension: 0.2,
      pointBackgroundColor: dataset.borderColor || '#3b82f6',
      fill: type === 'line',
    })),
  };

  // Configure chart options
  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (type === 'line') {
    return <Line data={data} options={options} height={height} />;
  } else {
    return <Bar data={data} options={options} height={height} />;
  }
}