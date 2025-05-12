import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // Charger l'événement
    fetch(`http://localhost:5000/api/events/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Événement introuvable");
        return res.json();
      })
      .then(setEvent)
      .catch(err => setMessage(err.message));

    // Charger l'utilisateur courant
    if (token) {
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUserId(data.id))
        .catch(() => {});
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Supprimer cet événement définitivement ?")) return;

    const token = localStorage.getItem("access_token");
    const res = await fetch(`http://localhost:5000/api/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      navigate("/");  // retour à l'accueil
    } else {
      const err = await res.json();
      setMessage(err.error || "Échec de la suppression");
    }
  };

  if (message) return <p style={{ color: "red" }}>{message}</p>;
  if (!event)   return <p>Chargement...</p>;

  const isCreator = userId === event.creator_id;

  return (
    <div>
      <h2>{event.title}</h2>
      <p><strong>Date :</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Lieu :</strong> {event.location}</p>
      <p><strong>Description :</strong> {event.description}</p>
      <p><strong>Places restantes :</strong> {event.available_seats} / {event.max_seats}</p>

      {isCreator && (
        <div style={{ marginTop: "1rem" }}>
          <Link to={`/events/${id}/edit`} style={{ marginRight: '1rem' }}>
            Modifier
          </Link>
          <button onClick={handleDelete} style={{ color: 'red' }}>
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}

export default EventDetails;

