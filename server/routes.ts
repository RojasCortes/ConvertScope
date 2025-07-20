import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversionSchema, insertFavoriteSchema } from "@shared/schema";
import axios from "axios";

// Cache for exchange rates
let exchangeRatesCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get exchange rates from API
  app.get("/api/exchange-rates", async (req, res) => {
    try {
      const now = Date.now();
      
      // Return cached data if still valid
      if (exchangeRatesCache && (now - lastFetchTime) < CACHE_DURATION) {
        return res.json(exchangeRatesCache);
      }

      // Fetch from free API (exchangerate-api.com)
      const API_KEY = process.env.EXCHANGE_API_KEY || "demo_key";
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
      
      if (response.data && response.data.rates) {
        exchangeRatesCache = {
          base: "USD",
          rates: response.data.rates,
          timestamp: now
        };
        lastFetchTime = now;

        // Save rates to storage
        for (const [currency, rate] of Object.entries(response.data.rates)) {
          await storage.saveCurrencyRate("USD", currency, Number(rate));
        }

        res.json(exchangeRatesCache);
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      console.error("Exchange rate API error:", error);
      
      // Fallback to stored rates
      const storedRates = await storage.getLatestCurrencyRates();
      if (storedRates.length > 0) {
        const ratesObject = storedRates.reduce((acc, rate) => {
          acc[rate.targetCurrency] = parseFloat(rate.rate);
          return acc;
        }, {} as any);
        
        res.json({
          base: "USD",
          rates: ratesObject,
          timestamp: Date.now(),
          fallback: true
        });
      } else {
        res.status(500).json({ error: "Unable to fetch exchange rates" });
      }
    }
  });

  // Get historical currency data (simplified)
  app.get("/api/currency-history/:base/:target", async (req, res) => {
    const { base, target } = req.params;
    const { period = "7d" } = req.query;
    
    try {
      // For demo purposes, generate mock historical data
      // In production, use a real API like Alpha Vantage or similar
      const days = period === "7d" ? 7 : period === "1w" ? 7 : period === "1m" ? 30 : period === "1y" ? 365 : period === "5y" ? 1825 : 7;
      const currentRate = await storage.getCurrencyRate(base, target);
      const baseRate = currentRate ? parseFloat(currentRate.rate) : 1;
      
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
      
      console.log(`Sending historical data for ${base}/${target} (${period}):`, historicalData.length, 'items');
      res.json(historicalData);
    } catch (error) {
      console.error("Historical data error:", error);
      res.status(500).json({ error: "Unable to fetch historical data" });
    }
  });

  // Save conversion
  app.post("/api/conversions", async (req, res) => {
    try {
      const conversion = insertConversionSchema.parse(req.body);
      const saved = await storage.saveConversion(conversion);
      res.json(saved);
    } catch (error) {
      console.error("Save conversion error:", error);
      res.status(400).json({ error: "Invalid conversion data" });
    }
  });

  // Get recent conversions
  app.get("/api/conversions/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const conversions = await storage.getRecentConversions(undefined, limit);
      res.json(conversions);
    } catch (error) {
      console.error("Get conversions error:", error);
      res.status(500).json({ error: "Unable to fetch conversions" });
    }
  });

  // Add favorite
  app.post("/api/favorites", async (req, res) => {
    try {
      const favorite = insertFavoriteSchema.parse(req.body);
      
      // Check for existing favorite to prevent duplicates
      const existingFavorites = await storage.getFavorites();
      const exists = existingFavorites.some(fav => 
        fav.fromUnit === favorite.fromUnit && 
        fav.toUnit === favorite.toUnit && 
        fav.category === favorite.category
      );
      
      if (exists) {
        return res.status(409).json({ error: "Favorite already exists" });
      }
      
      const saved = await storage.addFavorite(favorite);
      res.json(saved);
    } catch (error) {
      console.error("Add favorite error:", error);
      res.status(400).json({ error: "Invalid favorite data" });
    }
  });

  // Get favorites
  app.get("/api/favorites", async (req, res) => {
    try {
      const favorites = await storage.getFavorites();
      res.json(favorites);
    } catch (error) {
      console.error("Get favorites error:", error);
      res.status(500).json({ error: "Unable to fetch favorites" });
    }
  });

  // Remove favorite
  app.delete("/api/favorites/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeFavorite(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Remove favorite error:", error);
      res.status(500).json({ error: "Unable to remove favorite" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
