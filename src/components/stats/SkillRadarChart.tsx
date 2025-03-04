'use client';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface SkillRadarChartProps {
  labels: string[];
  data: number[];
  label?: string;
  backgroundColor?: string;
  borderColor?: string;
  height?: number;
}

export function SkillRadarChart({
  labels,
  data,
  label = 'Skill Level',
  backgroundColor = 'rgba(79, 70, 229, 0.2)',
  borderColor = 'rgba(79, 70, 229, 1)',
  height = 300
}: SkillRadarChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor,
        borderColor,
        borderWidth: 2,
        pointBackgroundColor: borderColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: borderColor,
        pointLabelFontSize: 14,
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(150, 150, 150, 0.2)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          backdropColor: 'transparent',
          color: '#999',
        },
        grid: {
          color: 'rgba(150, 150, 150, 0.2)',
        },
        pointLabels: {
          color: '#ccc',
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ccc',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.r}%`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Radar data={chartData} options={chartOptions} />
    </div>
  );
}