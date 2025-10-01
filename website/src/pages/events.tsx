import { useEffect, useState } from "react";



function EventCard({ event }: { event: { id: number; name: string; name_eng: string; host: string; ip: string; opensAt: number } }) {
  const [timeLeft, setTimeLeft] = useState(event.opensAt - Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(event.opensAt - Math.floor(Date.now() / 1000), 0);
      setTimeLeft(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [event.opensAt]);


  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;


  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 w-80 flex flex-col justify-between border border-gray-200 dark:border-gray-700 transition hover:shadow-xl hover:scale-105 duration-300">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{event.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex gap-1">
          Хост: {event.host}

          {(event.host === "7Lime" || event.host === "DimaNelis" || event.host === "anekobtw") && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="#007bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 3a3.6 3.6 0 00-3.05 1.68 3.6 3.6 0 00-.9-.1 3.6 3.6 0 00-2.42 1.06 3.6 3.6 0 00-.94 3.32A3.6 3.6 0 003 12a3.6 3.6 0 001.69 3.05 3.6 3.6 0 00.95 3.32 3.6 3.6 0 003.35.96A3.6 3.6 0 0012 21a3.6 3.6 0 003.04-1.67 3.6 3.6 0 004.3-4.3A3.6 3.6 0 0021 12a3.6 3.6 0 00-1.67-3.04v0a3.6 3.6 0 00-4.3-4.3A3.6 3.6 0 0012 3z"></path> <path d="M15 10l-4 4"></path> <path d="M9 12l2 2"></path> </g></svg>
          )}
        </p>

      </div>

      <div className="mb-4">
        {timeLeft === 0 ? (
          <span className="text-green-500 font-semibold">
            Регистрация открыта!
          </span>
        ) : (
          <span className="text-gray-500 font-medium">
            Регистрация откроется через:<br /> {days > 0 && `${days}д `}{hours}ч {minutes}м {seconds}с
          </span>
        )}
      </div>

      <button
        disabled={timeLeft !== 0}
        className={`mt-auto font-semibold py-2 px-4 rounded-lg transition ${timeLeft === 0
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-400 text-gray-800 cursor-not-allowed"
          }`}
      >
        {timeLeft === 0
          ? "Зарегистрироваться"
          : `Откроется через ${days > 0 ? `${days}д ` : ""}${hours}ч ${minutes}м ${seconds}с`}
      </button>

    </div >
  );
}



export default function EventsModal() {
  const [eventsList, setEventsList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/events")
      .then(res => res.json())
      .then(data => setEventsList(data))
      .catch(console.error);
  }, []);

  return (
    <dialog id="events_modal" className="modal">
      <div className="modal-box justify-items-center">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <h3 className="font-bold text-xl mb-10">Ивенты</h3>

        <ul>
          {eventsList.map(event =>
            <EventCard event={event} />
          )}
        </ul>

      </div>
    </dialog>
  );
}
