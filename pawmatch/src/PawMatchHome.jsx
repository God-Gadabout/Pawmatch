// ─── PawMatchHome.jsx ────────────────────────────────────────
// Landing page principal de PawMatch convertida de Pawmatch.php

const DATOS = {
  nombre: "PawMatch",
  año: 2025,
  descripcion:
    "Conecta adoptantes con mascotas mediante un sistema de emparejamiento inteligente, basado en tu estilo de vida y las necesidades del animal.",
};

const PASOS = [
  { icono: "📋", titulo: "Crea tu perfil",       desc: "Cuéntanos sobre tu estilo de vida, espacio y disponibilidad de tiempo." },
  { icono: "🤖", titulo: "El algoritmo trabaja", desc: "Analizamos compatibilidad entre tú y las mascotas disponibles en refugios." },
  { icono: "❤️", titulo: "¡Haz el match!",       desc: "Conoce a tu compañero ideal y coordina la adopción de forma segura." },
];

const PILARES = [
  { num: "01", titulo: "Investigación de Usuario", desc: "Analizamos las causas de fallo en adopciones y el comportamiento de los refugios." },
  { num: "02", titulo: "Marco Teórico",            desc: "Estudio de bienestar animal y algoritmos de recomendación (Matchmaking)." },
  { num: "03", titulo: "Metodología Ágil",         desc: "Usamos Scrum y Design Thinking para un desarrollo iterativo centrado en el usuario." },
];

const STATS = [
  { valor: "2,400+", label: "Mascotas en adopción" },
  { valor: "180+",   label: "Refugios aliados" },
  { valor: "94%",    label: "Adopciones exitosas" },
];

