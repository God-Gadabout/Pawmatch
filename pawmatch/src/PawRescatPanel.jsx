import { useState } from "react";

export default function PawRescatPanel({ onPublish, onLogout }) {
  const [form, setForm] = useState({ nombre: '', especie: 'perro', edad: '', ciudad: '', descripcion: '' });
  const [mascotas, setMascotas] = useState([]);

  const handlePublish = () => {
    if (!form.nombre) return;
    const nueva = { ...form, id: Date.now(), fotos: [] };
    setMascotas([nueva, ...mascotas]);
    setForm({ nombre: '', especie: 'perro', edad: '', ciudad: '', descripcion: '' });
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Panel Rescatista / Refugio</h2>
        <button onClick={onLogout}>Cerrar sesión</button>
      </div>
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <h3>Publicar mascota</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input placeholder="Nombre" value={form.nombre} onChange={(e)=>setForm({...form, nombre: e.target.value})} />
            <select value={form.especie} onChange={(e)=>setForm({...form, especie: e.target.value})}>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
            <input placeholder="Edad" value={form.edad} onChange={(e)=>setForm({...form, edad: e.target.value})} />
            <input placeholder="Ciudad" value={form.ciudad} onChange={(e)=>setForm({...form, ciudad: e.target.value})} />
          </div>
          <textarea placeholder="Descripción" value={form.descripcion} onChange={(e)=>setForm({...form, descripcion: e.target.value})} style={{ width: '100%', height: 80, marginTop: 8 }} />
          <button onClick={handlePublish} style={{ marginTop: 8 }}>Publicar</button>
        </div>
        <div>
          <h3>Publicaciones</h3>
          {mascotas.length === 0 && <p>No hay mascotas publicadas aún.</p>}
          {mascotas.map((m) => (
            <div key={m.id} style={{ border: '1px solid #eee', padding: 8, borderRadius: 8, marginBottom: 8 }}>
              <strong>{m.nombre}</strong> <span style={{ color: '#555' }}>{m.especie} • {m.ciudad}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
