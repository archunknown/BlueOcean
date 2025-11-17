'use client';

export default function FakeMap() {
  // This URL uses the "q" parameter to search for a specific business name,
  // which centers the map on the exact location without needing an API key.
  const mapSrc = "https://www.google.com/maps?q=Blue%20Ocean%20Adventure%20Tours%20Paracas&output=embed";

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      <iframe
        src={mapSrc}
        className="absolute top-0 left-0 w-full h-full"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
