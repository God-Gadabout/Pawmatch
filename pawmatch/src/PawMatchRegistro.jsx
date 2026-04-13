// ─── PawMatchRegistro.jsx ─────────────────────────────────────
// Página de registro de PawMatch convertida de Registro.php

import { useState } from "react";

const ROLES = {
  adoptante:  { icono: "🏠", label: "Adoptante",  color: "#E8521A", bg: "#FFF0EA", border: "#E8521A", desc: "Quiero adoptar una mascota" },
  rescatista: { icono: "🦺", label: "Rescatista", color: "#118AB2", bg: "#EAF4FF", border: "#118AB2", desc: "Rescato y rehabilito animales" },
  refugio:    { icono: "🏡", label: "Refugio",    color: "#0BB8A0", bg: "#E6FBF7", border: "#0BB8A0", desc: "Gestiono un albergue animal" },
};

const estilos = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,300&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  :root {
    --brand:    #E8521A;
    --brand-lt: #FF7A45;
    --teal:     #0BB8A0;
    --azul:     #118AB2;
    --dark:     #1A1208;
    --mid:      #6B5540;
    --light:    #FDF6EE;
    --border:   #EDE5D8;
    --error:    #C0392B;
  }

  .pmr-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--light);
    color: var(--dark);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* NAVBAR */
  .pmr-nav {
    background: rgba(253,246,238,.95); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 64px; height: 64px; flex-shrink: 0;
  }
  .pmr-logo {
    font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.45rem;
    color: var(--dark); background: none; border: none; cursor: pointer;
  }
  .pmr-logo em { color: var(--brand); font-style: normal; }
  .pmr-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: 1px solid var(--border); border-radius: 100px;
    padding: 8px 16px; font-family: 'DM Sans', sans-serif;
    font-size: .88rem; font-weight: 500; color: var(--mid);
    cursor: pointer; transition: all .2s;
  }
  .pmr-back-btn:hover { border-color: var(--dark); color: var(--dark); }

  /* PAGE WRAP */
  .pmr-page-wrap {
    flex: 1; display: flex; align-items: flex-start; justify-content: center;
    padding: 52px 20px 72px;
  }

  /* CARD */
  .pmr-card {
    background: #fff; border: 1px solid var(--border); border-radius: 28px;
    padding: 52px 48px; width: 100%; max-width: 600px;
    box-shadow: 0 8px 48px rgba(26,18,8,.07);
  }

  /* ENCABEZADO */
  .pmr-card-head { text-align: center; margin-bottom: 36px; }
  .pmr-card-head .top-emoji { font-size: 2.8rem; display: block; margin-bottom: 14px; }
  .pmr-card-head h1 {
    font-family: 'Fraunces', serif; font-size: 2rem;
    font-weight: 900; letter-spacing: -.5px; margin-bottom: 6px;
  }
  .pmr-card-head h1 em { color: var(--brand); font-style: italic; }
  .pmr-card-head p { color: var(--mid); font-size: .92rem; }

  /* ALERTA */
  .pmr-alert {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 18px; border-radius: 14px;
    font-size: .9rem; font-weight: 500; margin-bottom: 28px; line-height: 1.5;
  }
  .pmr-alert-ico { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
  .pmr-alert--error { background: #FEF0EE; color: var(--error); border: 1px solid #F5C6C0; }
  .pmr-alert--exito { background: #E6FBF7; color: #077A6A; border: 1px solid #A8E8DF; }

  /* SELECCIÓN DE ROL */
  .pmr-bloque-label {
    font-size: .72rem; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: var(--brand);
    display: block; margin-bottom: 14px;
  }
  .pmr-rol-grid {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 12px; margin-bottom: 32px;
  }
  .pmr-rol-label {
    display: flex; flex-direction: column; align-items: center; gap: 7px;
    padding: 20px 12px; border: 2px solid var(--border); border-radius: 18px;
    cursor: pointer; transition: all .2s; text-align: center; background: #fff;
  }
  .pmr-rol-label:hover { border-color: var(--brand); background: #FFF8F5; }
  .pmr-rol-label--sel {
    border-color: var(--brand); background: #FFF0EA;
    box-shadow: 0 0 0 4px rgba(232,82,26,.10);
  }
  .pmr-rol-icon { font-size: 2rem; }
  .pmr-rol-name { font-weight: 700; font-size: .88rem; color: var(--dark); }
  .pmr-rol-desc { font-size: .75rem; color: var(--mid); line-height: 1.3; }

  /* DIVISOR */
  .pmr-divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }

  /* GRID 2 COLS */
  .pmr-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* CAMPOS */
  .pmr-campo { margin-bottom: 18px; }
  .pmr-campo:last-child { margin-bottom: 0; }
  .pmr-campo label {
    display: block; font-size: .82rem; font-weight: 600;
    color: #444; margin-bottom: 7px;
  }
  .pmr-campo input {
    width: 100%; padding: 12px 16px;
    border: 1.5px solid var(--border); border-radius: 12px;
    font-family: 'DM Sans', sans-serif; font-size: .95rem; color: var(--dark);
    background: #FDFAF7; outline: none; transition: border-color .2s, box-shadow .2s;
  }
  .pmr-campo input:focus {
    border-color: var(--brand); box-shadow: 0 0 0 3px rgba(232,82,26,.10); background: #fff;
  }
  .pmr-campo input::placeholder { color: #C0B4A8; }

  /* BOTÓN */
  .pmr-btn-submit {
    width: 100%; padding: 15px; margin-top: 22px;
    background: var(--brand); color: #fff; border: none; border-radius: 100px;
    font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700;
    cursor: pointer; transition: all .25s;
    box-shadow: 0 4px 18px rgba(232,82,26,.32);
  }
  .pmr-btn-submit:hover { background: var(--brand-lt); transform: translateY(-2px); box-shadow: 0 8px 26px rgba(232,82,26,.38); }

  /* PANTALLA DE ÉXITO */
  .pmr-exito-screen { text-align: center; padding: 20px 0; animation: pmrFadeUp .4s ease; }
  @keyframes pmrFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .pmr-exito-icon { font-size: 4.5rem; display: block; margin-bottom: 18px; }
  .pmr-exito-screen h2 {
    font-family: 'Fraunces', serif; font-size: 1.7rem;
    font-weight: 900; margin-bottom: 8px;
  }
  .pmr-exito-screen p { color: var(--mid); font-size: .95rem; margin-bottom: 28px; }
  .pmr-exito-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 22px; border-radius: 100px;
    font-weight: 700; font-size: .9rem; margin-bottom: 32px; border: 2px solid;
  }
  .pmr-btn-home {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--brand); color: #fff;
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 1rem;
    padding: 14px 34px; border-radius: 100px; border: none; cursor: pointer;
    box-shadow: 0 4px 18px rgba(232,82,26,.30); transition: all .25s;
  }
  .pmr-btn-home:hover { background: var(--brand-lt); transform: translateY(-2px); }

  /* PIE */
  .pmr-card-foot { text-align: center; margin-top: 22px; font-size: .88rem; color: var(--mid); }
  .pmr-card-foot button {
    background: none; border: none; color: var(--brand);
    font-weight: 700; font-size: .88rem; cursor: pointer;
  }
  .pmr-card-foot button:hover { text-decoration: underline; }

  @media (max-width: 560px) {
    .pmr-nav { padding: 0 16px; }
    .pmr-card { padding: 32px 20px; }
    .pmr-row2 { grid-template-columns: 1fr; }
    .pmr-rol-grid { grid-template-columns: 1fr; }
  }
`;

// ─── Componente principal ─────────────────────────────────────
export default function PawMatchRegistro({ onVolver, onLogin }) {
  const [form, setForm] = useState({
    rol: "", nombres: "", apellidos: "",
    cedula: "", telefono: "", correo: "",
    contrasena: "", confirmar: "",
  });
  const [msg, setMsg]       = useState({ texto: "", tipo: "" });
  const [exitoso, setExitoso] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const setRol = (r) => setForm((f) => ({ ...f, rol: r }));

  const validar = () => {
    const { rol, nombres, apellidos, cedula, telefono, correo, contrasena, confirmar } = form;
    if (!rol || !nombres || !apellidos || !cedula || !telefono || !correo || !contrasena)
      return "Por favor completa todos los campos obligatorios.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
      return "El correo electrónico ingresado no es válido.";
    if (!/^\d{6,12}$/.test(cedula))
      return "La cédula debe contener entre 6 y 12 dígitos numéricos.";
    if (!/^\d{7,15}$/.test(telefono))
      return "El teléfono debe contener entre 7 y 15 dígitos.";
    if (contrasena.length < 6)
      return "La contraseña debe tener al menos 6 caracteres.";
    if (contrasena !== confirmar)
      return "Las contraseñas no coinciden.";
    return null;
  };

  const handleSubmit = () => {
    const error = validar();
    if (error) { setMsg({ texto: error, tipo: "error" }); return; }

    // ── En producción: fetch POST al backend PHP ──
    // fetch("registro.php", { method:"POST", body: new FormData(...) })
    setExitoso(true);
    setMsg({ texto: "", tipo: "" });
  };

  const rolData = ROLES[form.rol];

  return (
    <>
      <style>{estilos}</style>
      <div className="pmr-root">

        {/* NAVBAR */}
        <nav className="pmr-nav">
          <button className="pmr-logo" onClick={onVolver}>
            Paw<em>Match</em> 🐾
          </button>
          <button className="pmr-back-btn" onClick={onVolver}>
            ← Volver al inicio
          </button>
        </nav>

        <div className="pmr-page-wrap">
          <div className="pmr-card">

            {exitoso ? (
              /* ── PANTALLA ÉXITO ── */
              <div className="pmr-exito-screen">
                <span className="pmr-exito-icon">🎉</span>
                <h2>¡Bienvenido/a a PawMatch!</h2>
                <p>Tu cuenta ha sido creada exitosamente.</p>
                {rolData && (
                  <div
                    className="pmr-exito-badge"
                    style={{ background: rolData.bg, color: rolData.color, borderColor: rolData.border }}
                  >
                    {rolData.icono} {rolData.label}
                  </div>
                )}
                <br />
                <button className="pmr-btn-home" onClick={onLogin}>
                  Iniciar sesión 🐾
                </button>
              </div>
            ) : (
              <>
                {/* ENCABEZADO */}
                <div className="pmr-card-head">
                  <span className="top-emoji">🐾</span>
                  <h1>Crea tu <em>cuenta</em></h1>
                  <p>Únete y encuentra a tu compañero ideal</p>
                </div>

                {/* ALERTA */}
                {msg.texto && (
                  <div className={`pmr-alert pmr-alert--${msg.tipo}`}>
                    <span className="pmr-alert-ico">⚠️</span>
                    {msg.texto}
                  </div>
                )}

                {/* SELECCIÓN DE ROL */}
                <span className="pmr-bloque-label">¿Cuál es tu rol?</span>
                <div className="pmr-rol-grid">
                  {Object.entries(ROLES).map(([val, r]) => (
                    <button
                      key={val}
                      type="button"
                      className={`pmr-rol-label${form.rol === val ? " pmr-rol-label--sel" : ""}`}
                      onClick={() => setRol(val)}
                    >
                      <span className="pmr-rol-icon">{r.icono}</span>
                      <span className="pmr-rol-name">{r.label}</span>
                      <span className="pmr-rol-desc">{r.desc}</span>
                    </button>
                  ))}
                </div>

                <hr className="pmr-divider" />

                {/* NOMBRES Y APELLIDOS */}
                <div className="pmr-row2">
                  <div className="pmr-campo">
                    <label>Nombres *</label>
                    <input name="nombres" placeholder="Ej: María Fernanda" value={form.nombres} onChange={handleChange} />
                  </div>
                  <div className="pmr-campo">
                    <label>Apellidos *</label>
                    <input name="apellidos" placeholder="Ej: García López" value={form.apellidos} onChange={handleChange} />
                  </div>
                </div>

                {/* CÉDULA Y TELÉFONO */}
                <div className="pmr-row2">
                  <div className="pmr-campo">
                    <label>Cédula *</label>
                    <input name="cedula" placeholder="Ej: 1020304050" value={form.cedula} onChange={handleChange} />
                  </div>
                  <div className="pmr-campo">
                    <label>Teléfono *</label>
                    <input name="telefono" type="tel" placeholder="Ej: 3001234567" value={form.telefono} onChange={handleChange} />
                  </div>
                </div>

                {/* CORREO */}
                <div className="pmr-campo">
                  <label>Correo electrónico *</label>
                  <input name="correo" type="email" placeholder="tu@correo.com" value={form.correo} onChange={handleChange} />
                </div>

                <hr className="pmr-divider" />

                {/* CONTRASEÑAS */}
                <div className="pmr-row2">
                  <div className="pmr-campo">
                    <label>Contraseña *</label>
                    <input name="contrasena" type="password" placeholder="Mín. 6 caracteres" value={form.contrasena} onChange={handleChange} />
                  </div>
                  <div className="pmr-campo">
                    <label>Confirmar contraseña *</label>
                    <input name="confirmar" type="password" placeholder="Repite tu contraseña" value={form.confirmar} onChange={handleChange} />
                  </div>
                </div>

                <button className="pmr-btn-submit" onClick={handleSubmit}>
                  Crear mi cuenta 🐾
                </button>
              </>
            )}

            <p className="pmr-card-foot">
              ¿Ya tienes cuenta?{" "}
              <button onClick={onLogin}>Inicia sesión aquí</button>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
