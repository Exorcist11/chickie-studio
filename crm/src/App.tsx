import React from "react";
import { DevComponentsPage } from "./pages/DevComponentsPage";
import "./i18n";

export const App: React.FC = () => {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-warm-white text-ink">
      {isDev ? (
        <DevComponentsPage />
      ) : (
        <div className="p-12 text-center">
          <h2 className="font-serif text-2xl font-bold text-burgundy">Chickie Studio CRM - Production</h2>
        </div>
      )}
    </div>
  );
};

export default App;
