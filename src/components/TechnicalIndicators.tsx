import { useTranslation } from '@/hooks/useTranslation';

interface TechnicalIndicatorsProps {
  rsi: number;
  sma: number;
  volatility: 'Low' | 'Medium' | 'High';
}

export function TechnicalIndicators({ rsi, sma, volatility }: TechnicalIndicatorsProps) {
  const { t } = useTranslation();

  const getVolatilityColor = (vol: string) => {
    switch (vol) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-orange-500';
      case 'High': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="mt-4 grid grid-cols-3 gap-4">
      <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400">RSI</p>
        <p className="font-semibold text-gray-900 dark:text-white">{rsi.toFixed(1)}</p>
      </div>
      <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400">SMA(20)</p>
        <p className="font-semibold text-gray-900 dark:text-white">{sma.toFixed(4)}</p>
      </div>
      <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400">{t('currency.volatility')}</p>
        <p className={`font-semibold ${getVolatilityColor(volatility)}`}>{volatility}</p>
      </div>
    </div>
  );
}
