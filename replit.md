# Overview

This is a form builder application that allows users to create and customize forms through a drag-and-drop interface. The application provides a visual form designer where users can add various field types (text inputs, checkboxes, dropdowns, etc.), configure their properties, and preview the final form. It's built as a full-stack application with a React frontend and Express backend, using PostgreSQL for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React and TypeScript, using a component-based architecture with shadcn/ui for the design system. The application uses:

- **Vite** as the build tool and development server
- **TailwindCSS** for styling with custom CSS variables for theming
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query** for server state management and API data fetching
- **React Hook Form** with Zod resolvers for form validation

The main components are organized into:
- Form builder interface with drag-and-drop functionality
- Component palette for available form field types
- Properties panel for field configuration
- Live preview modal for testing forms
- Reusable UI components from shadcn/ui

## Backend Architecture
The server is built with Express.js and TypeScript, following a RESTful API design:

- **Express.js** handles HTTP requests and middleware
- **Drizzle ORM** with PostgreSQL for database operations
- **Zod** for request/response validation and type safety
- **Memory storage fallback** for development/testing without database

The API provides endpoints for:
- CRUD operations on forms (`/api/forms`)
- Form submission handling
- User management (placeholder implementation)

## Data Storage
- **PostgreSQL** as the primary database with Neon serverless hosting
- **Drizzle ORM** for type-safe database queries and migrations
- **JSON fields** for storing dynamic form field configurations
- **Memory storage** as a fallback implementation for development

## Form Field Schema
The application uses a flexible schema for form fields that supports:
- Multiple field types (text, email, select, radio, checkbox, etc.)
- Configurable properties (validation, styling, layout)
- Dynamic options for select/radio fields
- Responsive width settings (full, half, quarter)

## Development Setup
- **Hot module replacement** via Vite in development
- **ESBuild** for production builds
- **TypeScript** with strict type checking
- **Path aliases** for clean imports (@/, @shared/, etc.)
- **Concurrent development** with both frontend and backend

# External Dependencies

## Database & ORM
- **@neondatabase/serverless** - Serverless PostgreSQL database hosting
- **drizzle-orm** - Type-safe ORM for database operations  
- **drizzle-kit** - Database migrations and schema management
- **connect-pg-simple** - PostgreSQL session store for Express

## Frontend UI & State
- **@radix-ui** components - Headless UI primitives for accessibility
- **@tanstack/react-query** - Server state management and caching
- **wouter** - Lightweight client-side routing
- **react-hook-form** with **@hookform/resolvers** - Form handling and validation

## Styling & Design
- **tailwindcss** - Utility-first CSS framework
- **class-variance-authority** - Type-safe component variants
- **clsx** and **tailwind-merge** - Conditional CSS class utilities
- **lucide-react** - Icon library

## Development Tools
- **vite** - Build tool and development server
- **@vitejs/plugin-react** - React support for Vite
- **typescript** - Type safety and developer experience
- **@replit/vite-plugin-runtime-error-modal** - Error handling in development

## Validation & Utilities
- **zod** - Schema validation for forms and API
- **drizzle-zod** - Integration between Drizzle ORM and Zod
- **date-fns** - Date manipulation utilities
- **nanoid** - Unique ID generation