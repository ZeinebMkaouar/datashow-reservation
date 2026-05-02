import { useState, useEffect } from "react";
import { BookOpen, AlertTriangle, Info, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";

const ProfessorBook = () => {
  const [bookingType, setBookingType] = useState("fast");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDatashow, setSelectedDatashow] = useState("");
  
  const [availableDatashows, setAvailableDatashows] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [weeks, setWeeks] = useState([]);
  const [currentWeekStatus, setCurrentWeekStatus] = useState(null);
  const [rooms, setRooms] = useState([]);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const slots = [
    { id: "S1", label: "S1 (08:00-09:30)" },
    { id: "S2", label: "S2 (10:00-11:30)" },
    { id: "S3", label: "S3 (11:30-13:00)" },
    { id: "S4", label: "S4 (14:00-15:30)" },
    { id: "S5", label: "S5 (15:30-17:00)" },
    { id: "S6", label: "S6 (17:00-18:30)" },
  ];

  // Fetch weeks and rooms on mount
  useEffect(() => {
    api.get('/weeks').then(res => setWeeks(res.data)).catch(console.error);
    api.get('/rooms').then(res => setRooms(res.data)).catch(console.error);
  }, []);

  // Determine week status when date changes
  useEffect(() => {
    if (selectedDate && weeks.length > 0) {
      const dateObj = new Date(selectedDate);
      const targetTime = dateObj.getTime();
      
      const matchedWeek = weeks.find(w => {
        const start = new Date(w.weekStart).getTime();
        const end = start + 7 * 24 * 60 * 60 * 1000;
        return targetTime >= start && targetTime < end;
      });

      if (matchedWeek) {
        setCurrentWeekStatus({
          label: `Week of ${new Date(matchedWeek.weekStart).toLocaleDateString()}`,
          isOpen: matchedWeek.isOpen
        });
      } else {
        setCurrentWeekStatus({ label: "Unknown Week", isOpen: false });
      }
    } else {
      setCurrentWeekStatus(null);
    }
  }, [selectedDate, weeks]);

  // Fetch suggestion for fast booking
  useEffect(() => {
    if (bookingType === "fast" && selectedDate) {
      api.get(`/reservations/suggestion?date=${selectedDate}`)
        .then(res => {
          setSuggestion(res.data);
          // Auto-select the first suggestion if available
          if (res.data && res.data.suggestions && res.data.suggestions.length > 0) {
            setSelectedSlot(res.data.suggestions[0].seance);
            setSelectedRoom(res.data.suggestions[0].salle);
          } else {
            setSelectedSlot("");
            setSelectedRoom("");
          }
        })
        .catch(err => {
          console.error("No suggestion found:", err);
          setSuggestion(null);
        });
    }
  }, [bookingType, selectedDate]);

  // Handle slot change in fast booking when there are multiple suggestions
  const handleSlotChangeForFastBooking = (e) => {
    const newSlot = e.target.value;
    setSelectedSlot(newSlot);
    if (suggestion && suggestion.suggestions) {
      const match = suggestion.suggestions.find(s => s.seance === newSlot);
      if (match) setSelectedRoom(match.salle);
    }
  };

  // Fetch available datashows when date and slot are selected
  useEffect(() => {
    if (selectedDate && selectedSlot) {
      api.get(`/reservations/available?date=${selectedDate}&seance=${selectedSlot}`)
        .then(res => {
          setAvailableDatashows(res.data);
          if (res.data.length > 0) {
            setSelectedDatashow(res.data[0]._id); // auto-select first
          } else {
            setSelectedDatashow("");
          }
        })
        .catch(err => {
          console.error("Failed to fetch available datashows:", err);
          setAvailableDatashows([]);
        });
    }
  }, [selectedDate, selectedSlot]);

  // Reset fields when switching mode
  useEffect(() => {
    setError("");
    if (bookingType === "manual") {
      setSuggestion(null);
      setSelectedRoom("");
      setSelectedSlot("");
      setSelectedDatashow("");
    } else {
      setSelectedSlot("");
      setSelectedRoom("");
    }
  }, [bookingType]);

  const isRoomEquipped = (roomName) => {
    const room = rooms.find(r => r.name === roomName);
    return room?.hasEquipment;
  };

  const handleSubmit = async () => {
    setError("");
    if (!selectedDate || !selectedSlot || !selectedRoom || !selectedDatashow) {
      setError("Please fill all required fields and ensure a DataShow is available.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/reservations', {
        date: selectedDate,
        seance: selectedSlot,
        salle: selectedRoom,
        datashow: selectedDatashow,
        type: bookingType === "fast" ? "emploi" : "rattrapage"
      });
      setConfirmModal({
        isOpen: true,
        title: "Success",
        message: `Reservation submitted successfully for ${selectedDate} - ${selectedSlot}`,
        type: "success",
      });
      setSelectedDate("");
      setSelectedSlot("");
      setSelectedRoom("");
      setSelectedDatashow("");
      setSuggestion(null);
    } catch (error) {
      console.error("Booking error:", error);
      setError(error.response?.data?.message || "Failed to make reservation. Check constraints.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in relative">
      <ConfirmModal
        {...confirmModal}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />

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

      {/* Guide / Explication UX */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-sm text-foreground space-y-3">
        <h3 className="font-semibold text-primary flex items-center gap-2">
          <Info className="w-4 h-4" /> How does it work?
        </h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li><strong className="text-foreground">Fast Booking:</strong> The system automatically finds your class room and slot from your Schedule. Just pick a date!</li>
          <li><strong className="text-foreground">Manual (Rattrapage):</strong> Use this if you are scheduling a make-up class outside of your normal schedule.</li>
          <li>Reservations are only allowed for <strong className="text-foreground">Open Weeks</strong>.</li>
        </ul>
      </div>

      {/* Booking Type Tabs */}
      <div className="bg-card rounded-xl card-shadow p-6 border border-border">
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

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                1. Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              
              {/* Week Status Display */}
              {currentWeekStatus && (
                <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${currentWeekStatus.isOpen ? 'text-success' : 'text-destructive'}`}>
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {currentWeekStatus.label} is {currentWeekStatus.isOpen ? "OPEN" : "CLOSED"}
                </div>
              )}
            </div>

            {/* Slot Selection */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                2. Select Slot
              </label>
              {bookingType === "fast" ? (
                // Fast Booking Slot Selection
                <select
                  value={selectedSlot}
                  onChange={handleSlotChangeForFastBooking}
                  disabled={!suggestion || !suggestion.suggestions || suggestion.suggestions.length === 0}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground disabled:opacity-50"
                >
                  <option value="">
                    {(!suggestion || !suggestion.suggestions || suggestion.suggestions.length === 0) 
                      ? (selectedDate ? "No class found in your schedule" : "Select a date first") 
                      : "Select your class slot"}
                  </option>
                  {suggestion && suggestion.suggestions && suggestion.suggestions.map((s) => (
                    <option key={s.seance} value={s.seance}>
                      Slot {s.seance} (Room {s.salle})
                    </option>
                  ))}
                </select>
              ) : (
                // Manual Booking Slot Selection
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
              )}
            </div>
          </div>

          {/* Feedback Visuel Fast Booking */}
          {bookingType === "fast" && selectedSlot && selectedRoom && (
            <div className="p-4 rounded-lg bg-success/10 border border-success/20 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="text-success font-semibold block mb-1">
                    Class detected automatically!
                  </span>
                  We found your class in Room <span className="font-bold text-foreground">{selectedRoom}</span> for Seance <span className="font-bold text-foreground">{selectedSlot}</span>.
                </div>
              </div>
              
              {/* Room Equipment Warning */}
              {isRoomEquipped(selectedRoom) && (
                <div className="flex items-start gap-3 bg-warning/10 border border-warning/20 p-3 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
                  <div className="text-sm text-warning font-medium">
                    Note: This room already has a built-in projector/TV. You may not need a portable DataShow.
                  </div>
                </div>
              )}
            </div>
          )}

          {bookingType === "manual" && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Room
                </label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                >
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room.name}>
                      {room.name} (Bât. {room.building}){room.hasEquipment ? ' ✓ Equipped' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Equipment Warning for Manual Booking */}
              {selectedRoom && isRoomEquipped(selectedRoom) && (
                <div className="flex items-start gap-3 bg-warning/10 border border-warning/20 p-4 rounded-lg animate-in fade-in slide-in-from-top-1">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <span className="text-warning font-semibold block mb-1">Room Already Equipped</span>
                    Room <span className="font-bold text-foreground">{selectedRoom}</span> is already equipped with a built-in projector or TV. Do you still need a DataShow?
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DataShow Selection (Shows for both when date & slot selected) */}
          {selectedDate && selectedSlot && (
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-semibold text-foreground mb-3 flex justify-between">
                <span>3. Choose Equipment</span>
                <span className="text-muted-foreground font-normal">{availableDatashows.length} available</span>
              </label>
              <select
                value={selectedDatashow}
                onChange={(e) => setSelectedDatashow(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                disabled={availableDatashows.length === 0}
              >
                {availableDatashows.length === 0 ? (
                  <option value="">No datashows available for this slot</option>
                ) : (
                  availableDatashows.map(ds => (
                    <option key={ds._id} value={ds._id}>{ds.numero} - {ds.marque} {ds.modele}</option>
                  ))
                )}
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={submitting || !selectedDate || !selectedSlot || !selectedRoom || !selectedDatashow || (currentWeekStatus && !currentWeekStatus.isOpen)}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 mt-6"
          >
            {submitting ? "Submitting..." : "Confirm Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessorBook;
