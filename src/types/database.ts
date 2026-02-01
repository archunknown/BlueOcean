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

export interface Client {
    id: string
    first_name: string
    paternal_surname: string
    maternal_surname: string
    email: string
    phone: string | null
    document_type: string | null // 'DNI' | 'CE' | 'PASAPORTE'
    document_number: string | null
    country: string | null
    notes: string | null
    source: string
    created_at?: string
}

export interface Settings {
    id: number
    whatsapp_primary: string | null
    contact_email: string | null
    is_maintenance_mode: boolean
    hero_video_url: string | null
    yape_qr_url: string | null
    yape_number: string | null
    created_at?: string
}

export interface Database {
    public: {
        Tables: {
            bookings: {
                Row: {
                    id: string
                    tour_id: string
                    tour_title: string
                    tour_date: string
                    pax: number
                    client_name: string
                    client_email: string
                    client_phone: string
                    total_price: string
                    status: string
                    booking_code: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    tour_id: string
                    tour_title: string
                    tour_date: string
                    pax: number
                    client_name: string
                    client_email: string
                    client_phone: string
                    total_price: string
                    status?: string
                    booking_code: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    tour_id?: string
                    tour_title?: string
                    tour_date?: string
                    pax?: number
                    client_name?: string
                    client_email?: string
                    client_phone?: string
                    total_price?: string
                    status?: string
                    booking_code?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "bookings_tour_id_fkey"
                        columns: ["tour_id"]
                        referencedRelation: "tours"
                        referencedColumns: ["id"]
                    }
                ]
            }
            tours: {
                Row: {
                    id: string
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
                    created_at: string
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
                Relationships: []
            }
            gallery: {
                Row: {
                    id: string
                    title: string
                    category: string
                    image_url: string
                    created_at: string
                    width?: number
                    height?: number
                }
                Insert: {
                    id?: string
                    title: string
                    category: string
                    image_url: string
                    created_at?: string
                    width?: number
                    height?: number
                }
                Update: {
                    id?: string
                    title?: string
                    category?: string
                    image_url?: string
                    created_at?: string
                    width?: number
                    height?: number
                }
                Relationships: []
            }
            testimonials: {
                Row: {
                    id: number
                    name: string
                    location: string
                    rating: number
                    content: string
                    is_approved: boolean
                    created_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    location: string
                    rating: number
                    content: string
                    is_approved?: boolean
                    created_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    location?: string
                    rating?: number
                    content?: string
                    is_approved?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    id: string
                    email: string
                    first_name: string | null
                    last_name: string | null
                    dni: string | null
                    role: 'admin' | 'worker'
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    first_name?: string | null
                    last_name?: string | null
                    dni?: string | null
                    role: 'admin' | 'worker'
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    first_name?: string | null
                    last_name?: string | null
                    dni?: string | null
                    role?: 'admin' | 'worker'
                    created_at?: string
                }
                Relationships: []
            }
            clients: {
                Row: {
                    id: string
                    first_name: string
                    paternal_surname: string
                    maternal_surname: string
                    email: string
                    phone: string | null
                    document_type: string | null
                    document_number: string | null
                    country: string | null
                    notes: string | null
                    source: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    first_name: string
                    paternal_surname: string
                    maternal_surname: string
                    email: string
                    phone?: string | null
                    document_type?: string | null
                    document_number?: string | null
                    country?: string | null
                    notes?: string | null
                    source?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    first_name?: string
                    paternal_surname?: string
                    maternal_surname?: string
                    email?: string
                    phone?: string | null
                    document_type?: string | null
                    document_number?: string | null
                    country?: string | null
                    notes?: string | null
                    source?: string
                    created_at?: string
                }
                Relationships: []
            }
            settings: {
                Row: {
                    id: number
                    whatsapp_primary: string | null
                    contact_email: string | null
                    is_maintenance_mode: boolean
                    hero_video_url: string | null
                    yape_qr_url: string | null
                    yape_number: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    whatsapp_primary?: string | null
                    contact_email?: string | null
                    is_maintenance_mode?: boolean
                    hero_video_url?: string | null
                    yape_qr_url?: string | null
                    yape_number?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    whatsapp_primary?: string | null
                    contact_email?: string | null
                    is_maintenance_mode?: boolean
                    hero_video_url?: string | null
                    yape_qr_url?: string | null
                    yape_number?: string | null
                    created_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
