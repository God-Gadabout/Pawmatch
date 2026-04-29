// ─── App.jsx ─────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import PawMatchHome      from "./PawMatchHome";
import PawMatchRegistro  from "./PawMatchRegistro";
import PawMatchAuth      from "./PawMatch_Auth";
import PawAdoptDashboard from "./PawAdoptDashboard";
import PawRescatPanel    from "./PawRescatPanel";

export default function App() {
  // Simple Hash-based Router (SPA-lite)
  const [route, setRoute] = useState(window.location.hash.replace(/^#/, '') || "/");
  // Bootstrap session and route on mount
  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.replace(/^#/, '') || "/");
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Bootstrap de sesión al cargar la app (persistencia de usuario)
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    const userStr = localStorage.getItem("pawmatch_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u?.rol) {
          const r = u.rol === 'adoptante' ? '/inicio' : (u.rol === 'rescatista' ? '/rescatista' : '/refugio');
          if (window.location.hash !== r) window.location.hash = r;
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const [solicitudes, setSolicitudes] = useState([]);
  const [mascotas, setMascotas] = useState([
    {
      id: 1,
      nombre: "Luna",
      especie: "perro",
      tamano: "mediano",
      ciudad: "Cartagena",
      descripcion: "Cariñosa y muy sociable. Le encantan los paseos largos.",
      fotos: ["https://placekitten.com/400/300", "https://placekitten.com/401/300"],
    },
    {
      id: 2,
      nombre: "Milo",
      especie: "gato",
      tamano: "pequeño",
      ciudad: "Bogotá",
      descripcion: "Juguetón y curioso. Se lleva bien con niños.",
      fotos: ["https://placekitten.com/402/300"],
    },
  ]);

  const navigate = (path) => {
    if (!path.startsWith('/')) path = '/' + path;
    if (window.location.hash !== path) window.location.hash = path;
    setRoute(path);
  };
  // Bootstrap de sesión al cargar la app (para que persista al refrescar)
  useEffect(() => {
    const bootstrap = async () => {
      const userStr = localStorage.getItem("pawmatch_user");
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u?.rol) {
            if (u.rol === "adoptante") setRoute("/inicio");
            else if (u.rol === "rescatista") setRoute("/rescatista");
            else if (u?.rol === "refugio") setRoute("/refugio");
          }
          return;
        } catch {
          // ignore parse errors
        }
      }
      // Intentar restaurar desde sesión de Supabase si existe
      try {
        const hasGetSession = typeof supabase?.auth?.getSession === "function";
        if (hasGetSession) {
          const { data } = await supabase.auth.getSession();
          const session = data?.session;
          const email = session?.user?.email;
          if (email) {
            const { data: usuario, error } = await supabase
              .from("usuarios")
              .select("nombres, apellidos, rol")
              .eq("correo", email)
              .single();
            if (!error && usuario?.rol) {
              if (usuario.rol === "adoptante") setRoute("inicio");
              else if (usuario.rol === "rescatista") setRoute("rescatista");
              else if (usuario.rol === "refugio") setRoute("refugio");
            }
          }
        }
      } catch {
        // ignore
      }
    };
    bootstrap().finally(() => setAuthLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("pawmatch_user");
    setRoute("home");
  };

  const handleSolicitar = (mascota) => {
    const user = JSON.parse(localStorage.getItem("pawmatch_user"));
    const adop = user?.nombres || "Usuario";
    const solicitud = { id: Date.now(), mascotaId: mascota.id, mascotaNombre: mascota.nombre, adoptante: adop, estado: "pendiente" };
    setSolicitudes([solicitud, ...solicitudes]);
  };

  const handleNavigate = (rol) => {
    if (rol === "rescatista" || rol === "refugio") setRoute("rescatista");
    else setRoute("inicio");
  };

  // Simple route rendering based on path
  const renderContent = () => {
    switch (route) {
      case '/':
      case '':
      case '/home':
        return (
          <PawMatchHome onLogin={() => navigate('/login')} onRegistro={() => navigate('/registro')} />
        );
      case '/login':
        return (
          <PawMatchAuth
            onVolver={() => navigate('/')}
            onRegistro={() => navigate('/registro')}
            onNavigate={ (rol) => {
              if (rol === 'adoptante') navigate('/inicio');
              else if (rol === 'rescatista') navigate('/rescatista');
              else if (rol === 'refugio') navigate('/refugio');
              else navigate('/inicio');
            }}
          />
        );
      case '/registro':
        return (
          <PawMatchRegistro onVolver={() => navigate('/')} onLogin={() => navigate('/login')} />
        );
      case '/inicio':
        return (
          <PawAdoptDashboard
            user={JSON.parse(localStorage.getItem("pawmatch_user") || "{}")}
            mascotas={mascotas}
            onLogout={handleLogout}
            onSolicitar={handleSolicitar}
          />
        );
      case '/rescatista':
        return <PawRescatPanel onLogout={handleLogout} />;
      case '/refugio':
        return <PawRescatPanel onLogout={handleLogout} />;
      default:
        return (
          <PawMatchHome onLogin={() => navigate('/login')} onRegistro={() => navigate('/registro')} />
        );
    }
  };

  return (
    <>
      {authLoading && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.7)', zIndex:9999 }}>
          <div style={{ padding: 20, borderRadius: 8, background: '#fff', border: '1px solid #eee' }}>Cargando sesión...</div>
        </div>
      )}
      {renderContent()}
    </>
  );
}
