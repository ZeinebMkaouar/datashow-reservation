import { useState, useEffect } from "react";
import { Calendar, Info } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";

const ProfessorSchedule = () => {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [slots, setSlots] = useState([]);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [schedRes, weekRes, roomRes, sessRes] = await Promise.all([
        api.get('/users/schedule'),
        api.get('/weeks'),
        api.get('/rooms'),
        api.get('/sessions')
      ]);

      const fetchedSlots = sessRes.data.map(s => ({
        name: s.name,
        time: `${s.startTime}-${s.endTime}`
      }));
      setSlots(fetchedSlots);
      
      // Initialize schedule with empty strings for all slots
      const initialSched = {};
      fetchedSlots.forEach(s => {
        initialSched[s.name] = { Mon: "", Tue: "", Wed: "", Thu: "", Fri: "", Sat: "" };
      });

      // Fill with backend data
      const dayMap = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri", saturday: "Sat" };
      Object.entries(dayMap).forEach(([beDay, feDay]) => {
        if (schedRes.data[beDay]) {
          Object.entries(schedRes.data[beDay]).forEach(([slot, room]) => {
            if (initialSched[slot] && room && room !== "false" && room !== false) {
              initialSched[slot][feDay] = room;
            }
          });
        }
      });

      setSchedule(initialSched);
      setRooms(roomRes.data);

      // Handle current week
      const today = new Date();
      today.setHours(0,0,0,0);
      const todayTime = today.getTime();
      const match = weekRes.data.find(w => {
        const start = new Date(w.weekStart).getTime();
        const end = start + 7 * 24 * 60 * 60 * 1000;
        return todayTime >= start && todayTime < end;
      });

      if (match) {
        const startDate = new Date(match.weekStart);
        const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
        setCurrentWeek({
          label: `${startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
          isOpen: match.isOpen
        });
      }
    } catch (error) {
      console.error("Failed to fetch schedule data:", error);
    } finally {
      setLoading(false);
    }
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const beDayMap = { Mon: "monday", Tue: "tuesday", Wed: "wednesday", Thu: "thursday", Fri: "friday", Sat: "saturday" };

  // Highlight today's column
  const todayIndex = new Date().getDay();
  const todayDayMap = { 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" };
  const todayDay = todayDayMap[todayIndex] || null;

  const handleSelectRoom = async (slot, day, roomName) => {
    const beDay = beDayMap[day];

    // Optimistic UI update
    setSchedule((prev) => ({
      ...prev,
      [slot]: { ...prev[slot], [day]: roomName },
    }));
    setEditing(null);

    try {
      await api.put('/users/schedule', {
        [beDay]: { [slot]: roomName }
      });
    } catch (error) {
      console.error("Failed to update schedule:", error);
      setConfirmModal({
        isOpen: true,
        title: "Error",
        message: "Failed to update schedule.",
        type: "error",
      });
      fetchSchedule();
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">Loading schedule...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <ConfirmModal
        {...confirmModal}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
      
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-8 h-8 text-primary" />
            My Schedule
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base mt-2">
            Click an empty slot to assign a room from the list. Click an assigned room to change or remove it.
          </p>
        </div>
        {currentWeek && (
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${currentWeek.isOpen ? 'bg-success/10 border-success/30 text-success' : 'bg-destructive/10 border-destructive/30 text-destructive'}`}>
            <Calendar className="w-4 h-4" />
            Current week: {currentWeek.label}
            <span className={`ml-1 px-2 py-0.5 rounded-md text-xs font-bold ${currentWeek.isOpen ? 'bg-success/20' : 'bg-destructive/20'}`}>
              {currentWeek.isOpen ? "OPEN" : "CLOSED"}
            </span>
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm flex items-start gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span className="text-muted-foreground">
          Your schedule is used for <strong className="text-foreground">Fast Booking</strong>. When you book a DataShow, the system automatically detects your room and slot from this table. Rooms are managed by the administration.
        </span>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl card-shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                Slot
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className={`px-4 lg:px-6 py-3 text-center text-sm font-semibold ${day === todayDay ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}
                >
                  {day}
                  {day === todayDay && <span className="block text-[10px] font-normal text-primary/70">Today</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {slots.map((slot) => (
              <tr key={slot.name} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 lg:px-6 py-3 text-sm font-medium text-foreground whitespace-nowrap">
                  {slot.name}{" "}
                  <span className="text-xs text-muted-foreground">({slot.time})</span>
                </td>
                {days.map((day) => {
                  const isEditing = editing?.slot === slot.name && editing?.day === day;
                  const isToday = day === todayDay;
                  const currentRoom = schedule[slot.name][day];
                  return (
                    <td
                      key={`${slot.name}-${day}`}
                      className={`px-4 lg:px-6 py-3 text-center ${isToday ? 'bg-primary/5' : ''}`}
                    >
                      {isEditing ? (
                        <select
                          autoFocus
                          value={currentRoom || ""}
                          onChange={(e) => handleSelectRoom(slot.name, day, e.target.value)}
                          onBlur={() => setEditing(null)}
                          className="w-full min-w-[100px] px-2 py-1 text-sm border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground text-center"
                        >
                          <option value="">— None —</option>
                          {rooms.map((room) => (
                            <option key={room._id} value={room.name}>
                              {room.name} (Bât. {room.building}){room.hasEquipment ? ' ✓ Equipped' : ''}
                            </option>
                          ))}
                        </select>
                      ) : currentRoom ? (
                        <button
                          onClick={() => setEditing({ slot: slot.name, day })}
                          className="inline-block px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium rounded-md transition-colors"
                        >
                          {currentRoom}
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditing({ slot: slot.name, day })}
                          className="inline-flex items-center justify-center w-full py-1.5 text-muted-foreground hover:bg-muted/50 rounded-md transition-colors text-xs font-medium border border-dashed border-border"
                        >
                          +
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfessorSchedule;
