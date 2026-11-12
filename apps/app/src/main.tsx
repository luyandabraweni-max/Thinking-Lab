import "@tl/ui/tokens.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { createServices } from "./platform";

void createServices().then(services => {
  createRoot(document.getElementById("root")!).render(<StrictMode><App services={services} /></StrictMode>);
  // Sync when the app opens and whenever the signal comes back (docs/system-design.md, section 9).
  const sync = () => void services.syncNow().catch(() => {});
  sync();
  addEventListener("online", sync);
});
