import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage for demo
let conversions: any[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
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
    const limit = parseInt(req.query.limit as string) || 10;
    const recent = conversions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    res.status(200).json(recent);
  } catch (error) {
    console.error('Get conversions error:', error);
    res.status(500).json({ error: 'Unable to fetch conversions' });
  }
}