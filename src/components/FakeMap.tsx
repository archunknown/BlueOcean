'use client';

export default function FakeMap() {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <iframe
        src="https://www.google.com/maps?q=-13.8325865,-76.2476819&hl=es&z=15&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '400px' }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación de Blue Ocean Paracas"
      ></iframe>
    </div>
  );
}