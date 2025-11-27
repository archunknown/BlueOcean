const fs = require('fs');
const path = require('path');

// Categorías y sus carpetas
const categories = {
    'Islas': 'islas',
    'Desierto': 'desierto',
    'Reserva': 'reserva',
    'Aventura': 'aventura'
};

// Función para convertir nombre de archivo a título
function fileNameToTitle(fileName) {
    // Remover extensión
    const nameWithoutExt = fileName.replace(/\.(png|jpg|jpeg|webp|gif)$/i, '');

    // Reemplazar guiones y guiones bajos con espacios
    const withSpaces = nameWithoutExt.replace(/[-_]/g, ' ');

    // Capitalizar cada palabra
    return withSpaces
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Generar datos de la galería
function generateGalleryData() {
    const galleryPath = path.join(__dirname, '../public/gallery');
    const allImages = [];

    // Recorrer cada categoría
    Object.entries(categories).forEach(([categoryName, folderName]) => {
        const categoryPath = path.join(galleryPath, folderName);

        // Verificar si la carpeta existe
        if (!fs.existsSync(categoryPath)) {
            console.warn(`⚠️  Carpeta no encontrada: ${categoryPath}`);
            return;
        }

        // Leer archivos de la carpeta
        const files = fs.readdirSync(categoryPath);

        // Filtrar solo imágenes
        const imageFiles = files.filter(file =>
            /\.(png|jpg|jpeg|webp|gif)$/i.test(file)
        );

        // Agregar cada imagen al array
        imageFiles.forEach(file => {
            allImages.push({
                src: `/gallery/${folderName}/${file}`,
                category: categoryName,
                title: fileNameToTitle(file)
            });
        });

        console.log(`✅ ${categoryName}: ${imageFiles.length} imágenes encontradas`);
    });

    return allImages;
}

// Guardar datos en archivo JSON
function saveGalleryData() {
    const galleryData = generateGalleryData();
    const outputPath = path.join(__dirname, '../src/data/gallery.json');

    // Crear carpeta data si no existe
    const dataDir = path.dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // Guardar JSON
    fs.writeFileSync(outputPath, JSON.stringify(galleryData, null, 2));

    console.log(`\n📸 Galería generada: ${galleryData.length} imágenes totales`);
    console.log(`💾 Guardado en: ${outputPath}\n`);
}

// Ejecutar
try {
    saveGalleryData();
} catch (error) {
    console.error('❌ Error generando galería:', error);
    process.exit(1);
}
