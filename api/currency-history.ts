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
    const { base, target, period } = req.query;
    
    if (!base || !target || !period) {
      res.status(400).json({ error: 'Missing required parameters: base, target, period' });
      return;
    }

    // Generate mock historical data
    const days = period === "7d" ? 7 : period === "1w" ? 7 : period === "1m" ? 30 : period === "1y" ? 365 : period === "5y" ? 1825 : 7;
    const baseRate = 0.85; // Mock base rate for USD/EUR
    
    const historicalData = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic fluctuation (±2% from base rate)
      const fluctuation = (Math.random() - 0.5) * 0.04;
      const rate = baseRate * (1 + fluctuation);
      
      historicalData.push({
        date: date.toISOString().split('T')[0],
        rate: rate.toFixed(6)
      });
    }
    
    res.status(200).json(historicalData);
  } catch (error) {
    console.error('Historical data error:', error);
    res.status(500).json({ error: 'Unable to fetch historical data' });
  }
}