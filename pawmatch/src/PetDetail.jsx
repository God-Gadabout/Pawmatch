import React from 'react';

export default function PetDetail({ mascota, onClose }) {
  if (!mascota) return null;
  return (
    <div style={{ padding: 16, border: '1px solid #eee', borderRadius: 12, marginTop: 12, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>{mascota.nombre}</strong>
        <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>Cerrar</button>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <img src={mascota.fotos?.[0] || 'https://placehold.co/320x240'} alt={mascota.nombre} style={{ width: 320, height: 240, objectFit: 'cover', borderRadius: 8 }} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0 }}>{mascota.descripcion}</p>
          <p style={{ marginTop: 8, color: '#555' }}>Especie: {mascota.especie} • Tamaño: {mascota.tamano} • Ciudad: {mascota.ciudad}</p>
          <p>Contacto: contacto@mascota.org</p>
        </div>
      </div>
    </div>
  );
}
