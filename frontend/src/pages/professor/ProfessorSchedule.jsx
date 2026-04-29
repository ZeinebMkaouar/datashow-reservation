import { useState } from "react";
import { Calendar } from "lucide-react";

const ProfessorSchedule = () => {
  const [schedule, setSchedule] = useState({
    S1: { Mon: "", Tue: "", Wed: "", Thu: "A-201", Fri: "", Sat: "" },
    S2: { Mon: "A-201", Tue: "", Wed: "", Thu: "", Fri: "", Sat: "" },
    S3: { Mon: "", Tue: "", Wed: "", Thu: "C-302", Fri: "", Sat: "" },
    S4: { Mon: "", Tue: "B-103", Wed: "", Thu: "", Fri: "", Sat: "" },
    S5: { Mon: "", Tue: "", Wed: "", Thu: "", Fri: "", Sat: "" },
    S6: { Mon: "", Tue: "", Wed: "", Thu: "", Fri: "", Sat: "" },
  });

  const [editing, setEditing] = useState(null); // { slot: 'S1', day: 'Mon' }
  const [roomInput, setRoomInput] = useState("");

  const slots = [
    { name: "S1", time: "08:00-09:30" },
    { name: "S2", time: "10:00-11:30" },
    { name: "S3", time: "11:30-13:00" },
    { name: "S4", time: "14:00-15:30" },
    { name: "S5", time: "15:30-17:00" },
    { name: "S6", time: "17:00-18:30" },
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleSaveRoom = (slot, day) => {
    if (roomInput.trim() !== "") {
      setSchedule({
        ...schedule,
        [slot]: { ...schedule[slot], [day]: roomInput.trim() },
      });
    }
    setEditing(null);
  };

  const handleKeyDown = (e, slot, day) => {
    if (e.key === "Enter") {
      handleSaveRoom(slot, day);
    } else if (e.key === "Escape") {
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-8 h-8 text-primary" />
          My Schedule
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base mt-2">
          Click an empty slot to assign a room.
        </p>
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
                  className="px-4 lg:px-6 py-3 text-center text-sm font-semibold text-muted-foreground"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {slots.map((slot) => (
              <tr
                key={slot.name}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 lg:px-6 py-3 text-sm font-medium text-foreground whitespace-nowrap">
                  {slot.name}{" "}
                  <span className="text-xs text-muted-foreground">({slot.time})</span>
                </td>
                {days.map((day) => {
                  const isEditing = editing?.slot === slot.name && editing?.day === day;
                  return (
                    <td
                      key={`${slot.name}-${day}`}
                      className="px-4 lg:px-6 py-3 text-center"
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          value={roomInput}
                          onChange={(e) => setRoomInput(e.target.value)}
                          onBlur={() => handleSaveRoom(slot.name, day)}
                          onKeyDown={(e) => handleKeyDown(e, slot.name, day)}
                          placeholder="Room ID"
                          className="w-full min-w-[80px] px-2 py-1 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground text-center"
                        />
                      ) : schedule[slot.name][day] ? (
                        <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-md">
                          {schedule[slot.name][day]}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setEditing({ slot: slot.name, day });
                            setRoomInput("");
                          }}
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
