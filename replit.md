# ConvertScope - Universal Converter

## Overview

ConvertScope is a Progressive Web Application (PWA) built as a universal converter for currencies, measurements, and various units. The application provides real-time currency conversion with exchange rates, unit conversions for length, weight, temperature, and more, along with user favorites and conversion history functionality.

## User Preferences

Preferred communication style: Simple, everyday language.
Project documentation: User requested comprehensive architecture diagram and technology stack information - documented in ARQUITECTURA_TECNOLOGIAS.md
Capacitor APK: User confirmed they use Capacitor to generate APK on their PC - functionality preserved and documented in CAPACITOR_APK_GUIDE.md

## Recent Changes (January 2025)

✓ Fixed dark mode implementation - now properly toggles theme classes
✓ Added "More" section with additional features and app information  
✓ Added favorite buttons to currency and category converters
✓ Hidden notifications setting (not essential for current version)
✓ Corrected TypeScript type errors in components
✓ Improved bottom navigation with proper view routing
✓ Prepared application for Vercel deployment with configuration files
✓ Created serverless function entry point for Vercel hosting
✓ Added comprehensive deployment documentation
✓ Successfully deployed to Vercel at https://convert-scope.vercel.app
✓ Fixed build configuration for proper static site deployment
✓ Application fully functional with all features working correctly

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Radix UI components with custom styling
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: Zustand for global state management
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **PWA Features**: Service worker for offline functionality and app installation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Pattern**: RESTful API with TypeScript
- **Development**: Vite for development server and hot module replacement
- **Build System**: ESBuild for production builds

### Data Storage Solutions
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Fallback Storage**: In-memory storage implementation for development
- **Session Management**: PostgreSQL session store with connect-pg-simple

## Key Components

### Frontend Components
1. **Layout System**: Header with navigation, bottom navigation bar, and responsive design
2. **Converter Components**: Specialized converters for currencies and general units
3. **UI Components**: Comprehensive component library based on Radix UI primitives
4. **PWA Components**: Service worker registration, offline support, and install prompts
5. **Internationalization**: Multi-language support (Spanish/English) with custom translation hook

### Backend Components
1. **API Routes**: Currency exchange rates, conversion history, and favorites management
2. **Storage Layer**: Abstracted storage interface with PostgreSQL and in-memory implementations
3. **External Integrations**: Exchange rate API integration with caching mechanism
4. **Error Handling**: Centralized error handling with proper HTTP status codes

### Database Schema
- **Users**: User account management
- **Conversions**: Conversion history tracking
- **Favorites**: User favorite conversion pairs
- **Currency Rates**: Cached exchange rate data

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query
2. **API Processing**: Express routes handle requests and interact with storage layer
3. **Data Persistence**: Drizzle ORM manages database operations
4. **Cache Management**: Exchange rates cached for 5 minutes, with fallback to stored rates
5. **Real-time Updates**: Query invalidation ensures fresh data after mutations
6. **Offline Support**: Service worker caches static assets and API responses

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **axios**: HTTP client for external API calls
- **chart.js**: Charting library for currency historical data

### UI Dependencies
- **@radix-ui/\***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe variant management for components

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety across the application
- **tsx**: TypeScript execution for server-side development

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Database Setup**: Drizzle migrations handle schema updates

### Environment Configuration
- **Development**: Uses Vite dev server with Express backend
- **Production**: Serves static files from Express with API routes
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection
- **Exchange API**: Optional `EXCHANGE_API_KEY` for enhanced rate limits

### Replit-Specific Features
- **Hot Reloading**: Vite integration with Replit's development environment
- **Error Overlay**: Runtime error modal for development
- **Cartographer Plugin**: Replit-specific development tooling

### Vercel Deployment Configuration
- **vercel.json**: Configured for serverless functions and static hosting
- **api/index.ts**: Serverless function entry point for API routes
- **.vercelignore**: Optimized file exclusions for deployment
- **Build Process**: Automated via npm run build command
- **Environment Variables**: NODE_ENV, optional DATABASE_URL and EXCHANGE_API_KEY

### PWA Deployment
- **Service Worker**: Caches static assets and API responses for offline functionality
- **Web App Manifest**: Configures app metadata for installation
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces
- **Production Ready**: Optimized for Vercel's CDN and serverless architecture

The application follows a modern full-stack architecture with strong TypeScript support, comprehensive error handling, PWA capabilities, and is fully prepared for cloud deployment on Vercel with automatic scaling and global CDN distribution.