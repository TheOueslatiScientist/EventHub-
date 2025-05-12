import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [message, setMessage] = useState("");

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // 1) Enregistrement
      const resReg = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const dataReg = await resReg.json();
      if (!resReg.ok) throw new Error(dataReg.error || "Erreur inscription");

      // 2) Login automatique
      const resLogin = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const dataLogin = await resLogin.json();
      if (!resLogin.ok) throw new Error(dataLogin.error || "Erreur login");

      setToken(dataLogin.access_token);
      setUser(dataLogin.user);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
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
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
        /><br/>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}
