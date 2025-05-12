import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventFilter from "../components/EventFilter";

function Home() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState({ location: "", date: "" });

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then(setEvents)
      .catch((err) =>
        console.error("Erreur chargement événements :", err)
      );
  }, []);

  // Applique les critères de filtre
  const filteredEvents = events.filter((e) =>
    (!filter.location || e.location.includes(filter.location)) &&
    (!filter.date || e.date.startsWith(filter.date))
  );

  return (
    <div>
      <h2>Liste des événements</h2>

      {/* Formulaire de filtrage */}
      <EventFilter onFilter={setFilter} />

      {filteredEvents.length === 0 ? (
        <p>Aucun événement disponible.</p>
      ) : (
        <ul>
          {filteredEvents.map((event) => (
            <li key={event.id}>
              <strong>{event.title}</strong> – {event.location} (
              {new Date(event.date).toLocaleString()})
              {" "} | <Link to={`/events/${event.id}`}>Voir détails</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
