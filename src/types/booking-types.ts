
import { Database } from './database'

export type Booking = Database['public']['Tables']['bookings']['Row']
export type Client = Database['public']['Tables']['clients']['Row']

export interface BookingWithClient extends Booking {
    clients: Client | null
}
