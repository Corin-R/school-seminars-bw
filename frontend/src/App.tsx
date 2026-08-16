import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/Home";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <Routes>
      
      <Route element={
          <HomePage />
      } path="/" />
    </Routes>
  );
}

export default App;
