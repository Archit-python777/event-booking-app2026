import { useState, useEffect } from "react";

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        if (!response.ok) {
          throw new Error("Request failed");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError("Could not load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Upcoming Events</h1>
      {events.map((event) => (
        <div key={event._id}>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>
            {new Date(event.date).toLocaleDateString()} · {event.location}
          </p>
          <p>{event.totalSeats - event.seatsBooked} seats left</p>
        </div>
      ))}
    </div>
  );
}

export default App;