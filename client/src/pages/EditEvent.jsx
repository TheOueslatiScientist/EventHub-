import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    max_seats: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Charger l’événement existant
    fetch(`http://localhost:5000/api/events/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject("Non trouvé"))
      .then(data => {
        // format datetime-local yyyy-MM-DDThh:mm
        setForm({
          title: data.title,
          description: data.description,
          date: data.date.slice(0,16),
          location: data.location,
          max_seats: data.max_seats,
        });
      })
      .catch(err => setMessage(err));
  }, [id]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          max_seats: parseInt(form.max_seats, 10),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur mise à jour");
      navigate(`/events/${id}`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (message) return <p style={{ color: "red" }}>{message}</p>;
  if (!form.title) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Modifier l’événement</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          required
        /><br/>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="location"
          placeholder="Lieu"
          value={form.location}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="max_seats"
          type="number"
          placeholder="Nombre de places"
          value={form.max_seats}
          onChange={handleChange}
          required
        /><br/>
        <button type="submit">Sauvegarder</button>
      </form>
    </div>
  );
}
