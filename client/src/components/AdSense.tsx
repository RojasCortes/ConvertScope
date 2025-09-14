import { useEffect } from 'react';

interface AdSenseProps {
  adSlot?: string;
  adFormat?: 'auto' | 'fluid';
  adLayout?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  adLayout,
  className = '',
  style = {}
}: AdSenseProps) {
  const clientId = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID;

  useEffect(() => {
    // Only process if we have client ID and slot
    if (!clientId || !adSlot) {
      return;
    }

    // Push ad configuration after component mounts
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn('AdSense error:', error);
    }
  }, [clientId, adSlot]);

  // Show placeholder if no client ID or slot ID
  if (!clientId || !adSlot) {
    return (
      <div 
        className={`bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center ${className}`}
        style={style}
        data-testid="adsense-placeholder"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          📱 Espacio publicitario
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          AdSense se activará cuando se configure
        </p>
      </div>
    );
  }

  const adStyle = {
    display: 'block',
    ...style
  };

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={adStyle}
      data-ad-client={clientId}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-ad-layout={adLayout}
      data-full-width-responsive="true"
      data-testid="adsense-ad"
    />
  );
}