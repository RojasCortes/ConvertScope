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
    if (!chartRef.current) return;
    
    // Debug log
    console.log('Historical data:', historicalData);
    
    if (!historicalData || historicalData.length === 0) {
      // Show empty state
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      return;
    }

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

  // Show loading or empty state if no data
  if (!historicalData || historicalData.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="text-center">
          <div className="text-gray-400 mb-2 text-3xl">📊</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Loading chart for {baseCurrency}/{targetCurrency}...
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Data length: {historicalData?.length || 0}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <canvas ref={chartRef} />
    </div>
  );
}
