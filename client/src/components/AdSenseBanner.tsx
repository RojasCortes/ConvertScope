import { AdSense } from './AdSense';

interface AdSenseBannerProps {
  className?: string;
  adSlot?: string;
}

export function AdSenseBanner({ 
  className = 'w-full h-24', 
  adSlot 
}: AdSenseBannerProps) {
  // Use AdSense web slot ID, not AdMob
  const bannerSlot = adSlot || import.meta.env.VITE_ADSENSE_SLOT_BANNER;
  
  return (
    <div className={`${className} my-4`} data-testid="adsense-banner-container">
      <AdSense
        adSlot={bannerSlot}
        adFormat="auto"
        className="w-full h-full"
        style={{ minHeight: '90px' }}
      />
    </div>
  );
}