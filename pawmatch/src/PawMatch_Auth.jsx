import { useState } from "react";
import { supabase } from "./supabase";

export default function PawMatchAuth({ onVolver, onRegistro, onNavigate }) {
  const [form, setForm] = useState({ correo: "", password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const [backHover, setBackHover] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.correo.trim()) return setError("Ingresa tu correo.");
    if (!form.password) return setError("Ingresa tu contraseña.");

    setCargando(true);

    try {
      // 1. Login con Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: form.correo,
        password: form.password,
      });

      if (authError) throw authError;

      // 2. Obtener datos del usuario desde la tabla "usuarios"
      const { data: usuario, error: dbError } = await supabase
        .from("usuarios")
        .select("nombres, apellidos, rol")
        .eq("correo", form.correo)
        .single();

      if (dbError) throw dbError;

      // 3. Guardar en localStorage para uso global
      localStorage.setItem("pawmatch_user", JSON.stringify(usuario));

      // 4. Redirigir según rol
      if (typeof onNavigate === "function") {
        onNavigate(usuario.rol);
      } else {
        const rutas = {
          adoptante: "/inicio",
          rescatista: "/rescatista",
          refugio: "/refugio",
        };
        window.location.href = rutas[usuario.rol] || "/inicio";
      }
    } catch (err) {
      if (
        err.message?.includes("Invalid login credentials") ||
        err.message?.includes("invalid_credentials")
      ) {
        setError("Correo o contraseña incorrectos.");
      } else if (err.message?.includes("Email not confirmed")) {
        setError("Debes confirmar tu correo antes de iniciar sesión.");
      } else {
        setError(err.message || "Error al iniciar sesión.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <button
            type="button"
            onClick={onVolver}
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
            style={{
              ...styles.backBtn,
              backgroundColor: backHover ? "rgba(0,0,0,.04)" : "transparent",
              transform: backHover ? "translateX(-1px)" : "none",
            }}
          >
            🡠 Inicio
          </button>
        </div>
        <div style={styles.header}>
          <span style={styles.logo}>🐾 PawMatch</span>
          <h2 style={styles.titulo}>Iniciar sesión</h2>
          <p style={styles.subtitulo}>Bienvenido de nuevo</p>
        </div>

        {error && <div style={styles.alerta}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grupo}>
            <label style={styles.label}>Correo electrónico</label>
            <input
              name="correo"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.correo}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.grupo}>
            <label style={styles.label}>Contraseña</label>
            <input
              name="password"
              type="password"
              placeholder="Tu contraseña"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.olvidaste}>
            <span style={{...styles.linkPequeño, cursor: "pointer"}}>¿Olvidaste tu contraseña?</span>
          </div>

          <button
            type="submit"
            style={cargando ? styles.btnDesactivado : styles.btn}
            disabled={cargando}
          >
            {cargando ? "Entrando..." : "Entrar 🐾"}
          </button>
        </form>

        <p style={styles.pie}>
          ¿No tienes cuenta?{" "}
          <span onClick={onRegistro} style={{...styles.link, cursor: "pointer"}}>Regístrate gratis</span>
        </p>
      </div>
    </div>
  );
}

const colores = {
  naranja: "#E8873A",
  crema: "#FDF6EC",
  texto: "#3D2B1F",
  gris: "#9E8B7D",
  error: "#C0392B",
  borde: "#E8D5C0",
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: colores.crema,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 32px rgba(61, 43, 31, 0.12)",
    border: `1px solid ${colores.borde}`,
  },
  header: { textAlign: "center", marginBottom: "28px" },
  logo: { fontSize: "22px", fontWeight: "700", color: colores.naranja },
  titulo: { fontSize: "26px", fontWeight: "700", color: colores.texto, margin: "8px 0 4px" },
  subtitulo: { fontSize: "14px", color: colores.gris, margin: 0 },
  alerta: {
    backgroundColor: "#FDECEC", color: colores.error,
    border: "1px solid #F5C6C6", borderRadius: "10px",
    padding: "12px 16px", fontSize: "14px", marginBottom: "18px",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  grupo: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: colores.texto },
  input: {
    padding: "11px 14px", borderRadius: "10px",
    border: `1.5px solid ${colores.borde}`, fontSize: "15px",
    color: colores.texto, outline: "none", backgroundColor: colores.crema,
  },
  olvidaste: { textAlign: "right", marginTop: "-6px" },
  linkPequeño: { fontSize: "13px", color: colores.gris, textDecoration: "none" },
  btn: {
    marginTop: "4px", padding: "13px", borderRadius: "12px",
    border: "none", backgroundColor: colores.naranja, color: "#fff",
    fontSize: "16px", fontWeight: "700", cursor: "pointer",
  },
  btnDesactivado: {
    marginTop: "4px", padding: "13px", borderRadius: "12px",
    border: "none", backgroundColor: "#D4A97A", color: "#fff",
    fontSize: "16px", fontWeight: "700", cursor: "not-allowed",
  },
  pie: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: colores.gris },
  link: { color: colores.naranja, fontWeight: "600", textDecoration: "none" },
};
  backBtn: {
    background: "transparent",
    color: colores.naranja,
    border: `1px solid ${colores.borde}`,
    padding: "6px 12px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    transition: "background-color .2s, transform .2s",
    margin: "6px 0 12px 6px",
  },
