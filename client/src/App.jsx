import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateEvent from "./pages/CreateEvent";
import MyBookings from "./pages/MyBookings";
import EventDetails from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";

function App() {
  const { token, setToken, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    // On nettoie le contexte et localStorage
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <Router>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Accueil</Link>
        {/* Si pas de token, on propose « Connexion » */}
        {!token && (
          <>
            {" "}| <Link to="/login">Connexion</Link>
          </>
        )}
        {/* Si token, on affiche les autres liens */}
        {token && (
          <>
            {" "}| <Link to="/create">Créer un événement</Link>
            {" "}| <Link to="/bookings">Mes réservations</Link>
            {" "}|{" "}
            <button onClick={handleLogout} style={{ cursor: "pointer" }}>
              Déconnexion
            </button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/edit" element={<EditEvent />} />
      </Routes>
    </Router>
  );
}

// On enveloppe l’app entière dans le provider
export default function WrappedApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
