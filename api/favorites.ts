// api/favorites.ts - CORREGIDO
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Storage compartido usando global object
const STORAGE_KEY = 'CONVERT_SCOPE_FAVORITES';

function getFavorites(): any[] {
  if (typeof global !== 'undefined') {
    return (global as any)[STORAGE_KEY] || [];
  }
  return [];
}

function setFavorites(favorites: any[]): void {
  if (typeof global !== 'undefined') {
    (global as any)[STORAGE_KEY] = favorites;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enhanced CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const favorites = getFavorites();

    switch (req.method) {
      case 'GET': {
        console.log(`Returning ${favorites.length} favorites`);
        res.status(200).json(favorites);
        break;
      }
        
      case 'POST': {
        if (!req.body) {
          res.status(400).json({ error: 'Request body is required' });
          return;
        }

        const { fromUnit, toUnit, category, name } = req.body;
        
        if (!fromUnit || !toUnit || !category) {
          res.status(400).json({ 
            error: 'Missing required fields: fromUnit, toUnit, category' 
          });
          return;
        }

        // Check for duplicates
        const exists = favorites.some(fav => 
          fav.fromUnit === fromUnit && 
          fav.toUnit === toUnit && 
          fav.category === category
        );
        
        if (exists) {
          res.status(409).json({ error: 'Favorite already exists' });
          return;
        }

        const newFavorite = {
          id: Date.now().toString(),
          fromUnit: fromUnit.toString(),
          toUnit: toUnit.toString(),
          category: category.toString(),
          name: name ? name.toString() : `${fromUnit} → ${toUnit}`,
          createdAt: new Date().toISOString(),
          timestamp: Date.now()
        };
        
        favorites.push(newFavorite);
        
        // Mantener solo los últimos 50 favoritos
        if (favorites.length > 50) {
          favorites.splice(0, favorites.length - 50);
        }
        
        setFavorites(favorites);
        
        console.log(`Added favorite: ${fromUnit} → ${toUnit} (${category})`);
        res.status(201).json(newFavorite);
        break;
      }
        
      case 'DELETE': {
        // Manejar tanto /api/favorites?id=123 como /api/favorites/123
        const id = req.query.id || req.url?.split('/').pop();
        
        if (!id) {
          res.status(400).json({ error: 'Favorite ID is required' });
          return;
        }

        const initialLength = favorites.length;
        const updatedFavorites = favorites.filter(fav => fav.id !== id.toString());
        
        if (updatedFavorites.length === initialLength) {
          res.status(404).json({ error: 'Favorite not found' });
          return;
        }

        setFavorites(updatedFavorites);
        
        console.log(`Removed favorite with ID: ${id}`);
        res.status(200).json({ success: true, removedId: id });
        break;
      }
        
      default:
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Favorites API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}