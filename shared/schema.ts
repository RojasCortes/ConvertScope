import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const conversions = pgTable("conversions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  fromUnit: text("from_unit").notNull(),
  toUnit: text("to_unit").notNull(),
  fromValue: decimal("from_value", { precision: 20, scale: 8 }).notNull(),
  toValue: decimal("to_value", { precision: 20, scale: 8 }).notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  fromUnit: text("from_unit").notNull(),
  toUnit: text("to_unit").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const currencyRates = pgTable("currency_rates", {
  id: serial("id").primaryKey(),
  baseCurrency: text("base_currency").notNull(),
  targetCurrency: text("target_currency").notNull(),
  rate: decimal("rate", { precision: 20, scale: 8 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertConversionSchema = createInsertSchema(conversions).pick({
  fromUnit: true,
  toUnit: true,
  fromValue: true,
  toValue: true,
  category: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  fromUnit: true,
  toUnit: true,
  category: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertConversion = z.infer<typeof insertConversionSchema>;
export type Conversion = typeof conversions.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type CurrencyRate = typeof currencyRates.$inferSelect;
