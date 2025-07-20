import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { useConverterStore } from '@/stores/useConverterStore';
import { useTranslation } from '@/hooks/useTranslation';

Chart.register(...registerables);

interface CurrencyChartProps {
  baseCurrency: string;
  targetCurrency: string;
  period: string;
}

export function CurrencyChart({ baseCurrency, targetCurrency, period }: CurrencyChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const { historicalData } = useConverterStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (!chartRef.current || !historicalData.length) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = historicalData.map(item => 
      new Date(item.date).toLocaleDateString()
    );
    const data = historicalData.map(item => parseFloat(item.rate));

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${baseCurrency}/${targetCurrency}`,
          data,
          borderColor: 'rgb(25, 118, 210)',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          y: {
            display: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            },
            beginAtZero: false
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    };

    chartInstanceRef.current = new Chart(ctx, config);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [historicalData, baseCurrency, targetCurrency]);

  return (
    <div className="chart-container">
      <canvas ref={chartRef} />
    </div>
  );
}
