import { useTranslation } from '@/hooks/useTranslation';

interface AdSpaceProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function AdSpace({ className = '', size = 'medium' }: AdSpaceProps) {
  const { t } = useTranslation();
  
  const sizeClasses = {
    small: 'h-20',
    medium: 'h-24',
    large: 'h-32',
  };

  return (
    <div className={`mx-4 mb-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center ${sizeClasses[size]} ${className}`}>
      <div className="text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center justify-center h-full">
        <div className="text-2xl mb-2">📢</div>
        <p>{t('ads.space')}</p>
        {/* Google AdSense code would go here */}
        {/* <ins className="adsbygoogle" ... /> */}
      </div>
    </div>
  );
}
