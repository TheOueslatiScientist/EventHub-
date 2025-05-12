import { useEffect, useState } from "react";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Vous devez être connecté.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erreur serveur.");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelBooking = async (id) => {
    const token = localStorage.getItem("access_token");
    if (!window.confirm("Annuler cette réservation ?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Échec de l'annulation.");
      await res.json();
      fetchBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <h2>Mes réservations</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {bookings.length === 0 && !error && <p>Aucune réservation.</p>}

      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            {b.event_title} – {new Date(b.event_date).toLocaleString()} ({b.seat_count} place{b.seat_count > 1 ? "s" : ""})
            <button
              onClick={() => cancelBooking(b.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Annuler
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyBookings;
