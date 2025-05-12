import { useState } from "react";

function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    max_seats: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // reset

    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessage("❌ Vous devez être connecté pour créer un événement.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          max_seats: parseInt(form.max_seats)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }

      setMessage("✅ Événement créé !");
      setForm({ title: "", description: "", date: "", location: "", max_seats: "" });

    } catch (error) {
      setMessage("❌ Erreur : " + error.message);
    }
  };

  return (
    <div>
      <h2>Créer un événement</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Titre" value={form.title} onChange={handleChange} required /><br />
        <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} required /><br />
        <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required /><br />
        <input type="text" name="location" placeholder="Lieu" value={form.location} onChange={handleChange} required /><br />
        <input type="number" name="max_seats" placeholder="Nombre de places" value={form.max_seats} onChange={handleChange} required /><br />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
}

export default CreateEvent;
