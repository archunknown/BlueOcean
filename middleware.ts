import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Verificar si el modo mantenimiento está activo en las variables de entorno
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true'

  // 2. Si está activo, redirigir todo a maintenance.html, excepto la propia página y recursos estáticos
  if (isMaintenanceMode) {
    if (
      !request.nextUrl.pathname.startsWith('/maintenance.html') &&
      !request.nextUrl.pathname.includes('.') // Esto permite cargar imágenes/css/js
    ) {
      return NextResponse.rewrite(new URL('/maintenance.html', request.url))
    }
  }
}
