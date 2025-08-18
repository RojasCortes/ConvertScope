import { Capacitor } from '@capacitor/core';
import { useEffect, useState } from 'react';

export const useNativePlatform = () => {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<'web' | 'android' | 'ios'>('web');

  useEffect(() => {
    const native = Capacitor.isNativePlatform();
    const currentPlatform = Capacitor.getPlatform();
    
    setIsNative(native);
    setPlatform(currentPlatform as 'web' | 'android' | 'ios');
    
    // Agregar clase CSS al body para targeting específico
    if (native) {
      document.body.classList.add(`capacitor-${currentPlatform}`);
    }
  }, []);

  return { 
    isNative, 
    platform, 
    isAndroid: platform === 'android',
    isIOS: platform === 'ios',
    isWeb: platform === 'web'
  };
};