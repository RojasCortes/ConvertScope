import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage for demo
let conversions: any[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        const limit = parseInt(req.query.limit as string) || 10;
        const recent = conversions
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
        res.status(200).json(recent);
        break;
        
      case 'POST':
        const newConversion = {
          id: Date.now(),
          ...req.body,
          createdAt: new Date().toISOString()
        };
        
        conversions.push(newConversion);
        res.status(201).json(newConversion);
        break;
        
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Conversions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}