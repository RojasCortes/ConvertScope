// Vercel serverless function entry point
import { registerRoutes } from '../server/routes';
import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
registerRoutes(app);

// Export handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise((resolve) => {
    app(req as any, res as any, () => {
      resolve(undefined);
    });
  });
}