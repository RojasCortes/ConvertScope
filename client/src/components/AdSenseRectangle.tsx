import { AdSense } from './AdSense';

interface AdSenseRectangleProps {
  className?: string;
  adSlot?: string;
}

export function AdSenseRectangle({ 
  className = 'w-full', 
  adSlot 
}: AdSenseRectangleProps) {
  // Use AdSense web slot ID, not AdMob
  const rectangleSlot = adSlot || import.meta.env.VITE_ADSENSE_SLOT_RECTANGLE;
  
  return (
    <div className={`${className} my-4 flex justify-center`} data-testid="adsense-rectangle-container">
      <AdSense
        adSlot={rectangleSlot}
        adFormat="auto"
        className="max-w-sm"
        style={{ 
          width: '300px', 
          height: '250px',
          minWidth: '300px',
          minHeight: '250px'
        }}
      />
    </div>
  );
}