import { useState, useEffect } from "react";
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
  verdeClaro: "#EAF7EE",
  rojo: "#C0392B",
  rojoClaro: "#FDECEC",
  amarillo: "#F39C12",
  amarilloClaro: "#FEF9E7",
};

const badge = (color, bg, texto) => ({
  display: "inline-block", padding: "3px 10px", borderRadius: 20,
  fontSize: 11, fontWeight: 700, backgroundColor: bg, color, textTransform: "capitalize",
});

const estadoConfig = {
  pendiente:  { color: colores.amarillo, bg: colores.amarilloClaro, label: "Pendiente" },
  aprobada:   { color: colores.verde,    bg: colores.verdeClaro,    label: "Aprobada"  },
  rechazada:  { color: colores.rojo,     bg: colores.rojoClaro,     label: "Rechazada" },
};

export default function PawRescatPanel({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("pawmatch_user") || "{}");

  // ── tabs ──────────────────────────────────────────────────
  const [tab, setTab] = useState("publicar"); // publicar | mascotas | solicitudes

  // ── form publicar ─────────────────────────────────────────
  const formVacio = {
    nombre: "", especie: "perro", raza: "", edad_meses: "",
    tamaño: "mediano", sexo: "macho", ciudad: "", descripcion: "",
  };
  const [form, setForm]       = useState(formVacio);
  const [publicando, setPublicando] = useState(false);
  const [formError, setFormError]   = useState("");
  const [formExito, setFormExito]   = useState("");

  // ── mis mascotas ──────────────────────────────────────────
  const [mascotas, setMascotas]       = useState([]);
  const [cargandoM, setCargandoM]     = useState(false);

  // ── solicitudes ───────────────────────────────────────────
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargandoS, setCargandoS]     = useState(false);

  // ── toast ─────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const mostrarToast = (msg, error = false) => {
    setToast({ msg, error });
    setTimeout(() => setToast(null), 3500);
  };

  // ── cargar mis mascotas ───────────────────────────────────
  const cargarMascotas = async () => {
    setCargandoM(true);
    const { data, error } = await supabase
      .from("mascotas")
      .select("*")
      .eq("publicado_por", user.id)
      .order("created_at", { ascending: false });
    if (!error) setMascotas(data || []);
    setCargandoM(false);
  };

  // ── cargar solicitudes de mis mascotas ────────────────────
  const cargarSolicitudes = async () => {
    setCargandoS(true);
    // Primero obtenemos los IDs de nuestras mascotas
    const { data: mias } = await supabase
      .from("mascotas")
      .select("id")
      .eq("publicado_por", user.id);

    if (!mias || mias.length === 0) {
      setSolicitudes([]);
      setCargandoS(false);
      return;
    }

    const ids = mias.map((m) => m.id);

    const { data, error } = await supabase
      .from("solicitudes")
      .select("*, mascotas(nombre, especie), usuarios(nombres, apellidos, correo, telefono)")
      .in("mascota_id", ids)
      .order("created_at", { ascending: false });

    if (!error) setSolicitudes(data || []);
    setCargandoS(false);
  };

  useEffect(() => {
    if (tab === "mascotas")    cargarMascotas();
    if (tab === "solicitudes") cargarSolicitudes();
  }, [tab]);

  // ── publicar mascota ──────────────────────────────────────
  const handlePublicar = async () => {
    setFormError(""); setFormExito("");
    if (!form.nombre.trim()) return setFormError("El nombre es obligatorio.");
    if (!form.ciudad.trim()) return setFormError("La ciudad es obligatoria.");
    if (!form.descripcion.trim()) return setFormError("La descripción es obligatoria.");

    setPublicando(true);
    const { error } = await supabase.from("mascotas").insert([{
      nombre:       form.nombre,
      especie:      form.especie,
      raza:         form.raza || null,
      edad_meses:   form.edad_meses ? parseInt(form.edad_meses) : null,
      tamaño:       form.tamaño,
      sexo:         form.sexo,
      ciudad:       form.ciudad,
      descripcion:  form.descripcion,
      estado:       "disponible",
      publicado_por: user.id,
    }]);

    if (error) {
      setFormError("Error al publicar: " + error.message);
    } else {
      setFormExito("¡Mascota publicada exitosamente! 🐾");
      setForm(formVacio);
    }
    setPublicando(false);
  };

  // ── cambiar estado solicitud ──────────────────────────────
  const cambiarEstado = async (solicitudId, nuevoEstado, mascotaId) => {
    const { error } = await supabase
      .from("solicitudes")
      .update({ estado: nuevoEstado })
      .eq("id", solicitudId);

    if (error) { mostrarToast("Error al actualizar solicitud.", true); return; }

    // Si se aprueba, marcar mascota como en_proceso
    if (nuevoEstado === "aprobada") {
      await supabase.from("mascotas").update({ estado: "en_proceso" }).eq("id", mascotaId);
    }
    // Si se rechaza y estaba en proceso, volver a disponible
    if (nuevoEstado === "rechazada") {
      await supabase.from("mascotas").update({ estado: "disponible" }).eq("id", mascotaId);
    }

    mostrarToast(nuevoEstado === "aprobada" ? "¡Solicitud aprobada! 🎉" : "Solicitud rechazada.");
    cargarSolicitudes();
  };

  // ── eliminar mascota ──────────────────────────────────────
  const eliminarMascota = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar esta mascota?")) return;
    const { error } = await supabase.from("mascotas").delete().eq("id", id);
    if (!error) { mostrarToast("Mascota eliminada."); cargarMascotas(); }
    else mostrarToast("Error al eliminar.", true);
  };

  const edadTexto = (meses) => {
    if (!meses) return "—";
    if (meses < 12) return `${meses} mes${meses > 1 ? "es" : ""}`;
    const a = Math.floor(meses / 12);
    return `${a} año${a > 1 ? "s" : ""}`;
  };

  const emojiEspecie = (e) => e === "gato" ? "🐱" : "🐶";

  // ── render ────────────────────────────────────────────────
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
          <span style={{ fontWeight: 800, fontSize: 20, color: colores.naranja }}>PawMatch</span>
          <span style={{
            marginLeft: 8, padding: "3px 10px", borderRadius: 20,
            backgroundColor: colores.cremaDark, color: colores.naranjaOscuro,
            fontSize: 12, fontWeight: 700,
          }}>
            {user.rol === "refugio" ? "Refugio" : "Rescatista"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, color: colores.gris }}>
            Hola, <strong style={{ color: colores.texto }}>{user.nombres || "Usuario"}</strong> 👋
          </span>
          <button onClick={onLogout} style={{
            padding: "8px 16px", borderRadius: 10,
            border: `1.5px solid ${colores.borde}`,
            backgroundColor: "transparent", color: colores.gris,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Cerrar sesión</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        background: `linear-gradient(135deg, ${colores.naranja} 0%, ${colores.naranjaOscuro} 100%)`,
        padding: "32px 32px",
        color: colores.blanco,
      }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
          Panel de {user.rol === "refugio" ? "Refugio" : "Rescatista"}
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 14, opacity: 0.9 }}>
          Gestiona tus mascotas y solicitudes de adopción
        </p>
      </div>

      {/* TABS */}
      <div style={{
        backgroundColor: colores.blanco,
        borderBottom: `1px solid ${colores.borde}`,
        padding: "0 32px",
        display: "flex", gap: 0,
      }}>
        {[
          { key: "publicar",    label: "➕ Publicar mascota" },
          { key: "mascotas",    label: "🐾 Mis mascotas"     },
          { key: "solicitudes", label: "📋 Solicitudes"      },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "16px 20px", border: "none", backgroundColor: "transparent",
            fontSize: 14, fontWeight: tab === key ? 700 : 500,
            color: tab === key ? colores.naranja : colores.gris,
            borderBottom: tab === key ? `2px solid ${colores.naranja}` : "2px solid transparent",
            cursor: "pointer", transition: "color 0.2s",
          }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 32px" }}>

        {/* ── TAB: PUBLICAR ── */}
        {tab === "publicar" && (
          <div style={{
            backgroundColor: colores.blanco, borderRadius: 16,
            border: `1px solid ${colores.borde}`, padding: 32,
            boxShadow: "0 4px 16px rgba(61,43,31,0.06)",
          }}>
            <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700 }}>Nueva mascota</h2>

            {formError && (
              <div style={{ backgroundColor: colores.rojoClaro, color: colores.rojo, border: `1px solid #F5C6C6`, borderRadius: 10, padding: "12px 16px", fontSize: 14, marginBottom: 18 }}>
                {formError}
              </div>
            )}
            {formExito && (
              <div style={{ backgroundColor: colores.verdeClaro, color: colores.verde, border: `1px solid #A9DFB8`, borderRadius: 10, padding: "12px 16px", fontSize: 14, marginBottom: 18 }}>
                {formExito}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Nombre */}
              <div>
                <label style={lbl}>Nombre *</label>
                <input placeholder="Ej: Luna" value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  style={inp} />
              </div>
              {/* Especie */}
              <div>
                <label style={lbl}>Especie *</label>
                <select value={form.especie} onChange={(e) => setForm({ ...form, especie: e.target.value })} style={inp}>
                  <option value="perro">Perro</option>
                  <option value="gato">Gato</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              {/* Raza */}
              <div>
                <label style={lbl}>Raza</label>
                <input placeholder="Ej: Labrador" value={form.raza}
                  onChange={(e) => setForm({ ...form, raza: e.target.value })}
                  style={inp} />
              </div>
              {/* Edad */}
              <div>
                <label style={lbl}>Edad (en meses)</label>
                <input type="number" placeholder="Ej: 12" value={form.edad_meses}
                  onChange={(e) => setForm({ ...form, edad_meses: e.target.value })}
                  style={inp} min={0} />
              </div>
              {/* Tamaño */}
              <div>
                <label style={lbl}>Tamaño *</label>
                <select value={form.tamaño} onChange={(e) => setForm({ ...form, tamaño: e.target.value })} style={inp}>
                  <option value="pequeño">Pequeño</option>
                  <option value="mediano">Mediano</option>
                  <option value="grande">Grande</option>
                </select>
              </div>
              {/* Sexo */}
              <div>
                <label style={lbl}>Sexo *</label>
                <select value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })} style={inp}>
                  <option value="macho">Macho</option>
                  <option value="hembra">Hembra</option>
                </select>
              </div>
              {/* Ciudad */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={lbl}>Ciudad *</label>
                <input placeholder="Ej: Bogotá" value={form.ciudad}
                  onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                  style={inp} />
              </div>
              {/* Descripción */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={lbl}>Descripción *</label>
                <textarea placeholder="Cuéntanos sobre la personalidad y necesidades de la mascota..."
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  style={{ ...inp, height: 100, resize: "vertical" }} />
              </div>
            </div>

            <button onClick={handlePublicar} disabled={publicando} style={{
              marginTop: 20, padding: "13px 32px", borderRadius: 12, border: "none",
              backgroundColor: publicando ? "#D4A97A" : colores.naranja,
              color: colores.blanco, fontSize: 15, fontWeight: 700, cursor: publicando ? "not-allowed" : "pointer",
            }}>
              {publicando ? "Publicando..." : "Publicar mascota 🐾"}
            </button>
          </div>
        )}

        {/* ── TAB: MIS MASCOTAS ── */}
        {tab === "mascotas" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Mis mascotas</h2>
              <button onClick={cargarMascotas} style={{
                padding: "8px 16px", borderRadius: 10,
                border: `1.5px solid ${colores.borde}`,
                backgroundColor: "transparent", color: colores.gris,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>↻ Actualizar</button>
            </div>

            {cargandoM ? (
              <div style={{ textAlign: "center", padding: 60, color: colores.gris }}>
                <div style={{ fontSize: 36 }}>🐾</div>
                <p>Cargando...</p>
              </div>
            ) : mascotas.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: colores.gris,
                backgroundColor: colores.blanco, borderRadius: 16, border: `1px solid ${colores.borde}` }}>
                <div style={{ fontSize: 48 }}>🐾</div>
                <p style={{ marginTop: 12 }}>No has publicado mascotas aún.</p>
                <button onClick={() => setTab("publicar")} style={{
                  marginTop: 8, padding: "10px 20px", borderRadius: 10, border: "none",
                  backgroundColor: colores.naranja, color: colores.blanco,
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                }}>Publicar primera mascota</button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                {mascotas.map((m) => {
                  const cfg = estadoConfig[m.estado] || estadoConfig.pendiente;
                  return (
                    <div key={m.id} style={{
                      backgroundColor: colores.blanco, borderRadius: 16,
                      border: `1px solid ${colores.borde}`, overflow: "hidden",
                      boxShadow: "0 4px 16px rgba(61,43,31,0.06)",
                    }}>
                      <div style={{
                        height: 120, backgroundColor: colores.cremaDark,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 56, position: "relative",
                      }}>
                        {m.foto_url
                          ? <img src={m.foto_url} alt={m.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : emojiEspecie(m.especie)
                        }
                        <span style={{ position: "absolute", top: 8, right: 8, ...badge(cfg.color, cfg.bg, m.estado) }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div style={{ padding: "12px 14px" }}>
                        <strong style={{ fontSize: 16 }}>{m.nombre}</strong>
                        <div style={{ fontSize: 13, color: colores.gris, marginTop: 2 }}>
                          {m.especie} • {m.raza || "Mestizo"} • {edadTexto(m.edad_meses)}
                        </div>
                        <div style={{ fontSize: 13, color: colores.gris }}>📍 {m.ciudad}</div>
                        <button onClick={() => eliminarMascota(m.id)} style={{
                          marginTop: 10, width: "100%", padding: "8px", borderRadius: 10,
                          border: `1.5px solid ${colores.borde}`,
                          backgroundColor: "transparent", color: colores.rojo,
                          fontSize: 13, fontWeight: 600, cursor: "pointer",
                        }}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: SOLICITUDES ── */}
        {tab === "solicitudes" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Solicitudes recibidas</h2>
              <button onClick={cargarSolicitudes} style={{
                padding: "8px 16px", borderRadius: 10,
                border: `1.5px solid ${colores.borde}`,
                backgroundColor: "transparent", color: colores.gris,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>↻ Actualizar</button>
            </div>

            {cargandoS ? (
              <div style={{ textAlign: "center", padding: 60, color: colores.gris }}>
                <div style={{ fontSize: 36 }}>📋</div>
                <p>Cargando solicitudes...</p>
              </div>
            ) : solicitudes.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: colores.gris,
                backgroundColor: colores.blanco, borderRadius: 16, border: `1px solid ${colores.borde}` }}>
                <div style={{ fontSize: 48 }}>📭</div>
                <p style={{ marginTop: 12 }}>No hay solicitudes aún.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {solicitudes.map((s) => {
                  const cfg = estadoConfig[s.estado] || estadoConfig.pendiente;
                  return (
                    <div key={s.id} style={{
                      backgroundColor: colores.blanco, borderRadius: 16,
                      border: `1px solid ${colores.borde}`, padding: "20px 24px",
                      boxShadow: "0 4px 16px rgba(61,43,31,0.06)",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <strong style={{ fontSize: 15 }}>
                            {s.usuarios?.nombres} {s.usuarios?.apellidos}
                          </strong>
                          <span style={badge(cfg.color, cfg.bg)}>{cfg.label}</span>
                        </div>
                        <div style={{ fontSize: 13, color: colores.gris }}>
                          Mascota: <strong style={{ color: colores.texto }}>{s.mascotas?.nombre}</strong>
                          {" "}• {s.mascotas?.especie}
                        </div>
                        {s.usuarios?.correo && (
                          <div style={{ fontSize: 13, color: colores.gris, marginTop: 4 }}>
                            ✉️ {s.usuarios.correo}
                            {s.usuarios?.telefono && ` • 📞 ${s.usuarios.telefono}`}
                          </div>
                        )}
                        {s.mensaje && (
                          <div style={{ fontSize: 13, color: colores.gris, marginTop: 6, fontStyle: "italic" }}>
                            "{s.mensaje}"
                          </div>
                        )}
                      </div>

                      {s.estado === "pendiente" && (
                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                          <button onClick={() => cambiarEstado(s.id, "aprobada", s.mascota_id)} style={{
                            padding: "8px 16px", borderRadius: 10, border: "none",
                            backgroundColor: colores.verde, color: colores.blanco,
                            fontSize: 13, fontWeight: 700, cursor: "pointer",
                          }}>
                            ✓ Aprobar
                          </button>
                          <button onClick={() => cambiarEstado(s.id, "rechazada", s.mascota_id)} style={{
                            padding: "8px 16px", borderRadius: 10,
                            border: `1.5px solid ${colores.borde}`,
                            backgroundColor: "transparent", color: colores.rojo,
                            fontSize: 13, fontWeight: 700, cursor: "pointer",
                          }}>
                            ✕ Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 300,
          backgroundColor: toast.error ? colores.rojo : colores.texto,
          color: colores.blanco, padding: "14px 20px",
          borderRadius: 12, fontSize: 14, fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ── estilos compartidos ────────────────────────────────────
const lbl = {
  display: "block", fontSize: 12, fontWeight: 600,
  color: "#9E8B7D", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em",
};
const inp = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1.5px solid #E8D5C0", fontSize: 14,
  color: "#3D2B1F", backgroundColor: "#FDF6EC",
  outline: "none", boxSizing: "border-box",
};
