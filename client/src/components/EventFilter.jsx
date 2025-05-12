import { useState } from "react";

export default function EventFilter({ onFilter }) {
  const [criteria, setCriteria] = useState({
    location: "",
    date: "",
  });

  const handleChange = (e) => {
    setCriteria({
      ...criteria,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(criteria);
  };

  const handleReset = () => {
    const empty = { location: "", date: "" };
    setCriteria(empty);
    onFilter(empty);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        name="location"
        placeholder="Filtrer par lieu"
        value={criteria.location}
        onChange={handleChange}
        style={{ marginRight: "0.5rem" }}
      />
      <input
        name="date"
        type="date"
        value={criteria.date}
        onChange={handleChange}
        style={{ marginRight: "0.5rem" }}
      />
      <button type="submit" style={{ marginRight: "0.5rem" }}>
        Appliquer
      </button>
      <button type="button" onClick={handleReset}>
        Réinitialiser
      </button>
    </form>
  );
}
