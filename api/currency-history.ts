// api/currency-history.ts - SIN ERRORES TYPESCRIPT
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface HistoricalDataPoint {
  date: string;
  rate: string;
  timestamp: number;
}

interface HistoricalResponse {
  base: string;
  target: string;
  period: string;
  data: HistoricalDataPoint[];
  generated: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enhanced CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Manejar tanto query params como path params
    let { base, target, period } = req.query;
    
    // Si no hay query params, intentar extraer del path
    if (!base || !target || !period) {
      const urlPath = req.url?.split('?')[0] || '';
      const pathParts = urlPath.split('/').filter(Boolean);
      
      // Buscar patrón /api/currency-history/BASE/TARGET/PERIOD
      const historyIndex = pathParts.findIndex(part => part === 'currency-history');
      if (historyIndex !== -1 && pathParts.length >= historyIndex + 4) {
        base = pathParts[historyIndex + 1];
        target = pathParts[historyIndex + 2];
        period = pathParts[historyIndex + 3];
      }
    }
    
    console.log(`Currency history request: ${base}/${target}/${period}`);
    console.log(`Full URL: ${req.url}`);
    console.log(`Query params:`, req.query);
    
    if (!base || !target || !period) {
      res.status(400).json({ 
        error: 'Missing required parameters: base, target, period',
        received: { base, target, period },
        url: req.url
      });
      return;
    }

    // Normalizar parámetros
    const baseCurrency = (base as string).toUpperCase();
    const targetCurrency = (target as string).toUpperCase();
    const timePeriod = period as string;

    // Determinar número de días basado en el período
    const periodMap: { [key: string]: number } = {
      '7d': 7,
      '1w': 7,
      '1m': 30,
      '3m': 90,
      '6m': 180,
      '1y': 365,
      '5y': 1825
    };

    const days = periodMap[timePeriod] || 7;

    // Obtener tasa base realista para pares comunes
    const pair = `${baseCurrency}/${targetCurrency}`;
    const rateMap: { [key: string]: number } = {
      // USD pairs
      'USD/EUR': 0.85,
      'USD/GBP': 0.73,
      'USD/JPY': 110.0,
      'USD/CAD': 1.25,
      'USD/AUD': 1.35,
      'USD/CHF': 0.92,
      'USD/CNY': 6.45,
      'USD/MXN': 17.5,
      'USD/BRL': 5.2,
      'USD/COP': 4100.0,
      'USD/ARS': 350.0,
      
      // EUR pairs
      'EUR/USD': 1.18,
      'EUR/GBP': 0.86,
      'EUR/JPY': 129.5,
      'EUR/COP': 4820.0,
      
      // COP pairs (peso colombiano)
      'COP/USD': 0.000244,
      'COP/EUR': 0.000207,
      'COP/GBP': 0.000178,
      
      // Reverse pairs
      'GBP/USD': 1.37,
      'JPY/USD': 0.009,
      'CAD/USD': 0.80,
      'AUD/USD': 0.74,
      'CHF/USD': 1.09,
      'CNY/USD': 0.155,
      'MXN/USD': 0.057,
      'BRL/USD': 0.19,
      
      // Common cross pairs
      'EUR-GBP': 0.86,
      'GBP/EUR': 1.16,
      'EUR-JPY': 129.5,
      'GBP/JPY': 150.8
    };

    let baseRate = rateMap[pair] || 1;
    
    // Si no se encuentra el par directo, intentar el inverso
    if (baseRate === 1 && rateMap[`${targetCurrency}/${baseCurrency}`]) {
      baseRate = 1 / rateMap[`${targetCurrency}/${baseCurrency}`];
    }

    // Generar datos históricos
    const historicalData: HistoricalDataPoint[] = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generar fluctuación realista basada en el período
      const volatility = timePeriod === '7d' || timePeriod === '1w' ? 0.02 : 
                        timePeriod === '1m' ? 0.05 : 
                        timePeriod === '3m' ? 0.08 : 
                        timePeriod === '6m' ? 0.12 : 
                        timePeriod === '1y' ? 0.20 : 0.30;
      
      const fluctuation = (Math.random() - 0.5) * 2 * volatility;
      let rate = baseRate * (1 + fluctuation);
      
      // Asegurar que la tasa sea positiva
      if (rate <= 0) rate = baseRate * 0.5;
      
      historicalData.push({
        date: date.toISOString().split('T')[0],
        rate: rate.toFixed(6),
        timestamp: date.getTime()
      });
    }
    
    console.log(`Generated ${historicalData.length} data points for ${pair} over ${days} days`);
    
    const response: HistoricalResponse = {
      base: baseCurrency,
      target: targetCurrency,
      period: timePeriod,
      data: historicalData,
      generated: new Date().toISOString()
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Currency history error:', error);
    res.status(500).json({ 
      error: 'Unable to fetch historical data',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}