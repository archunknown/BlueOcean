import { z } from 'zod'

export const bookingSchema = z.object({
    clientFirstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    clientPaternalSurname: z.string().min(2, 'El apellido paterno debe tener al menos 2 caracteres'),
    clientMaternalSurname: z.string().min(2, 'El apellido materno debe tener al menos 2 caracteres'),
    clientCountry: z.string().optional(),
    clientDocumentType: z.enum(['DNI', 'CE', 'PASAPORTE'], {
        message: 'Tipo de documento inválido'
    }),
    clientDocumentNumber: z.string().refine((val) => {
        // Validaremos esto con un superRefine o refine condicional si tuvieramos acceso al contexto, 
        // pero como Zod valida campo a campo primariamente, usaremos una validación genérica inicial
        // y luego refinaremos con el objeto completo.
        return val.length >= 6
    }, 'Número de documento inválido'),
    clientPhone: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos'),
    clientEmail: z.string().email('Correo electrónico inválido'),
    pax: z.coerce.number().min(1, 'Debe haber al menos 1 pasajero'),
    tourId: z.string().uuid('ID de tour inválido'),
    tourDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Fecha inválida'),
    tourTime: z.string().min(1, 'La hora es obligatoria') // Validación simple, se puede mejorar con regex HH:mm
}).superRefine((data, ctx) => {
    if (data.clientDocumentType === 'DNI') {
        if (!/^\d{8}$/.test(data.clientDocumentNumber)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'El DNI debe tener exactamente 8 nuevos dígitos numéricos',
                path: ['clientDocumentNumber']
            })
        }
    } else {
        // CE or PASAPORTE
        if (!/^[a-zA-Z0-9]{6,12}$/.test(data.clientDocumentNumber)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'El documento debe tener entre 6 y 12 caracteres alfanuméricos',
                path: ['clientDocumentNumber']
            })
        }
    }
})

export type BookingSchema = z.infer<typeof bookingSchema>