// ─── Estilos ──────────────────────────────────────────────────
const estilos = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  :root {
    --brand:    #E8521A;
    --brand-lt: #FF7A45;
    --accent:   #F5C842;
    --teal:     #0BB8A0;
    --dark:     #1A1208;
    --mid:      #6B5540;
    --light:    #FDF6EE;
    --border:   #EDE5D8;
  }

  .pm-home {
    font-family: 'DM Sans', sans-serif;
    background: var(--light);
    color: var(--dark);
    overflow-x: hidden;
  }

  /* ── NAVBAR ── */
  .pm-nav {
    position: sticky; top: 0; z-index: 200;
    background: rgba(253,246,238,.93);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 64px; height: 68px;
  }
  .pm-logo {
    font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.55rem;
    color: var(--dark); text-decoration: none; letter-spacing: -0.5px;
    background: none; border: none; cursor: pointer;
  }
  .pm-logo em { color: var(--brand); font-style: normal; }

  .pm-nav-links { display: flex; list-style: none; gap: 32px; align-items: center; }
  .pm-nav-links a {
    text-decoration: none; color: var(--mid); font-size: .9rem;
    font-weight: 500; transition: color .2s;
  }
  .pm-nav-links a:hover { color: var(--brand); }

  .pm-nav-actions { display: flex; gap: 10px; align-items: center; }

  .pm-btn-ghost {
    background: none; color: var(--brand); font-family: 'DM Sans', sans-serif;
    font-weight: 600; font-size: .88rem; padding: 9px 20px;
    border: 1.5px solid var(--brand); border-radius: 100px;
    cursor: pointer; transition: all .2s;
  }
  .pm-btn-ghost:hover { background: var(--brand); color: #fff; }

  .pm-btn-solid {
    background: var(--brand); color: #fff; font-family: 'DM Sans', sans-serif;
    font-weight: 600; font-size: .88rem; padding: 9px 20px;
    border: none; border-radius: 100px;
    box-shadow: 0 2px 12px rgba(232,82,26,.28);
    cursor: pointer; transition: all .2s;
  }
  .pm-btn-solid:hover { background: var(--brand-lt); transform: translateY(-1px); box-shadow: 0 4px 18px rgba(232,82,26,.35); }

  /* ── HERO ── */
  .pm-hero {
    min-height: calc(100vh - 68px);
    display: grid; grid-template-columns: 1fr 1fr;
    align-items: center; padding: 0 64px; gap: 60px;
    position: relative; overflow: hidden;
  }
  .pm-hero::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 70% at 82% 40%, rgba(245,200,66,.16) 0%, transparent 65%),
      radial-gradient(ellipse 40% 50% at 10% 80%, rgba(11,184,160,.09) 0%, transparent 60%);
  }
  .pm-hero-content { position: relative; z-index: 1; }

  .pm-hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(232,82,26,.10); color: var(--brand);
    font-size: .78rem; font-weight: 700; padding: 6px 14px;
    border-radius: 100px; margin-bottom: 26px; letter-spacing: .4px;
  }
  .pm-hero-tag::before { content: '●'; font-size: .5rem; animation: pmBlink 2s infinite; }
  @keyframes pmBlink { 0%,100%{opacity:1} 50%{opacity:.25} }

  .pm-hero h1 {
    font-family: 'Fraunces', serif;
    font-size: clamp(2.6rem,4.2vw,3.8rem);
    font-weight: 900; line-height: 1.07; letter-spacing: -1.5px; margin-bottom: 22px;
  }
  .pm-hero h1 em { color: var(--brand); font-style: italic; }

  .pm-hero-desc {
    font-size: 1.03rem; color: var(--mid);
    line-height: 1.75; max-width: 430px; margin-bottom: 36px;
  }

  .pm-hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }

  .pm-btn-hero-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--brand); color: #fff;
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 1rem;
    padding: 14px 30px; border-radius: 100px; border: none;
    box-shadow: 0 4px 20px rgba(232,82,26,.32); cursor: pointer; transition: all .25s;
  }
  .pm-btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(232,82,26,.40); background: var(--brand-lt); }

  .pm-btn-hero-sec {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--dark);
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 1rem;
    padding: 14px 26px; border-radius: 100px;
    border: 1.5px solid var(--border); cursor: pointer; transition: all .25s;
  }
  .pm-btn-hero-sec:hover { border-color: var(--dark); background: rgba(0,0,0,.04); }

  .pm-hero-stats {
    display: flex; gap: 36px; margin-top: 50px;
    padding-top: 30px; border-top: 1px solid var(--border);
  }
  .pm-stat-val { font-family: 'Fraunces', serif; font-size: 1.9rem; font-weight: 700; line-height: 1; }
  .pm-stat-lbl { font-size: .78rem; color: var(--mid); margin-top: 4px; }

  /* Hero visual */
  .pm-hero-visual {
    display: flex; justify-content: center;
    align-items: center; position: relative;
  }
  .pm-hero-bubble {
    width: 400px; height: 400px;
    background: radial-gradient(circle at 35% 35%, var(--accent), var(--brand) 70%);
    border-radius: 60% 40% 55% 45% / 50% 55% 45% 50%;
    display: flex; align-items: center; justify-content: center; font-size: 9rem;
    animation: pmMorph 8s ease-in-out infinite, pmFloat 4s ease-in-out infinite;
    box-shadow: 0 30px 80px rgba(232,82,26,.28);
  }
  @keyframes pmMorph {
    0%,100%{ border-radius:60% 40% 55% 45%/50% 55% 45% 50% }
    33%    { border-radius:45% 55% 40% 60%/55% 45% 55% 45% }
    66%    { border-radius:50% 50% 60% 40%/40% 60% 50% 50% }
  }
  @keyframes pmFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }

  .pm-hero-chip {
    position: absolute; background: #fff; border-radius: 16px;
    padding: 11px 17px; box-shadow: 0 6px 28px rgba(0,0,0,.10);
    font-size: .8rem; font-weight: 600;
    display: flex; align-items: center; gap: 8px; white-space: nowrap;
  }
  .pm-chip-1 { top: 40px; right: 10px; }
  .pm-chip-2 { bottom: 55px; left: 5px; }
  .pm-chip-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--teal); }

  /* ── SECCIÓN BASE ── */
  .pm-section { padding: 100px 64px; }
  .pm-section-label {
    display: inline-block; font-size: .72rem; font-weight: 700;
    letter-spacing: 2.5px; text-transform: uppercase;
    color: var(--brand); margin-bottom: 12px;
  }
  .pm-section-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(1.8rem,3vw,2.6rem);
    font-weight: 900; letter-spacing: -1px; line-height: 1.15; margin-bottom: 14px;
  }
  .pm-section-sub {
    color: var(--mid); font-size: 1rem; max-width: 500px;
    line-height: 1.7; margin-bottom: 52px;
  }

  /* ── STEPS ── */
  .pm-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; }
  .pm-step-card {
    background: #fff; border: 1px solid var(--border); border-radius: 24px;
    padding: 36px 28px; position: relative; overflow: hidden;
    transition: transform .25s, box-shadow .25s;
  }
  .pm-step-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,.08); }
  .pm-step-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, var(--brand), var(--accent));
    border-radius: 24px 24px 0 0;
  }
  .pm-step-num {
    font-family: 'Fraunces', serif; font-size: 3.5rem; font-weight: 900;
    color: var(--border); line-height: 1; margin-bottom: 8px;
  }
  .pm-step-icon { font-size: 2rem; display: block; margin-bottom: 14px; }
  .pm-step-card h3 { font-family: 'Fraunces', serif; font-size: 1.2rem; font-weight: 700; margin-bottom: 10px; }
  .pm-step-card p { font-size: .9rem; color: var(--mid); line-height: 1.65; }

  /* ── PILARES DARK ── */
  .pm-section-dark { background: var(--dark); color: var(--light); padding: 100px 64px; }
  .pm-section-dark .pm-section-label { color: var(--accent); }
  .pm-section-dark .pm-section-title { color: #FDF6EE; }
  .pm-section-dark .pm-section-sub { color: #A89880; }

  .pm-pillars { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  .pm-pillar-card {
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08);
    border-radius: 20px; padding: 32px 26px; transition: background .25s;
  }
  .pm-pillar-card:hover { background: rgba(255,255,255,.09); }
  .pm-pillar-num { font-family: 'Fraunces', serif; font-size: 2.2rem; font-weight: 700; color: var(--brand-lt); margin-bottom: 12px; }
  .pm-pillar-card h3 { font-size: 1.03rem; font-weight: 600; margin-bottom: 10px; }
  .pm-pillar-card p { font-size: .87rem; color: #A89880; line-height: 1.65; }

  /* ── DIFERENCIAL ── */
  .pm-dif-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .pm-dif-visual {
    background: linear-gradient(135deg, var(--accent) 0%, var(--brand) 100%);
    border-radius: 32px; height: 380px;
    display: flex; align-items: center; justify-content: center;
    font-size: 8rem; box-shadow: 0 20px 60px rgba(232,82,26,.22);
  }
  .pm-dif-texto h2 {
    font-family: 'Fraunces', serif;
    font-size: clamp(1.8rem,2.8vw,2.5rem);
    font-weight: 900; letter-spacing: -1px; line-height: 1.15; margin-bottom: 16px;
  }
  .pm-dif-texto h2 em { color: var(--teal); font-style: italic; }
  .pm-dif-texto p { color: var(--mid); font-size: 1rem; line-height: 1.75; }
  .pm-dif-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(11,184,160,.12); color: var(--teal);
    font-weight: 700; font-size: .85rem; padding: 8px 18px;
    border-radius: 100px; margin-top: 22px;
  }

  /* ── CTA FINAL ── */
  .pm-cta-sec {
    padding: 100px 64px; text-align: center;
    background: linear-gradient(135deg,#FFF0E6 0%,#FDF6EE 50%,#E6FBF7 100%);
  }
  .pm-cta-sec h2 {
    font-family: 'Fraunces', serif;
    font-size: clamp(2rem,3.5vw,3rem);
    font-weight: 900; letter-spacing: -1px; margin-bottom: 14px;
  }
  .pm-cta-sec p { color: var(--mid); font-size: 1.03rem; margin-bottom: 34px; }

  /* ── FOOTER ── */
  .pm-footer {
    background: var(--dark); color: #A89880;
    text-align: center; padding: 34px 64px; font-size: .88rem;
  }
  .pm-footer strong { color: var(--brand-lt); }
  .pm-footer p + p { margin-top: 8px; }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .pm-nav { padding: 0 20px; }
    .pm-nav-links { display: none; }
    .pm-hero { grid-template-columns: 1fr; padding: 56px 20px; min-height: auto; gap: 32px; }
    .pm-hero-visual { display: none; }
    .pm-section, .pm-section-dark { padding: 70px 20px; }
    .pm-steps, .pm-pillars { grid-template-columns: 1fr; }
    .pm-dif-wrap { grid-template-columns: 1fr; gap: 36px; }
    .pm-dif-visual { height: 220px; font-size: 5rem; }
    .pm-cta-sec { padding: 70px 20px; }
    .pm-footer { padding: 26px 20px; }
  }
`;

// ─── Componente principal ─────────────────────────────────────
export default function PawMatchHome({ onLogin, onRegistro }) {
  const scrollA = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{estilos}</style>
      <div className="pm-home">

        {/* NAVBAR */}
        <nav className="pm-nav">
          <button className="pm-logo">
            Paw<em>Match</em> 🐾
          </button>
          <ul className="pm-nav-links">
            <li><a href="#como"        onClick={(e) => { e.preventDefault(); scrollA("como"); }}>¿Cómo funciona?</a></li>
            <li><a href="#pilares"     onClick={(e) => { e.preventDefault(); scrollA("pilares"); }}>Pilares</a></li>
            <li><a href="#diferencial" onClick={(e) => { e.preventDefault(); scrollA("diferencial"); }}>Nosotros</a></li>
          </ul>
          <div className="pm-nav-actions">
            <button className="pm-btn-ghost" onClick={onLogin}>Iniciar sesión</button>
            <button className="pm-btn-solid" onClick={onRegistro}>Registrarse</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="pm-hero">
          <div className="pm-hero-content">
            <div className="pm-hero-tag">Adopción inteligente · Colombia 🇨🇴</div>
            <h1>
              Tu próximo<br />
              mejor amigo<br />
              te <em>espera</em>
            </h1>
            <p className="pm-hero-desc">{DATOS.descripcion}</p>
            <div className="pm-hero-ctas">
              <button className="pm-btn-hero-primary" onClick={onRegistro}>
                ¡Encuentra tu match! 🐾
              </button>
              <button className="pm-btn-hero-sec" onClick={() => scrollA("como")}>
                ¿Cómo funciona? →
              </button>
            </div>
            <div className="pm-hero-stats">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="pm-stat-val">{s.valor}</div>
                  <div className="pm-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pm-hero-visual">
            <div className="pm-hero-bubble">🐶</div>
            <div className="pm-hero-chip pm-chip-1">
              <span className="pm-chip-dot" />
              Match encontrado · 98%
            </div>
            <div className="pm-hero-chip pm-chip-2">❤️ 24 adopciones hoy</div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="pm-section" id="como">
          <span className="pm-section-label">Proceso</span>
          <h2 className="pm-section-title">
            Solo 3 pasos para<br />encontrar tu compañero
          </h2>
          <p className="pm-section-sub">
            Sin complicaciones ni formularios interminables. Te guiamos de principio a fin.
          </p>
          <div className="pm-steps">
            {PASOS.map((paso, i) => (
              <div className="pm-step-card" key={i}>
                <div className="pm-step-num">{String(i + 1).padStart(2, "0")}</div>
                <span className="pm-step-icon">{paso.icono}</span>
                <h3>{paso.titulo}</h3>
                <p>{paso.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PILARES */}
        <section className="pm-section-dark" id="pilares">
          <span className="pm-section-label">Fundamentos</span>
          <h2 className="pm-section-title">
            La base del proyecto {DATOS.nombre}
          </h2>
          <p className="pm-section-sub">
            Construido sobre investigación real, no suposiciones.
          </p>
          <div className="pm-pillars">
            {PILARES.map((p) => (
              <div className="pm-pillar-card" key={p.num}>
                <div className="pm-pillar-num">{p.num}</div>
                <h3>{p.titulo}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DIFERENCIAL */}
        <section className="pm-section" id="diferencial">
          <div className="pm-dif-wrap">
            <div className="pm-dif-visual">🏠🐕</div>
            <div className="pm-dif-texto">
              <span className="pm-section-label">Nuestra diferencia</span>
              <h2>
                No somos un catálogo,<br />
                somos tu <em>asesor</em>
              </h2>
              <p>
                A diferencia de las plataformas tradicionales, {DATOS.nombre} actúa como un guía activo
                que educa al adoptante y garantiza que cada match sea sostenible a largo plazo,
                promoviendo la tenencia responsable y reduciendo el abandono.
              </p>
              <div className="pm-dif-badge">✅ Adopción responsable garantizada</div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="pm-cta-sec">
          <h2>
            ¿Listo para encontrar<br />a tu compañero ideal?
          </h2>
          <p>Únete a miles de familias que ya encontraron su match perfecto.</p>
          <button
            className="pm-btn-hero-primary"
            style={{ fontSize: "1.05rem", padding: "16px 38px" }}
            onClick={onRegistro}
          >
            Crear mi cuenta gratis 🐾
          </button>
        </section>

        {/* FOOTER */}
        <footer className="pm-footer">
          <p>Hecho con ❤️ por el equipo <strong>{DATOS.nombre}</strong> · Proyecto de Grado {DATOS.año}</p>
          <p>Todos los derechos reservados · {DATOS.nombre} 🐾</p>
        </footer>

      </div>
    </>
  );
}
