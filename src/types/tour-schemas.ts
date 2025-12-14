
import { z } from 'zod';

// Reuse JSON structure schemas
export const TourItinerarySchema = z.object({
    title: z.string().default('Itinerario'),
    items: z.array(z.string()).default([]),
    icon: z.string().optional()
}).nullable().optional();

export const TourDetailsSchema = z.object({
    title: z.string().default('Incluye'),
    items: z.array(z.string()).default([]),
    icon: z.string().optional()
}).nullable().optional();

// Base Schema matching Database fields but with better typing
// Price is stored as string in DB but we might want to validate it looks like a price or number
export const TourSchema = z.object({
    id: z.string().optional(), // DB uses string (UUID or similar)

    slug: z.string().min(1, 'El slug es obligatorio'),
    title: z.string().min(1, 'El título es obligatorio'),
    category: z.string().default('Tour'),
    short_description: z.string().min(1, 'La descripción corta es obligatoria'),
    long_description: z.string().optional(),

    // DB stores price as string 'S/ 100'. We validate it's a string. 
    // Ideally we would migrate this column to numeric, but for now we enforce string format.
    price: z.string(),

    // We relax URL validation but require non-empty string
    image_url: z.string().min(1, 'La URL de imagen es obligatoria'),
    duration: z.string().optional(),
    group_size: z.string().nullable().optional(),
    schedule: z.string().nullable().optional(),

    itinerary: TourItinerarySchema,
    details: TourDetailsSchema,

    created_at: z.string().optional()
});

// Infer Types from Zod
export type Tour = z.infer<typeof TourSchema>;
export type TourItinerary = z.infer<typeof TourItinerarySchema>;
export type TourDetails = z.infer<typeof TourDetailsSchema>;

// Form Schema for Admin Actions (Client Side Validation)
export const TourFormSchema = TourSchema.extend({
    price: z.union([z.string(), z.number()]).transform((val) => String(val)), // Allow number input, convert to string for DB
    image: z.any().optional(), // Pending file object validation
});
