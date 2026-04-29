import { useEffect, useMemo, useState } from "react";

// Dashboard para Adoptante: catálogo de mascotas, filtros y acción de interés
export default function PawAdoptDashboard({ user, mascotas, onSolicitar, onLogout, onOpenDetail }) {
  const [filtros, setFiltros] = useState({ especie: "todos", tamano: "todos", ciudad: "" });
  const [busqueda, setBusqueda] = useState("");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const especies = useMemo(() => ["todos", "perro", "gato"], []);
  const tamanos = useMemo(() => ["todos", "pequeño", "mediano", "grande"], []);

  const filtrados = useMemo(() => {
    return (mascotas || []).filter((m) => {
      if (filtros.especie !== "todos" && m.especie.toLowerCase() !== filtros.especie) return false;
      if (filtros.tamano !== "todos" && m.tamano.toLowerCase() !== filtros.tamano) return false;
      if (filtros.ciudad && m.ciudad.toLowerCase().indexOf(filtros.ciudad.toLowerCase()) === -1) return false;
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        if (!m.nombre.toLowerCase().includes(q) && !m.descripcion.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [mascotas, filtros, busqueda]);

  // Acción de interes: generar una solicitud a través del callback
  const handleSolicitar = (mascota) => {
    if (onSolicitar) onSolicitar(mascota);
    setToast(`Solicitud enviada para ${mascota.nombre}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="pm-home">
      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#111', color: '#fff', padding: '12px 16px', borderRadius: 8, boxShadow: '0 6px 20px rgba(0,0,0,.25)' }}>{toast}</div>
      )}
      <nav className="pm-nav" style={{ position: "sticky", top: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <strong style={{ fontFamily: "Fraunces, serif", fontSize: 20 }}>PawMatch</strong>
          <span style={{ color: "var(--mid)" }}>Bienvenido{user?.nombres ? `, ${user.nombres}` : ""}</span>
        </div>
        <button className="pm-btn-ghost" onClick={onLogout}>Cerrar sesión</button>
      </nav>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 2fr", padding: 32, gap: 24 }}>
        <aside style={{ borderRight: "1px solid #eee", paddingRight: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <input
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <label>Especie</label>
            <select
              value={filtros.especie}
              onChange={(e) => setFiltros({ ...filtros, especie: e.target.value })}
              style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
            >
              {especies.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: 8 }}>
            <label>Tamaño</label>
            <select
              value={filtros.tamano}
              onChange={(e) => setFiltros({ ...filtros, tamano: e.target.value })}
              style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
            >
              {tamanos.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: 8 }}>
            <label>Ciudad</label>
            <input
              placeholder="Ciudad..."
              value={filtros.ciudad}
              onChange={(e) => setFiltros({ ...filtros, ciudad: e.target.value })}
              style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
            />
          </div>
        </aside>
        <main>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {filtrados.map((m) => (
              <div key={m.id} className="card" style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
                <img src={m.fotos?.[0] || "https://placehold.co/320x180"} alt={m.nombre} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <strong>{m.nombre}</strong>
                  <span style={{ fontSize: 12, color: "var(--mid)" }}>{m.especie} • {m.tamano}</span>
                </div>
                <div style={{ color: "var(--mid)", fontSize: 12 }}>{m.ciudad}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <button className="pm-btn-ghost" onClick={() => onOpenDetail?.(m)} style={{ padding: "8px 12px" }}>Ver</button>
                  <button className="pm-btn-solid" onClick={() => handleSolicitar(m)} style={{ padding: "8px 12px" }}>Me interesa</button>
                </div>
              </div>
            ))}
            {filtrados.length === 0 && <div>No hay mascotas que coincidan con los filtros.</div>}
          </div>
        </main>
      </section>
    </div>
  );
}
