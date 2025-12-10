# Blue Ocean Paracas - Project Context

## 1. Technology Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: Sonner
- **Authentication**: Supabase Auth

## 2. Database Schema (`public` schema)

### `tours`
- `id` (int8)
- `slug` (text) - Unique identifier for URLs
- `title` (text)
- `category` (text) - 'Tour' | 'Alquiler'
- `short_description` (text)
- `long_description` (text)
- `price` (text)
- `image_url` (text)
- `duration` (text)
- `group_size` (text, nullable)
- `schedule` (text, nullable)
- `itinerary` (jsonb, nullable) - `{ title: string, items: string[] }`
- `details` (jsonb, nullable) - `{ title: string, items: string[] }`

### `gallery`
- `id` (int8)
- `title` (text)
- `category` (text) - 'Islas' | 'Reserva' | 'Desierto' | 'Aventura'
- `image_url` (text)
- `width` (int4, nullable)
- `height` (int4, nullable)

### `testimonials`
- `id` (int8)
- `name` (text)
- `location` (text)
- `rating` (int4)
- `content` (text)
- `is_approved` (bool) - Moderation flag

### `profiles` (User Roles)
- `id` (uuid) - References auth.users
- `email` (text)
- `role` (text) - 'admin' | 'worker'

### `clients` (CRM)
- `id` (uuid)
- `full_name` (text)
- `email` (text)
- `phone` (text, nullable)
- `document_type` (text, nullable) - 'DNI' | 'CE' | 'PASAPORTE'
- `document_number` (text, nullable)
- `country` (text, nullable)
- `notes` (text, nullable)
- `source` (text) - 'manual' for admin entries

### `settings` (Global Config)
- `id` (int8) - Single row (ID=1)
- `whatsapp_primary` (text, nullable)
- `contact_email` (text, nullable)
- `is_maintenance_mode` (bool)

## 3. Key Features & Modules

### Admin Dashboard (`/admin`)
- **Role-Based Access**:
  - `admin`: Full access (Users, Settings, all modules).
  - `worker`: Limited access (Clients, Tours, Gallery, Testimonials).
- **Sidebar**: Dynamic navigation based on role.

### Modules
1.  **Tours Manager**: CRUD for tours and rentals.
2.  **Gallery Manager**: Upload/Delete images with category filtering.
3.  **Testimonials**: Approve/Delete user reviews.
4.  **CRM (Clients)**:
    - List view with search (Name, Email, Document).
    - Create/Edit Client (Modal form).
    - Supports Document Type/Number.
5.  **User Management**: create/disable system users (Admin only).
6.  **Global Settings**:
    - Manage WhatsApp number and Contact Email.
    - Protected "Empresa" tab (Admin only).

## 4. Code Structure
- `src/app/admin/actions.ts`: Server Actions for CRM and Settings.
- `src/app/admin/users/actions.ts`: Server Actions for User Management.
- `src/types/database.ts`: TypeScript definitions for Supabase tables.
- `src/components/admin`: Client components (Forms, Tables, Modals).
- `src/utils/supabase`: Client/Server Supabase utilities.
