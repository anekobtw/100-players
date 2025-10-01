
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  description: string;
  timestamp: number; // Unix time in ms
}

interface EventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
}

export default function EventsModal({ isOpen, onClose, events }: EventsModalProps) {
  if (!isOpen) return null;

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Upcoming Events</h2>
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {events.map((event) => (
              <li key={event.id} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{formatDate(event.timestamp)}</p>
                <p className="text-gray-700">{event.description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
