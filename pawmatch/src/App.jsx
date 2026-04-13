// ─── App.jsx ─────────────────────────────────────────────────
// Enrutador principal de PawMatch - conecta Home, Login y Registro

import { useState } from "react";
import PawMatchHome     from "./PawMatchHome";
import PawMatchRegistro from "./PawMatchRegistro";
import PawMatchAuth     from "./PawMatch_Auth";

// Páginas disponibles: "home" | "login" | "registro"
export default function App() {
  const [pagina, setPagina] = useState("home");

  return (
    <>
      {pagina === "home" && (
        <PawMatchHome
          onLogin={()    => setPagina("login")}
          onRegistro={()  => setPagina("registro")}
        />
      )}

      {pagina === "login" && (
        // PawMatchAuth maneja internamente login ↔ registro
        // pero puedes pasarle la página inicial como prop si lo separas
        <PawMatchAuth
          paginaInicial="login"
          onVolver={() => setPagina("home")}
        />
      )}

      {pagina === "registro" && (
        <PawMatchRegistro
          onVolver={() => setPagina("home")}
          onLogin={()   => setPagina("login")}
        />
      )}
    </>
  );
}