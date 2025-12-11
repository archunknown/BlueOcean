/**
 * Compresses an image file using the browser's Canvas API.
 * 
 * @param file - The original File object.
 * @param maxWidth - Maximum width (default 1920px).
 * @param quality - JPEG quality (0 to 1, default 0.8).
 * @returns Promise<File> - The compressed file.
 */
export async function compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
    // If it's not an image, return original
    if (!file.type.startsWith('image/')) {
        return file
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target?.result as string
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height

                // Calculate new dimensions
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width)
                    width = maxWidth
                }

                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    resolve(file) // Fallback
                    return
                }

                ctx.drawImage(img, 0, 0, width, height)

                // Compress to JPEG
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            resolve(file)
                            return
                        }
                        const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        })
                        resolve(compressedFile)
                    },
                    'image/jpeg',
                    quality
                )
            }
            img.onerror = (err) => reject(err)
        }
        reader.onerror = (err) => reject(err)
    })
}
