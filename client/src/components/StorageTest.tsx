import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function StorageTest() {
  const [status, setStatus] = useState('');
  const [conversions, setConversions] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  const testStorage = async () => {
    try {
      const { localStorageManager } = await import('@/lib/localStorage');
      
      // Test save conversion
      await localStorageManager.saveConversion({
        fromUnit: 'USD',
        toUnit: 'EUR',
        fromValue: 100,
        toValue: 85,
        category: 'currency'
      });
      
      // Test save favorite
      await localStorageManager.addFavorite({
        fromUnit: 'USD',
        toUnit: 'EUR',
        category: 'currency'
      });
      
      // Get data
      const recentConversions = await localStorageManager.getRecentConversions(5);
      const allFavorites = await localStorageManager.getFavorites();
      
      setConversions(recentConversions);
      setFavorites(allFavorites);
      setStatus('✅ Storage working correctly!');
      
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    }
  };

  const clearStorage = async () => {
    try {
      const { localStorageManager } = await import('@/lib/localStorage');
      await localStorageManager.clearAllData();
      setConversions([]);
      setFavorites([]);
      setStatus('🧹 Storage cleared');
    } catch (error) {
      setStatus(`❌ Error clearing: ${error}`);
    }
  };

  return (
    <Card className="m-4">
      <CardContent className="p-4">
        <h3 className="font-bold mb-4">Storage Test</h3>
        
        <div className="space-y-2 mb-4">
          <Button onClick={testStorage} className="mr-2">Test Storage</Button>
          <Button onClick={clearStorage} variant="outline">Clear Storage</Button>
        </div>
        
        <div className="text-sm mb-4">{status}</div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Conversions ({conversions.length})</h4>
            <div className="space-y-1">
              {conversions.map((conv, i) => (
                <div key={i} className="text-xs p-2 bg-gray-100 rounded">
                  {conv.fromValue} {conv.fromUnit} → {conv.toValue} {conv.toUnit}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Favorites ({favorites.length})</h4>
            <div className="space-y-1">
              {favorites.map((fav, i) => (
                <div key={i} className="text-xs p-2 bg-gray-100 rounded">
                  {fav.fromUnit} → {fav.toUnit} ({fav.category})
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}