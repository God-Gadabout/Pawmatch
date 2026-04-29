// ─── App.jsx ─────────────────────────────────────────────────
import { useState } from "react";
import PawMatchHome      from "./PawMatchHome";
import PawMatchRegistro  from "./PawMatchRegistro";
import PawMatchAuth      from "./PawMatch_Auth";
import PawAdoptDashboard from "./PawAdoptDashboard";
import PawRescatPanel    from "./PawRescatPanel";

export default function App() {
  const [route, setRoute] = useState("home");

  const handleLogout = () => {
    localStorage.removeItem("pawmatch_user");
    setRoute("home");
  };

  const handleNavigate = (rol) => {
    if (rol === "rescatista" || rol === "refugio") setRoute("rescatista");
    else setRoute("inicio");
  };

  return (
    <>
      {route === "home" && (
        <PawMatchHome
          onLogin={()    => setRoute("login")}
          onRegistro={() => setRoute("registro")}
        />
      )}

      {route === "login" && (
        <PawMatchAuth
          onVolver={()   => setRoute("home")}
          onRegistro={() => setRoute("registro")}
          onNavigate={handleNavigate}
        />
      )}

      {route === "registro" && (
        <PawMatchRegistro
          onVolver={() => setRoute("home")}
          onLogin={()   => setRoute("login")}
        />
      )}

      {route === "inicio" && (
        <PawAdoptDashboard
          user={JSON.parse(localStorage.getItem("pawmatch_user") || "{}")}
          onLogout={handleLogout}
        />
      )}

      {route === "rescatista" && (
        <PawRescatPanel onLogout={handleLogout} />
      )}
    </>
  );
}
