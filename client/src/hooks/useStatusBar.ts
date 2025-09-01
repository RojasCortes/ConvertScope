import { useEffect } from 'react';

export const useStatusBar = () => {
  useEffect(() => {
    // Status bar configuration for web - just set document title
    document.title = 'ConvertScope - Universal Converter';
  }, []);
};