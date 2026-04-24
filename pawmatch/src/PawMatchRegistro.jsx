import { useState } from "react";
import { supabase } from "./supabase";

export default function PawMatchRegistro() {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    cedula: "",
    correo: "",
    telefono: "",
    rol: "adoptante",
    password: "",
    confirmar: "",
  });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!form.nombres.trim()) return setError("El nombre es obligatorio.");
    if (!form.apellidos.trim()) return setError("Los apellidos son obligatorios.");
    if (!form.cedula.trim()) return setError("La cédula es obligatoria.");
    if (!form.correo.trim()) return setError("El correo es obligatorio.");
    if (form.password.length < 6)
      return setError("La contraseña debe tener al menos 6 caracteres.");
    if (form.password !== form.confirmar)
      return setError("Las contraseñas no coinciden.");

    setCargando(true);

    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.correo,
        password: form.password,
      });

      if (authError) throw authError;

      // 2. Insertar datos en la tabla "usuarios" (sin contrasena)
      const { error: dbError } = await supabase.from("usuarios").insert([
        {
          nombres: form.nombres,
          apellidos: form.apellidos,
          cedula: form.cedula,
          correo: form.correo,
          telefono: form.telefono,
          rol: form.rol,
        },
      ]);

      if (dbError) throw dbError;

      setExito("¡Registro exitoso! Ya puedes iniciar sesión. 🐾");
      setForm({
        nombres: "",
        apellidos: "",
        cedula: "",
        correo: "",
        telefono: "",
        rol: "adoptante",
        password: "",
        confirmar: "",
      });
    } catch (err) {
      if (err.message?.includes("already registered")) {
        setError("Este correo ya está registrado.");
      } else if (err.message?.includes("duplicate key") && err.message?.includes("cedula")) {
        setError("Esta cédula ya está registrada.");
      } else {
        setError(err.message || "Ocurrió un error al registrarse.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.logo}>🐾 PawMatch</span>
          <h2 style={styles.titulo}>Crear cuenta</h2>
          <p style={styles.subtitulo}>Únete y encuentra a tu compañero ideal</p>
        </div>

        {error && <div style={styles.alerta}>{error}</div>}
        {exito && <div style={styles.exitoBox}>{exito}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fila}>
            <div style={styles.grupo}>
              <label style={styles.label}>Nombres</label>
              <input name="nombres" type="text" placeholder="Tu nombre" value={form.nombres} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.grupo}>
              <label style={styles.label}>Apellidos</label>
              <input name="apellidos" type="text" placeholder="Tus apellidos" value={form.apellidos} onChange={handleChange} style={styles.input} required />
            </div>
          </div>

          <div style={styles.fila}>
            <div style={styles.grupo}>
              <label style={styles.label}>Cédula</label>
              <input name="cedula" type="text" placeholder="Número de cédula" value={form.cedula} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.grupo}>
              <label style={styles.label}>Teléfono</label>
              <input name="telefono" type="tel" placeholder="300 000 0000" value={form.telefono} onChange={handleChange} style={styles.input} />
            </div>
          </div>

          <div style={styles.grupo}>
            <label style={styles.label}>Correo electrónico</label>
            <input name="correo" type="email" placeholder="correo@ejemplo.com" value={form.correo} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.grupo}>
            <label style={styles.label}>Contraseña</label>
            <input name="password" type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.grupo}>
            <label style={styles.label}>Confirmar contraseña</label>
            <input name="confirmar" type="password" placeholder="Repite tu contraseña" value={form.confirmar} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.grupo}>
            <label style={styles.label}>Tipo de usuario</label>
            <select name="rol" value={form.rol} onChange={handleChange} style={styles.select}>
              <option value="adoptante">Adoptante</option>
              <option value="rescatista">Rescatista</option>
              <option value="refugio">Refugio</option>
            </select>
          </div>

          <button type="submit" style={cargando ? styles.btnDesactivado : styles.btn} disabled={cargando}>
            {cargando ? "Registrando..." : "Registrarme 🐾"}
          </button>
        </form>

        <p style={styles.pie}>
          ¿Ya tienes cuenta?{" "}
          <a href="/login" style={styles.link}>Inicia sesión</a>
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
  exito: "#27AE60",
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
    maxWidth: "520px",
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
  exitoBox: {
    backgroundColor: "#EAF7EE", color: colores.exito,
    border: "1px solid #A9DFB8", borderRadius: "10px",
    padding: "12px 16px", fontSize: "14px", marginBottom: "18px",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  fila: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  grupo: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: colores.texto },
  input: {
    padding: "11px 14px", borderRadius: "10px",
    border: `1.5px solid ${colores.borde}`, fontSize: "15px",
    color: colores.texto, outline: "none", backgroundColor: colores.crema,
  },
  select: {
    padding: "11px 14px", borderRadius: "10px",
    border: `1.5px solid ${colores.borde}`, fontSize: "15px",
    color: colores.texto, outline: "none", backgroundColor: colores.crema, cursor: "pointer",
  },
  btn: {
    marginTop: "8px", padding: "13px", borderRadius: "12px",
    border: "none", backgroundColor: colores.naranja, color: "#fff",
    fontSize: "16px", fontWeight: "700", cursor: "pointer",
  },
  btnDesactivado: {
    marginTop: "8px", padding: "13px", borderRadius: "12px",
    border: "none", backgroundColor: "#D4A97A", color: "#fff",
    fontSize: "16px", fontWeight: "700", cursor: "not-allowed",
  },
  pie: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: colores.gris },
  link: { color: colores.naranja, fontWeight: "600", textDecoration: "none" },
};