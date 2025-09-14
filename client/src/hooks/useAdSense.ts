import { useEffect, useState } from 'react';

export function useAdSense() {
  const [isAdSenseLoaded, setIsAdSenseLoaded] = useState(false);
  const [isAdSenseEnabled, setIsAdSenseEnabled] = useState(false);
  
  const clientId = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID;

  useEffect(() => {
    setIsAdSenseEnabled(!!clientId);

    if (!clientId) {
      console.log('🔧 AdSense no configurado - usando placeholders');
      return;
    }

    // Check if AdSense script is already loaded by DOM presence
    const existingScript = document.querySelector(`script[src*="${clientId}"]`);
    if (existingScript) {
      setIsAdSenseLoaded(true);
      return;
    }

    // Load AdSense script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      window.adsbygoogle = window.adsbygoogle || [];
      setIsAdSenseLoaded(true);
      console.log('✅ AdSense cargado correctamente');
    };
    
    script.onerror = () => {
      console.warn('❌ Error cargando AdSense');
      setIsAdSenseLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const existingScript = document.querySelector(`script[src*="${clientId}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [clientId]);

  const refreshAds = () => {
    if (window.adsbygoogle && isAdSenseLoaded) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.warn('Error refreshing ads:', error);
      }
    }
  };

  return {
    isAdSenseLoaded,
    isAdSenseEnabled,
    clientId,
    refreshAds
  };
}