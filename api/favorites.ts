import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage for demo (in production, use a database)
let favorites: any[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        res.status(200).json(favorites);
        break;
        
      case 'POST':
        const newFavorite = {
          id: Date.now(),
          ...req.body,
          createdAt: new Date().toISOString()
        };
        
        // Check for duplicates
        const exists = favorites.some(fav => 
          fav.fromUnit === newFavorite.fromUnit && 
          fav.toUnit === newFavorite.toUnit && 
          fav.category === newFavorite.category
        );
        
        if (exists) {
          res.status(409).json({ error: 'Favorite already exists' });
          return;
        }
        
        favorites.push(newFavorite);
        res.status(201).json(newFavorite);
        break;
        
      case 'DELETE':
        const { id } = req.query;
        favorites = favorites.filter(fav => fav.id !== parseInt(id as string));
        res.status(200).json({ success: true });
        break;
        
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}