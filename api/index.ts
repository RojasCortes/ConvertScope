// Vercel serverless function entry point
import { registerRoutes } from '../server/routes';
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
registerRoutes(app);

// Export the Express app as a Vercel function
export default app;