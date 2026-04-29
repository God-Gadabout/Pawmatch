import { useEffect, useState, useMemo } from "react";
import { supabase } from "./supabase";

const colores = {
  naranja: "#E8873A",
  naranjaOscuro: "#C96D20",
  crema: "#FDF6EC",
  cremaDark: "#F5EAD8",
  texto: "#3D2B1F",
  gris: "#9E8B7D",
  borde: "#E8D5C0",
  blanco: "#FFFFFF",
  verde: "#27AE60",
  rojo: "#C0392B",
};

const estiloTag = (color = colores.naranja) => ({
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: 20,
  fontSize: 11,
  fontWeight: 700,
  backgroundColor: color + "22",
  color: color,
  textTransform: "capitalize",
  letterSpacing: "0.03em",
});

export default function PawAdoptDashboard({ user, onLogout }) {
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({ especie: "todos", tamaño: "todos", ciudad: "" });
  const [busqueda, setBusqueda] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [toast, setToast] = useState(null);
  const [enviados, setEnviados] = useState(new Set());

  useEffect(() => {
    async function cargarMascotas() {
      setCargando(true);
      const { data, error } = await supabase
        .from("mascotas")
        .select("*")
        .eq("estado", "disponible")
        .order("created_at", { ascending: false });
      if (!error) setMascotas(data || []);
      setCargando(false);
    }
    cargarMascotas();
  }, []);

  const ciudades = useMemo(() => {
    const set = new Set(mascotas.map((m) => m.ciudad).filter(Boolean));
    return ["todas", ...Array.from(set).sort()];
  }, [mascotas]);

  const filtradas = useMemo(() => {
    return mascotas.filter((m) => {
      if (filtros.especie !== "todos" && m.especie !== filtros.especie) return false;
      if (filtros.tamaño !== "todos" && m.tamaño !== filtros.tamaño) return false;
      if (filtros.ciudad && filtros.ciudad !== "todas" && m.ciudad !== filtros.ciudad) return false;
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        if (!m.nombre?.toLowerCase().includes(q) && !m.raza?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [mascotas, filtros, busqueda]);

  const handleSolicitar = async (mascota) => {
    if (enviados.has(mascota.id)) return;
    const { error } = await supabase.from("solicitudes").insert([{
      mascota_id: mascota.id,
      adoptante_id: user?.id || null,
      estado: "pendiente",
      mensaje: `${user?.nombres || "Usuario"} está interesado en adoptar a ${mascota.nombre}.`,
    }]);
    if (!error) {
      setEnviados((prev) => new Set([...prev, mascota.id]));
      mostrarToast(`¡Solicitud enviada para ${mascota.nombre}! 🐾`);
    } else {
      mostrarToast("Error al enviar solicitud.", true);
    }
  };

  const mostrarToast = (msg, error = false) => {
    setToast({ msg, error });
    setTimeout(() => setToast(null), 3500);
  };

  const edadTexto = (meses) => {
    if (!meses) return "Edad desconocida";
    if (meses < 12) return `${meses} mes${meses > 1 ? "es" : ""}`;
    const años = Math.floor(meses / 12);
    return `${años} año${años > 1 ? "s" : ""}`;
  };

  const emojiEspecie = (e) => e === "gato" ? "🐱" : e === "perro" ? "🐶" : "🐾";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colores.crema, fontFamily: "'Segoe UI', sans-serif", color: colores.texto }}>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        backgroundColor: colores.blanco,
        borderBottom: `1px solid ${colores.borde}`,
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
        boxShadow: "0 2px 12px rgba(61,43,31,0.07)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🐾</span>
          <span style={{ fontWeight: 800, fontSize: 20, color: colores.naranja, letterSpacing: "-0.5px" }}>PawMatch</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, color: colores.gris }}>
            Hola, <strong style={{ color: colores.texto }}>{user?.nombres || "Usuario"}</strong> 👋
          </span>
          <button onClick={onLogout} style={{
            padding: "8px 16px", borderRadius: 10,
            border: `1.5px solid ${colores.borde}`,
            backgroundColor: "transparent", color: colores.gris,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        background: `linear-gradient(135deg, ${colores.naranja} 0%, ${colores.naranjaOscuro} 100%)`,
        padding: "40px 32px",
        color: colores.blanco,
        textAlign: "center",
      }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px" }}>
          Encuentra a tu compañero ideal 🐾
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 16, opacity: 0.9 }}>
          {mascotas.length} mascotas esperan un hogar amoroso en Colombia
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>

        {/* FILTROS */}
        <aside>
          <div style={{
            backgroundColor: colores.blanco,
            borderRadius: 16,
            border: `1px solid ${colores.borde}`,
            padding: 20,
            position: "sticky", top: 80,
            boxShadow: "0 4px 16px rgba(61,43,31,0.06)",
          }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: colores.texto }}>🔍 Filtrar mascotas</h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: colores.gris, display: "block", marginBottom: 6 }}>BUSCAR</label>
              <input
                placeholder="Nombre o raza..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  width: "100%", padding: "9px 12px", borderRadius: 10,
                  border: `1.5px solid ${colores.borde}`, fontSize: 14,
                  color: colores.texto, backgroundColor: colores.crema,
                  outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            {[
              { label: "ESPECIE", key: "especie", opciones: ["todos", "perro", "gato"] },
              { label: "TAMAÑO", key: "tamaño", opciones: ["todos", "pequeño", "mediano", "grande"] },
            ].map(({ label, key, opciones }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: colores.gris, display: "block", marginBottom: 6 }}>{label}</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {opciones.map((op) => (
                    <button key={op} onClick={() => setFiltros({ ...filtros, [key]: op })} style={{
                      padding: "5px 12px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                      border: `1.5px solid ${filtros[key] === op ? colores.naranja : colores.borde}`,
                      backgroundColor: filtros[key] === op ? colores.naranja : "transparent",
                      color: filtros[key] === op ? colores.blanco : colores.texto,
                      fontWeight: filtros[key] === op ? 700 : 400,
                      textTransform: "capitalize",
                    }}>
                      {op === "todos" ? "Todos" : op}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: colores.gris, display: "block", marginBottom: 6 }}>CIUDAD</label>
              <select
                value={filtros.ciudad}
                onChange={(e) => setFiltros({ ...filtros, ciudad: e.target.value })}
                style={{
                  width: "100%", padding: "9px 12px", borderRadius: 10,
                  border: `1.5px solid ${colores.borde}`, fontSize: 14,
                  color: colores.texto, backgroundColor: colores.crema,
                  outline: "none", cursor: "pointer",
                }}
              >
                {ciudades.map((c) => <option key={c} value={c}>{c === "todas" ? "Todas las ciudades" : c}</option>)}
              </select>
            </div>

            {(filtros.especie !== "todos" || filtros.tamaño !== "todos" || filtros.ciudad) && (
              <button onClick={() => setFiltros({ especie: "todos", tamaño: "todos", ciudad: "" })} style={{
                width: "100%", marginTop: 12, padding: "8px", borderRadius: 10,
                border: `1.5px solid ${colores.borde}`, backgroundColor: "transparent",
                color: colores.gris, fontSize: 13, cursor: "pointer", fontWeight: 600,
              }}>
                ✕ Limpiar filtros
              </button>
            )}
          </div>
        </aside>

        {/* CATÁLOGO */}
        <main>
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontSize: 14, color: colores.gris }}>
              Mostrando <strong style={{ color: colores.texto }}>{filtradas.length}</strong> mascota{filtradas.length !== 1 ? "s" : ""}
            </p>
          </div>

          {cargando ? (
            <div style={{ textAlign: "center", padding: 80, color: colores.gris }}>
              <div style={{ fontSize: 40 }}>🐾</div>
              <p style={{ marginTop: 12 }}>Cargando mascotas...</p>
            </div>
          ) : filtradas.length === 0 ? (
            <div style={{ textAlign: "center", padding: 80, color: colores.gris }}>
              <div style={{ fontSize: 40 }}>🔍</div>
              <p style={{ marginTop: 12 }}>No hay mascotas que coincidan con los filtros.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
              {filtradas.map((m) => (
                <div key={m.id} style={{
                  backgroundColor: colores.blanco,
                  borderRadius: 16,
                  border: `1px solid ${colores.borde}`,
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(61,43,31,0.06)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(61,43,31,0.13)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(61,43,31,0.06)"; }}
                >
                  {/* Foto */}
                  <div style={{
                    height: 160, backgroundColor: colores.cremaDark,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 64, position: "relative",
                  }}>
                    {m.foto_url
                      ? <img src={m.foto_url} alt={m.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span>{emojiEspecie(m.especie)}</span>
                    }
                    <span style={{
                      position: "absolute", top: 10, right: 10,
                      ...estiloTag(m.especie === "gato" ? "#8B5CF6" : colores.naranja),
                      fontSize: 11,
                    }}>
                      {m.especie}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <strong style={{ fontSize: 16, color: colores.texto }}>{m.nombre}</strong>
                      <span style={{ fontSize: 12, color: colores.gris }}>{edadTexto(m.edad_meses)}</span>
                    </div>
                    <div style={{ fontSize: 13, color: colores.gris, marginBottom: 4 }}>{m.raza || "Mestizo"}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                      {m.tamaño && <span style={estiloTag()}>{m.tamaño}</span>}
                      {m.ciudad && <span style={estiloTag(colores.gris)}>📍 {m.ciudad}</span>}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setDetalle(m)} style={{
                        flex: 1, padding: "8px 0", borderRadius: 10,
                        border: `1.5px solid ${colores.borde}`,
                        backgroundColor: "transparent", color: colores.texto,
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                      }}>Ver más</button>
                      <button onClick={() => handleSolicitar(m)} disabled={enviados.has(m.id)} style={{
                        flex: 1, padding: "8px 0", borderRadius: 10, border: "none",
                        backgroundColor: enviados.has(m.id) ? colores.verde : colores.naranja,
                        color: colores.blanco, fontSize: 13, fontWeight: 700,
                        cursor: enviados.has(m.id) ? "default" : "pointer",
                      }}>
                        {enviados.has(m.id) ? "✓ Enviado" : "Me interesa"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MODAL DETALLE */}
      {detalle && (
        <div onClick={() => setDetalle(null)} style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: colores.blanco, borderRadius: 20,
            padding: 32, maxWidth: 480, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          }}>
            <div style={{ textAlign: "center", fontSize: 80, marginBottom: 12 }}>
              {detalle.foto_url
                ? <img src={detalle.foto_url} alt={detalle.nombre} style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 12 }} />
                : emojiEspecie(detalle.especie)
              }
            </div>
            <h2 style={{ margin: "0 0 4px", fontSize: 24, color: colores.texto }}>{detalle.nombre}</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              <span style={estiloTag()}>{detalle.especie}</span>
              {detalle.raza && <span style={estiloTag(colores.gris)}>{detalle.raza}</span>}
              {detalle.tamaño && <span style={estiloTag()}>{detalle.tamaño}</span>}
              {detalle.sexo && <span style={estiloTag(colores.naranjaOscuro)}>{detalle.sexo}</span>}
              {detalle.ciudad && <span style={estiloTag(colores.gris)}>📍 {detalle.ciudad}</span>}
            </div>
            <p style={{ fontSize: 14, color: colores.gris, lineHeight: 1.6, margin: "0 0 16px" }}>
              {detalle.descripcion || "Sin descripción disponible."}
            </p>
            <p style={{ fontSize: 13, color: colores.gris, margin: "0 0 20px" }}>
              🎂 {edadTexto(detalle.edad_meses)}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDetalle(null)} style={{
                flex: 1, padding: 12, borderRadius: 12,
                border: `1.5px solid ${colores.borde}`,
                backgroundColor: "transparent", color: colores.texto,
                fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>Cerrar</button>
              <button onClick={() => { handleSolicitar(detalle); setDetalle(null); }}
                disabled={enviados.has(detalle.id)} style={{
                  flex: 1, padding: 12, borderRadius: 12, border: "none",
                  backgroundColor: enviados.has(detalle.id) ? colores.verde : colores.naranja,
                  color: colores.blanco, fontSize: 14, fontWeight: 700,
                  cursor: enviados.has(detalle.id) ? "default" : "pointer",
                }}>
                {enviados.has(detalle.id) ? "✓ Solicitud enviada" : "Me interesa 🐾"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 300,
          backgroundColor: toast.error ? colores.rojo : colores.texto,
          color: colores.blanco, padding: "14px 20px",
          borderRadius: 12, fontSize: 14, fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          animation: "fadeIn 0.3s ease",
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
