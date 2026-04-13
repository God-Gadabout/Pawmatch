import { useState } from "react";

// ─── Constantes ──────────────────────────────────────────────
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

  .pawmatch-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--light);
    color: var(--dark);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .pawmatch-root::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 55% 55% at 90% 10%, rgba(245,200,66,.15) 0%, transparent 65%),
      radial-gradient(ellipse 40% 45% at 5% 90%,  rgba(11,184,160,.10) 0%, transparent 60%);
  }

  /* NAVBAR */
  .pm-nav {
    position: relative;
    z-index: 10;
    background: rgba(253,246,238,.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 64px;
    height: 64px;
    flex-shrink: 0;
  }
  .pm-logo {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: 1.45rem;
    color: var(--dark);
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
  }
  .pm-logo em { color: var(--brand); font-style: normal; }

  .pm-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 8px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: .88rem;
    font-weight: 500;
    color: var(--mid);
    cursor: pointer;
    transition: all .2s;
  }
  .pm-back-btn:hover { border-color: var(--dark); color: var(--dark); }

  /* LAYOUT */
  .pm-page-wrap {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 52px 20px 72px;
  }

  /* CARD */
  .pm-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 28px;
    padding: 52px 48px;
    width: 100%;
    max-width: 460px;
    box-shadow: 0 8px 48px rgba(26,18,8,.08);
  }
  .pm-card--wide { max-width: 600px; }

  /* ENCABEZADO */
  .pm-card-head { text-align: center; margin-bottom: 34px; }
  .pm-card-head .top-emoji { font-size: 2.6rem; display: block; margin-bottom: 14px; }
  .pm-card-head h1 {
    font-family: 'Fraunces', serif;
    font-size: 2rem;
    font-weight: 900;
    letter-spacing: -.5px;
    margin-bottom: 6px;
  }
  .pm-card-head h1 em { color: var(--brand); font-style: italic; }
  .pm-card-head p { color: var(--mid); font-size: .92rem; }

  /* ALERTA */
  .pm-alert {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 13px 17px;
    border-radius: 14px;
    font-size: .9rem;
    font-weight: 500;
    margin-bottom: 24px;
    line-height: 1.5;
  }
  .pm-alert-ico { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
  .pm-alert--error { background: #FEF0EE; color: var(--error); border: 1px solid #F5C6C0; }
  .pm-alert--exito { background: #E6FBF7; color: #077A6A; border: 1px solid #A8E8DF; }

  /* CAMPOS */
  .pm-campo { margin-bottom: 18px; }
  .pm-campo:last-child { margin-bottom: 0; }
  .pm-campo label {
    display: block;
    font-size: .82rem;
    font-weight: 600;
    color: #444;
    margin-bottom: 7px;
  }
  .pm-campo input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: .95rem;
    color: var(--dark);
    background: #FDFAF7;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .pm-campo input:focus {
    border-color: var(--brand);
    box-shadow: 0 0 0 3px rgba(232,82,26,.10);
    background: #fff;
  }
  .pm-campo input::placeholder { color: #C0B4A8; }

  /* BOTÓN PRINCIPAL */
  .pm-btn-submit {
    width: 100%;
    padding: 15px;
    margin-top: 8px;
    background: var(--brand);
    color: #fff;
    border: none;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all .25s;
    box-shadow: 0 4px 18px rgba(232,82,26,.30);
  }
  .pm-btn-submit:hover {
    background: var(--brand-lt);
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(232,82,26,.38);
  }
  .pm-btn-submit--top { margin-top: 22px; }

  /* PIE DE CARD */
  .pm-card-foot { text-align: center; margin-top: 24px; font-size: .88rem; color: var(--mid); }
  .pm-card-foot button {
    background: none;
    border: none;
    color: var(--brand);
    font-weight: 700;
    font-size: .88rem;
    cursor: pointer;
    text-decoration: none;
  }
  .pm-card-foot button:hover { text-decoration: underline; }

  /* PANTALLA DE BIENVENIDA (login exitoso) */
  .pm-bienvenida {
    text-align: center;
    padding: 12px 0 8px;
    animation: fadeUp .4s ease;
  }
  .pm-bv-avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    margin: 0 auto 20px;
    border: 3px solid;
  }
  .pm-bv-nombre {
    font-family: 'Fraunces', serif;
    font-size: 1.6rem;
    font-weight: 900;
    margin-bottom: 6px;
  }
  .pm-bv-sub { color: var(--mid); font-size: .9rem; margin-bottom: 22px; }
  .pm-bv-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 22px;
    border-radius: 100px;
    border: 2px solid;
    font-weight: 700;
    font-size: .9rem;
    margin-bottom: 32px;
  }
  .pm-btn-home {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--brand);
    color: #fff;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    padding: 14px 34px;
    border-radius: 100px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(232,82,26,.28);
    transition: all .25s;
  }
  .pm-btn-home:hover { background: var(--brand-lt); transform: translateY(-2px); }

  /* PANTALLA DE ÉXITO (registro) */
  .pm-exito-screen {
    text-align: center;
    padding: 20px 0;
    animation: fadeUp .4s ease;
  }
  .pm-exito-icon { font-size: 4.5rem; display: block; margin-bottom: 18px; }
  .pm-exito-screen h2 {
    font-family: 'Fraunces', serif;
    font-size: 1.7rem;
    font-weight: 900;
    margin-bottom: 8px;
  }
  .pm-exito-screen p { color: var(--mid); font-size: .95rem; margin-bottom: 28px; }
  .pm-exito-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 22px;
    border-radius: 100px;
    font-weight: 700;
    font-size: .9rem;
    margin-bottom: 32px;
    border: 2px solid;
  }

  /* ROL GRID (registro) */
  .pm-bloque-label {
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--brand);
    display: block;
    margin-bottom: 14px;
  }
  .pm-rol-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 32px;
  }
  .pm-rol-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    padding: 20px 12px;
    border: 2px solid var(--border);
    border-radius: 18px;
    cursor: pointer;
    transition: all .2s;
    text-align: center;
    background: #fff;
  }
  .pm-rol-label:hover { border-color: var(--brand); background: #FFF8F5; }
  .pm-rol-label--selected {
    border-color: var(--brand);
    background: #FFF0EA;
    box-shadow: 0 0 0 4px rgba(232,82,26,.10);
  }
  .pm-rol-icon { font-size: 2rem; }
  .pm-rol-name { font-weight: 700; font-size: .88rem; color: var(--dark); }
  .pm-rol-desc { font-size: .75rem; color: var(--mid); line-height: 1.3; }

  /* DIVISOR */
  .pm-divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }

  /* GRID 2 COLUMNAS */
  .pm-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* ANIMACIÓN */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 560px) {
    .pm-nav { padding: 0 16px; }
    .pm-card { padding: 34px 20px; }
    .pm-row2 { grid-template-columns: 1fr; }
    .pm-rol-grid { grid-template-columns: 1fr; }
  }
