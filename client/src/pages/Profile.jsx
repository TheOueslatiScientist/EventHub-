import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Profile() {
  const { token, user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, password: "" });
    }
  }, [user]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur profil");
      setUser(data);
      setMessage("Profil mis à jour !");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Mon profil</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="password"
          type="password"
          placeholder="Nouveau mot de passe"
          value={form.password}
          onChange={handleChange}
        /><br/>
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
}
