export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface TourItinerary {
    title: string;
    items: string[];
}

export interface TourDetails {
    title: string;
    items: string[];
}

export interface Database {
    public: {
        Tables: {
            tours: {
                Row: {
                    id: number
                    slug: string
                    title: string
                    category: string // 'Tour' | 'Alquiler'
                    short_description: string
                    long_description: string
                    price: string
                    image_url: string
                    duration: string
                    group_size: string | null
                    schedule: string | null
                    itinerary: Json | null
                    details: Json | null
                    created_at?: string
                }
                Insert: {
                    id?: number
                    slug: string
                    title: string
                    category: string
                    short_description: string
                    long_description: string
                    price: string
                    image_url: string
                    duration: string
                    group_size?: string | null
                    schedule?: string | null
                    itinerary?: Json | null
                    details?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    slug?: string
                    title?: string
                    category?: string
                    short_description?: string
                    long_description?: string
                    price?: string
                    image_url?: string
                    duration?: string
                    group_size?: string | null
                    schedule?: string | null
                    itinerary?: Json | null
                    details?: Json | null
                    created_at?: string
                }
            }
            gallery: {
                Row: {
                    id: number
                    title: string
                    category: string // 'Islas' | 'Reserva' | 'Desierto' | 'Aventura'
                    image_url: string
                    created_at?: string
                    width?: number
                    height?: number
                }
                Insert: {
                    id?: number
                    title: string
                    category: string
                    image_url: string
                    created_at?: string
                    width?: number
                    height?: number
                }
                Update: {
                    id?: number
                    title?: string
                    category?: string
                    image_url?: string
                    created_at?: string
                    width?: number
                    height?: number
                }
            }
        }
    }
}
