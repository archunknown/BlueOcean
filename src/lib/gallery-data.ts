export interface GalleryItem {
    id: string;
    src: string;
    category: string;
    title: string;
}

export const galleryData: GalleryItem[] = [
    { id: '1', src: "/gallery/islas/Paseo en Islas.jpeg", category: "Islas", title: "Paseo En Islas" },
    { id: '2', src: "/gallery/islas/adrenalina.png", category: "Islas", title: "Adrenalina" },
    { id: '3', src: "/gallery/desierto/Mini Buggies.jpeg", category: "Desierto", title: "Mini Buggies" },
    { id: '4', src: "/gallery/desierto/Paseo Minibuggie.jpeg", category: "Desierto", title: "Paseo Minibuggie" },
    { id: '5', src: "/gallery/desierto/bici.jpg", category: "Desierto", title: "Bici" },
    { id: '6', src: "/gallery/desierto/catedral.png", category: "Desierto", title: "Catedral" },
    { id: '7', src: "/gallery/desierto/pelicanos.png", category: "Desierto", title: "Pelicanos" },
    { id: '8', src: "/gallery/reserva/Reserva 2.jpeg", category: "Reserva", title: "Reserva 2" },
    { id: '9', src: "/gallery/reserva/atardecer.png", category: "Reserva", title: "Atardecer" },
    { id: '10', src: "/gallery/reserva/reserva.jpeg", category: "Reserva", title: "Reserva" },
    { id: '11', src: "/gallery/aventura/acantilado.png", category: "Aventura", title: "Acantilado" },
    { id: '12', src: "/gallery/aventura/buggy.png", category: "Aventura", title: "Buggy" },
    { id: '13', src: "/gallery/aventura/duna.png", category: "Aventura", title: "Duna" },
    { id: '14', src: "/gallery/aventura/lobo-marino.png", category: "Aventura", title: "Lobo Marino" }
];
