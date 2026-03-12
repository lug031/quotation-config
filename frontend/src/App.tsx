import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { IndirectCostsPage } from "./features/indirect-costs";
import { PlaceholderPage } from "./pages/PlaceholderPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/costos-indirectos" replace />} />
        <Route path="costos-indirectos" element={<IndirectCostsPage />} />
        <Route path="precios-base" element={<PlaceholderPage title="Precios Base" />} />
        <Route path="waste" element={<PlaceholderPage title="Waste" />} />
        <Route path="clientes" element={<PlaceholderPage title="Clientes" />} />
        <Route path="comisiones" element={<PlaceholderPage title="Comisiones" />} />
        <Route path="tipos-de-cambio" element={<PlaceholderPage title="Tipos de cambio" />} />
        <Route path="tasa-financiera-anual" element={<PlaceholderPage title="Tasa financiera anual" />} />
        <Route path="logistica" element={<PlaceholderPage title="Logística" />} />
        <Route path="embalaje-especial" element={<PlaceholderPage title="Embalaje especial" />} />
      </Route>
    </Routes>
  );
}

export default App;