`;

// ─── Componente: Navbar ───────────────────────────────────────
function Navbar({ onLogoClick }) {
  return (
    <nav className="pm-nav">
      <button className="pm-logo" onClick={onLogoClick}>
        Paw<em>Match</em> 🐾
      </button>
      <button className="pm-back-btn" onClick={onLogoClick}>
        ← Volver al inicio
      </button>
    </nav>
  );
}

// ─── Componente: LoginPage ────────────────────────────────────
function LoginPage({ onGoRegistro }) {
  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [msg, setMsg] = useState("");
  const [usuario, setUsuario] = useState(null);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    const { correo, contrasena } = form;
    if (!correo || !contrasena) {
      setMsg("Por favor completa todos los campos.");
      return;
    }
    // En producción aquí va el fetch al backend PHP
    // Simulación: usuario de prueba
    setMsg("No encontramos ninguna cuenta con ese correo.");
  };

  const rol = usuario?.rol ?? "adoptante";
  const rolData = ROLES[rol] ?? ROLES.adoptante;

  return (
    <div className="pm-page-wrap">
      <div className="pm-card">
        {usuario ? (
          <div className="pm-bienvenida">
            <div
              className="pm-bv-avatar"
              style={{ background: rolData.bg, borderColor: rolData.border }}
            >
              {rolData.icono}
            </div>
            <h2 className="pm-bv-nombre">¡Hola, {usuario.nombres}! 👋</h2>
            <p className="pm-bv-sub">Sesión iniciada correctamente</p>
            <div
              className="pm-bv-badge"
              style={{ background: rolData.bg, color: rolData.color, borderColor: rolData.border }}
            >
              {rolData.icono} {rolData.label}
            </div>
            <br />
            <button className="pm-btn-home">Ir al inicio 🐾</button>
          </div>
        ) : (
          <>
            <div className="pm-card-head">
              <span className="top-emoji">🐾</span>
              <h1>¡Hola de <em>nuevo</em>!</h1>
              <p>Inicia sesión para continuar en PawMatch</p>
            </div>

            {msg && (
              <div className="pm-alert pm-alert--error">
                <span className="pm-alert-ico">⚠️</span>
                {msg}
              </div>
            )}

            <div className="pm-campo">
              <label htmlFor="correo-login">Correo electrónico</label>
              <input
                type="email"
                id="correo-login"
                name="correo"
                placeholder="tu@correo.com"
                value={form.correo}
                onChange={handleChange}
              />
            </div>
            <div className="pm-campo">
              <label htmlFor="contrasena-login">Contraseña</label>
              <input
                type="password"
                id="contrasena-login"
                name="contrasena"
                placeholder="Tu contraseña"
                value={form.contrasena}
                onChange={handleChange}
              />
            </div>

            <button className="pm-btn-submit" onClick={handleSubmit}>
              Iniciar sesión 🐾
            </button>
          </>
        )}

        <p className="pm-card-foot">
          ¿No tienes cuenta?{" "}
          <button onClick={onGoRegistro}>Regístrate aquí</button>
        </p>
      </div>
    </div>
  );
}

// ─── Componente: RegistroPage ─────────────────────────────────
function RegistroPage({ onGoLogin }) {
  const [form, setForm] = useState({
    rol: "",
    nombres: "", apellidos: "",
    cedula: "", telefono: "",
    correo: "",
    contrasena: "", confirmar: "",
  });
  const [msg, setMsg] = useState({ texto: "", tipo: "" });
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
    if (error) {
      setMsg({ texto: error, tipo: "error" });
      return;
    }
    // En producción aquí va el fetch al backend PHP
    setExitoso(true);
    setMsg({ texto: "", tipo: "" });
  };

  const rolData = ROLES[form.rol];

  return (
    <div className="pm-page-wrap">
      <div className="pm-card pm-card--wide">
        {exitoso ? (
          <div className="pm-exito-screen">
            <span className="pm-exito-icon">🎉</span>
            <h2>¡Bienvenido/a a PawMatch!</h2>
            <p>Tu cuenta ha sido creada exitosamente.</p>
            {rolData && (
              <div
                className="pm-exito-badge"
                style={{ background: rolData.bg, color: rolData.color, borderColor: rolData.border }}
              >
                {rolData.icono} {rolData.label}
              </div>
            )}
            <br />
            <button className="pm-btn-home" onClick={onGoLogin}>
              Iniciar sesión 🐾
            </button>
          </div>
        ) : (
          <>
            <div className="pm-card-head">
              <span className="top-emoji">🐾</span>
              <h1>Crea tu <em>cuenta</em></h1>
              <p>Únete y encuentra a tu compañero ideal</p>
            </div>

            {msg.texto && (
              <div className={`pm-alert pm-alert--${msg.tipo}`}>
                <span className="pm-alert-ico">⚠️</span>
                {msg.texto}
              </div>
            )}

            {/* SELECCIÓN DE ROL */}
            <span className="pm-bloque-label">¿Cuál es tu rol?</span>
            <div className="pm-rol-grid">
              {Object.entries(ROLES).map(([val, r]) => (
                <button
                  key={val}
                  type="button"
                  className={`pm-rol-label${form.rol === val ? " pm-rol-label--selected" : ""}`}
                  onClick={() => setRol(val)}
                >
                  <span className="pm-rol-icon">{r.icono}</span>
                  <span className="pm-rol-name">{r.label}</span>
                  <span className="pm-rol-desc">{r.desc}</span>
                </button>
              ))}
            </div>

            <hr className="pm-divider" />

            {/* NOMBRES Y APELLIDOS */}
            <div className="pm-row2">
              <div className="pm-campo">
                <label>Nombres *</label>
                <input name="nombres" placeholder="Ej: María Fernanda" value={form.nombres} onChange={handleChange} />
              </div>
              <div className="pm-campo">
                <label>Apellidos *</label>
                <input name="apellidos" placeholder="Ej: García López" value={form.apellidos} onChange={handleChange} />
              </div>
            </div>

            {/* CÉDULA Y TELÉFONO */}
            <div className="pm-row2">
              <div className="pm-campo">
                <label>Cédula *</label>
                <input name="cedula" placeholder="Ej: 1020304050" value={form.cedula} onChange={handleChange} />
              </div>
              <div className="pm-campo">
                <label>Teléfono *</label>
                <input name="telefono" type="tel" placeholder="Ej: 3001234567" value={form.telefono} onChange={handleChange} />
              </div>
            </div>

            {/* CORREO */}
            <div className="pm-campo">
              <label>Correo electrónico *</label>
              <input name="correo" type="email" placeholder="tu@correo.com" value={form.correo} onChange={handleChange} />
            </div>

            <hr className="pm-divider" />

            {/* CONTRASEÑAS */}
            <div className="pm-row2">
              <div className="pm-campo">
                <label>Contraseña *</label>
                <input name="contrasena" type="password" placeholder="Mín. 6 caracteres" value={form.contrasena} onChange={handleChange} />
              </div>
              <div className="pm-campo">
                <label>Confirmar contraseña *</label>
                <input name="confirmar" type="password" placeholder="Repite tu contraseña" value={form.confirmar} onChange={handleChange} />
              </div>
            </div>

            <button className="pm-btn-submit pm-btn-submit--top" onClick={handleSubmit}>
              Crear mi cuenta 🐾
            </button>
          </>
        )}

        <p className="pm-card-foot">
          ¿Ya tienes cuenta?{" "}
          <button onClick={onGoLogin}>Inicia sesión aquí</button>
        </p>
      </div>
    </div>
  );
}

// ─── Componente raíz ─────────────────────────────────────────
export default function PawMatchAuth() {
  const [pagina, setPagina] = useState("login"); // "login" | "registro"

  return (
    <>
      <style>{estilos}</style>
      <div className="pawmatch-root">
        <Navbar onLogoClick={() => setPagina("login")} />
        {pagina === "login" ? (
          <LoginPage onGoRegistro={() => setPagina("registro")} />
        ) : (
          <RegistroPage onGoLogin={() => setPagina("login")} />
        )}
      </div>
    </>
  );
}
