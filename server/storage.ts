import { 
  users, conversions, favorites, currencyRates,
  type User, type InsertUser, 
  type Conversion, type InsertConversion,
  type Favorite, type InsertFavorite,
  type CurrencyRate
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  saveConversion(conversion: InsertConversion & { userId?: number }): Promise<Conversion>;
  getRecentConversions(userId?: number, limit?: number): Promise<Conversion[]>;
  
  addFavorite(favorite: InsertFavorite & { userId?: number }): Promise<Favorite>;
  removeFavorite(id: number): Promise<void>;
  getFavorites(userId?: number): Promise<Favorite[]>;
  
  saveCurrencyRate(baseCurrency: string, targetCurrency: string, rate: number): Promise<CurrencyRate>;
  getCurrencyRate(baseCurrency: string, targetCurrency: string): Promise<CurrencyRate | undefined>;
  getLatestCurrencyRates(): Promise<CurrencyRate[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversions: Map<number, Conversion>;
  private favorites: Map<number, Favorite>;
  private currencyRates: Map<string, CurrencyRate>;
  private currentUserId: number;
  private currentConversionId: number;
  private currentFavoriteId: number;
  private currentRateId: number;

  constructor() {
    this.users = new Map();
    this.conversions = new Map();
    this.favorites = new Map();
    this.currencyRates = new Map();
    this.currentUserId = 1;
    this.currentConversionId = 1;
    this.currentFavoriteId = 1;
    this.currentRateId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveConversion(conversion: InsertConversion & { userId?: number }): Promise<Conversion> {
    const id = this.currentConversionId++;
    const newConversion: Conversion = {
      ...conversion,
      id,
      userId: conversion.userId || null,
      createdAt: new Date(),
    };
    this.conversions.set(id, newConversion);
    return newConversion;
  }

  async getRecentConversions(userId?: number, limit = 10): Promise<Conversion[]> {
    const allConversions = Array.from(this.conversions.values())
      .filter(conv => !userId || conv.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
    return allConversions;
  }

  async addFavorite(favorite: InsertFavorite & { userId?: number }): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const newFavorite: Favorite = {
      ...favorite,
      id,
      userId: favorite.userId || null,
      createdAt: new Date(),
    };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }

  async removeFavorite(id: number): Promise<void> {
    this.favorites.delete(id);
  }

  async getFavorites(userId?: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values())
      .filter(fav => !userId || fav.userId === userId);
  }

  async saveCurrencyRate(baseCurrency: string, targetCurrency: string, rate: number): Promise<CurrencyRate> {
    const id = this.currentRateId++;
    const key = `${baseCurrency}_${targetCurrency}`;
    const currencyRate: CurrencyRate = {
      id,
      baseCurrency,
      targetCurrency,
      rate: rate.toString(),
      timestamp: new Date(),
    };
    this.currencyRates.set(key, currencyRate);
    return currencyRate;
  }

  async getCurrencyRate(baseCurrency: string, targetCurrency: string): Promise<CurrencyRate | undefined> {
    const key = `${baseCurrency}_${targetCurrency}`;
    return this.currencyRates.get(key);
  }

  async getLatestCurrencyRates(): Promise<CurrencyRate[]> {
    return Array.from(this.currencyRates.values())
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }
}

export const storage = new MemStorage();
