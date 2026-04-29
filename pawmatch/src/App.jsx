// ─── App.jsx ─────────────────────────────────────────────────
// Enrutador principal de PawMatch - conecta Home, Login y Registro

import { useState } from "react";
import PawMatchHome     from "./PawMatchHome";
import PawMatchRegistro from "./PawMatchRegistro";
import PawMatchAuth     from "./PawMatch_Auth";
import PawAdoptDashboard from "./PawAdoptDashboard";
import PetDetail from "./PetDetail";
import PawRescatPanel from "./PawRescatPanel";

// Flujo de enrutamiento simple en el cliente
export default function App() {
  const [route, setRoute] = useState("home"); // posibles: home, login, registro, inicio, rescatista, refugio
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
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);

  const handleLogout = () => {
    // Limpiar sesión local
    localStorage.removeItem("pawmatch_user");
    setRoute("home");
  };

  const handleSolicitar = (mascota) => {
    const user = JSON.parse(localStorage.getItem("pawmatch_user"));
    const adop = user?.nombres || "Usuario";
    const solicitud = { id: Date.now(), mascotaId: mascota.id, mascotaNombre: mascota.nombre, adoptante: adop, estado: "pendiente" };
    setSolicitudes([solicitud, ...solicitudes]);
  };

  const handleOpenDetail = (mascota) => {
    setSelectedPet(mascota);
  };

  const handleCloseDetail = () => setSelectedPet(null);

  // Componentes de rutas simples (placeholders para roles)
  const InicioPage = () => (
    <div style={{ padding: 40 }}>
      <h2>Bienvenido</h2>
      <p>Panel de usuario Adoptante. Aquí iría el dashboard real.</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
  const RescatistaPage = () => (
    <div style={{ padding: 40 }}>
      <h2>Bienvenido, Rescatista</h2>
      <p>Panel de usuario Rescatista. Aquí iría el dashboard real.</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
  const RefugioPage = () => (
    <div style={{ padding: 40 }}>
      <h2>Bienvenido, Refugio</h2>
      <p>Panel de usuario Refugio. Aquí iría el dashboard real.</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );

  return (
    <>
      {route === "home" && (
        <PawMatchHome
          onLogin={() => setRoute("login")}
          onRegistro={() => setRoute("registro")}
        />
      )}

      {route === "login" && (
        <PawMatchAuth
          onVolver={() => setRoute("home")}
          onRegistro={() => setRoute("registro")}
          onNavigate={(rol) => {
            // Mapeo de roles a rutas internas
            if (rol === "adoptante") setRoute("inicio");
            else if (rol === "rescatista") setRoute("rescatista");
            else if (rol === "refugio") setRoute("refugio");
            else setRoute("inicio");
          }}
        />
      )}

      {route === "registro" && (
        <PawMatchRegistro
          onVolver={() => setRoute("home")}
          onLogin={() => setRoute("login")}
        />
      )}

      {route === "inicio" && (
        <PawAdoptDashboard
          user={JSON.parse(localStorage.getItem("pawmatch_user"))}
          mascotas={mascotas}
          onLogout={handleLogout}
          onSolicitar={handleSolicitar}
          onOpenDetail={handleOpenDetail}
        />
      )}
      {route === "rescatista" && <PawRescatPanel onLogout={handleLogout} />}
      {route === "refugio" && <PawRescatPanel onLogout={handleLogout} />}
      {selectedPet && (
        <PetDetail mascota={selectedPet} onClose={handleCloseDetail} />
      )}
    </>
  );
}
