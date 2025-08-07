import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCalendarEvents, CalendarEvent } from "../../services/api/calendarApi";
import { auth } from "../../services/firebase";

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const user = auth.currentUser;

  useEffect(() => {
    if (user?.uid) {
      getCalendarEvents(user.uid).then(setEvents);
    }
  }, [user]);

  const filteredEvents = events.filter(event => event.date === selectedDate);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccine': return '💉';
      case 'medicine': return '💊';
      case 'vet': return '🏥';
      case 'breeding': return '❤️';
      case 'birth': return '👶';
      default: return '📅';
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Takvim ve Hatırlatıcılar</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="input"
        />
        <Link to="/calendar/create" className="btn-primary ml-auto">Yeni Etkinlik</Link>
      </div>
      
      <div className="bg-white rounded shadow p-6">
        <h3 className="font-bold text-lg mb-4">{new Date(selectedDate).toLocaleDateString('tr-TR')}</h3>
        <div className="space-y-3">
          {filteredEvents.map(event => (
            <div key={event.id} className="flex items-center gap-3 p-3 border rounded">
              <span className="text-2xl">{getEventTypeIcon(event.eventType)}</span>
              <div className="flex-1">
                <div className="font-semibold">{event.title}</div>
                <div className="text-sm text-gray-600">{event.petName} • {event.description}</div>
                {event.time && <div className="text-xs text-gray-500">{event.time}</div>}
              </div>
              <div className={`px-2 py-1 rounded text-xs ${
                event.isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {event.isCompleted ? 'Tamamlandı' : 'Bekliyor'}
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="text-gray-500 text-center py-8">Bu tarihte etkinlik yok.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage; 