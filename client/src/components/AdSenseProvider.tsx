import { useEffect, createContext, useContext } from 'react';
import { useAdSense } from '@/hooks/useAdSense';

const AdSenseContext = createContext<{
  isAdSenseLoaded: boolean;
  isAdSenseEnabled: boolean;
  clientId?: string;
  refreshAds: () => void;
}>({
  isAdSenseLoaded: false,
  isAdSenseEnabled: false,
  clientId: undefined,
  refreshAds: () => {},
});

export function AdSenseProvider({ children }: { children: React.ReactNode }) {
  const adSenseState = useAdSense();

  return (
    <AdSenseContext.Provider value={adSenseState}>
      {children}
    </AdSenseContext.Provider>
  );
}

export const useAdSenseContext = () => useContext(AdSenseContext);