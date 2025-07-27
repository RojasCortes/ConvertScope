import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { params } = req.query;
    const [base, target, period] = Array.isArray(params) ? params : [params];
    
    if (!base || !target || !period) {
      res.status(400).json({ error: 'Missing required parameters: base, target, period' });
      return;
    }

    // Generate mock historical data based on currency pair
    const days = period === "7d" ? 7 : period === "1w" ? 7 : period === "1m" ? 30 : period === "1y" ? 365 : period === "5y" ? 1825 : 7;
    
    // Get realistic base rate for common pairs
    let baseRate = 1;
    const pair = `${base}/${target}`;
    const rateMap: Record<string, number> = {
      'USD/EUR': 0.85,
      'EUR/USD': 1.18,
      'USD/GBP': 0.73,
      'GBP/USD': 1.37,
      'USD/JPY': 110.0,
      'JPY/USD': 0.009,
      'USD/CAD': 1.25,
      'CAD/USD': 0.80,
      'EUR/GBP': 0.86,
      'GBP/EUR': 1.16
    };
    
    baseRate = rateMap[pair] || 1;
    
    const historicalData = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic fluctuation (±3% from base rate)
      const fluctuation = (Math.random() - 0.5) * 0.06;
      const rate = baseRate * (1 + fluctuation);
      
      historicalData.push({
        date: date.toISOString().split('T')[0],
        rate: rate.toFixed(6)
      });
    }
    
    console.log(`Sending historical data for ${base}/${target} (${period}):`, historicalData.length, 'items');
    res.status(200).json(historicalData);
  } catch (error) {
    console.error('Historical data error:', error);
    res.status(500).json({ error: 'Unable to fetch historical data' });
  }
}