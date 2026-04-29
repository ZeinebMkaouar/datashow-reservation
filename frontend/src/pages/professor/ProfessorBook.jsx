import { useState } from "react";
import { BookOpen, AlertTriangle } from "lucide-react";

const ProfessorBook = () => {
  const [bookingType, setBookingType] = useState("fast");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const slots = [
    { id: "S1", label: "S1 (08:00-09:30)" },
    { id: "S2", label: "S2 (10:00-11:30)" },
    { id: "S3", label: "S3 (11:30-13:00)" },
    { id: "S4", label: "S4 (14:00-15:30)" },
    { id: "S5", label: "S5 (15:30-17:00)" },
    { id: "S6", label: "S6 (17:00-18:30)" },
  ];

  const roomsWithEquipment = ["A-101", "C-302"];
  const scheduleMap = {
    "Monday-S2": { room: "A-201", slot: "S2" },
    "Tuesday-S4": { room: "B-103", slot: "S4" },
    "Thursday-S1": { room: "A-201", slot: "S1" },
    "Thursday-S3": { room: "C-302", slot: "S3" },
  };

  const matched = bookingType === "fast" && selectedDay && selectedSlot ? scheduleMap[`${selectedDay}-${selectedSlot}`] : null;
  const effectiveRoom = bookingType === "fast" && matched ? matched.room : "";
  const isEquipped = roomsWithEquipment.includes(effectiveRoom);

  const handleSubmit = () => {
    if (selectedDay && selectedSlot) {
      alert(`Reservation submitted for ${selectedDay} - ${selectedSlot}`);
      setSelectedDay("");
      setSelectedSlot("");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          Book a DataShow
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base mt-2">
          Reserve a projector for your class or make-up session.
        </p>
      </div>

      {isEquipped && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Room already equipped</p>
            <p className="text-sm text-amber-700">
              Room {effectiveRoom} has a built-in TV/Projector. Are you sure you need a portable DataShow?
            </p>
          </div>
        </div>
      )}

      {/* Booking Type Tabs */}
      <div className="bg-card rounded-xl card-shadow p-6">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setBookingType("fast")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              bookingType === "fast"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Fast Booking
          </button>
          <button
            onClick={() => setBookingType("manual")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              bookingType === "manual"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Manual (Rattrapage)
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Day Selection */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Day
              </label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              >
                <option value="">Select day</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Slot Selection */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Slot
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              >
                <option value="">Select slot</option>
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {bookingType === "fast" && matched && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm">
              <span className="text-primary font-medium">
                Auto-filled from schedule:
              </span>{" "}
              Room {matched.room}
            </div>
          )}

          {bookingType === "manual" && (
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Room
              </label>
              <input
                placeholder="e.g. A-201"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
          >
            Submit Reservation
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          <strong className="text-primary">Fast Booking:</strong> Automatically assigns an available
          DataShow to your preferred slot.
        </p>
      </div>
    </div>
  );
};

export default ProfessorBook;
