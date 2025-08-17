# Employee Management System

## Overview

This is a full-stack employee management system built with React, Express, and PostgreSQL. The application features a modern, responsive interface for managing employee records with full CRUD operations. It uses Drizzle ORM for database interactions and shadcn/ui components for a polished user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the client-side application
- **Vite** as the build tool and development server
- **shadcn/ui** component library built on Radix UI primitives
- **TailwindCSS** for styling with CSS variables for theming
- **TanStack Query** for server state management and data fetching
- **Wouter** for lightweight client-side routing
- **React Hook Form** with Zod validation for form handling

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with structured error handling
- **Middleware** for request logging and JSON parsing
- **Memory storage** implementation with sample data for development
- **Zod schemas** for request validation shared between client and server

### Data Storage
- **Drizzle ORM** configured for PostgreSQL with schema-first approach
- **Neon Database** as the PostgreSQL provider
- **Database migrations** managed through Drizzle Kit
- **Shared schema** definitions between frontend and backend using TypeScript

### Component Architecture
- **Compound component patterns** for complex UI elements like DataTable
- **Custom hooks** for mobile detection and toast notifications
- **Responsive design** with mobile-first approach
- **Accessible components** using Radix UI primitives

### Development Setup
- **Monorepo structure** with shared types and schemas
- **Path aliases** configured for clean imports
- **Development server** with hot reload and error overlay
- **TypeScript** strict mode enabled across the entire codebase

## External Dependencies

### Database & ORM
- **@neondatabase/serverless** - Serverless PostgreSQL driver for Neon
- **drizzle-orm** - TypeScript ORM with excellent type safety
- **drizzle-kit** - Database migration and introspection tools

### UI & Styling
- **@radix-ui/react-*** - Accessible, unstyled UI primitives
- **tailwindcss** - Utility-first CSS framework
- **class-variance-authority** - Type-safe component variants
- **lucide-react** - Modern icon library

### State Management & Data Fetching
- **@tanstack/react-query** - Powerful data synchronization for React
- **react-hook-form** - Performant forms with easy validation
- **@hookform/resolvers** - Validation resolvers for React Hook Form

### Development Tools
- **vite** - Fast build tool and development server
- **tsx** - TypeScript execution environment for Node.js
- **esbuild** - Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal** - Development error handling

### Validation & Utilities
- **zod** - TypeScript-first schema validation
- **date-fns** - Modern JavaScript date utility library
- **clsx** & **tailwind-merge** - Utility functions for conditional classes