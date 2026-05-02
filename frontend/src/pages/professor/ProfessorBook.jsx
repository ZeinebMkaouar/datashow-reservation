import { useState, useEffect } from "react";
import { BookOpen, AlertTriangle, Info, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";
import { useTranslation } from "react-i18next";

const ProfessorBook = () => {
  const { t } = useTranslation();
  const [bookingType, setBookingType] = useState("fast");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDatashow, setSelectedDatashow] = useState("");
  
  const [availableDatashows, setAvailableDatashows] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: "", message: "", type: "info", onConfirm: null,
  });

  const [weeks, setWeeks] = useState([]);
  const [currentWeekStatus, setCurrentWeekStatus] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/weeks'),
      api.get('/rooms'),
      api.get('/sessions')
    ]).then(([weeksRes, roomsRes, sessRes]) => {
      setWeeks(weeksRes.data);
      setRooms(roomsRes.data);
      setSlots(sessRes.data.map(s => ({
        id: s.name,
        label: `${s.name} (${s.startTime}-${s.endTime})`
      })));
    }).catch(console.error);
  }, []);

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
          label: t('profBook.weekOf', { date: new Date(matchedWeek.weekStart).toLocaleDateString() }),
          isOpen: matchedWeek.isOpen
        });
      } else {
        setCurrentWeekStatus({ label: t('profBook.unknownWeek'), isOpen: false });
      }
    } else {
      setCurrentWeekStatus(null);
    }
  }, [selectedDate, weeks, t]);

  useEffect(() => {
    if (bookingType === "fast" && selectedDate) {
      api.get(`/reservations/suggestion?date=${selectedDate}`)
        .then(res => {
          setSuggestion(res.data);
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

  const handleSlotChangeForFastBooking = (e) => {
    const newSlot = e.target.value;
    setSelectedSlot(newSlot);
    if (suggestion && suggestion.suggestions) {
      const match = suggestion.suggestions.find(s => s.seance === newSlot);
      if (match) setSelectedRoom(match.salle);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedSlot) {
      api.get(`/reservations/available?date=${selectedDate}&seance=${selectedSlot}`)
        .then(res => {
          setAvailableDatashows(res.data);
          if (res.data.length > 0) {
            setSelectedDatashow(res.data[0]._id);
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
      setError(t('profBook.fillAllFields'));
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
        title: t('common.success'),
        message: t('profBook.successMsg', { date: selectedDate, slot: selectedSlot }),
        type: "success",
      });
      setSelectedDate("");
      setSelectedSlot("");
      setSelectedRoom("");
      setSelectedDatashow("");
      setSuggestion(null);
    } catch (error) {
      console.error("Booking error:", error);
      setError(error.response?.data?.message || t('profBook.failMsg'));
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

      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          {t('profBook.title')}
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base mt-2">
          {t('profBook.subtitle')}
        </p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-sm text-foreground space-y-3">
        <h3 className="font-semibold text-primary flex items-center gap-2">
          <Info className="w-4 h-4" /> {t('profBook.howItWorks')}
        </h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li>{t('profBook.fastDesc')}</li>
          <li>{t('profBook.manualDesc')}</li>
          <li>{t('profBook.weekRule')}</li>
        </ul>
      </div>

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
            {t('profBook.fastBooking')}
          </button>
          <button
            onClick={() => setBookingType("manual")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              bookingType === "manual"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t('profBook.manualBooking')}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                {t('profBook.chooseDate')}
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              
              {currentWeekStatus && (
                <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${currentWeekStatus.isOpen ? 'text-success' : 'text-destructive'}`}>
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {currentWeekStatus.label} {t('profBook.weekIs')} {currentWeekStatus.isOpen ? t('common.open') : t('common.closed')}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                {t('profBook.chooseSlot')}
              </label>
              {bookingType === "fast" ? (
                <select
                  value={selectedSlot}
                  onChange={handleSlotChangeForFastBooking}
                  disabled={!suggestion || !suggestion.suggestions || suggestion.suggestions.length === 0}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground disabled:opacity-50"
                >
                  <option value="">
                    {(!suggestion || !suggestion.suggestions || suggestion.suggestions.length === 0) 
                      ? (selectedDate ? t('profBook.noClassFound') : t('profBook.selectDateFirst')) 
                      : t('profBook.selectSlot')}
                  </option>
                  {suggestion && suggestion.suggestions && suggestion.suggestions.map((s) => (
                    <option key={s.seance} value={s.seance}>
                      {t('profBook.slotRoom', { slot: s.seance, room: s.salle })}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                >
                  <option value="">{t('profBook.selectSlotManual')}</option>
                  {slots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {bookingType === "fast" && selectedSlot && selectedRoom && (
            <div className="p-4 rounded-lg bg-success/10 border border-success/20 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="text-success font-semibold block mb-1">
                    {t('profBook.autoDetected')}
                  </span>
                  {t('profBook.foundClass', { room: selectedRoom, slot: selectedSlot })}
                </div>
              </div>
              
              {isRoomEquipped(selectedRoom) && (
                <div className="flex items-start gap-3 bg-warning/10 border border-warning/20 p-3 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
                  <div className="text-sm text-warning font-medium">
                    {t('profBook.roomAlreadyEquipped')}
                  </div>
                </div>
              )}
            </div>
          )}

          {bookingType === "manual" && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  {t('common.room')}
                </label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                >
                  <option value="">{t('profBook.selectRoom')}</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room.name}>
                      {room.name} ({t('common.building')} {room.building}){room.hasEquipment ? t('profBook.roomEquipped') : ''}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRoom && isRoomEquipped(selectedRoom) && (
                <div className="flex items-start gap-3 bg-warning/10 border border-warning/20 p-4 rounded-lg animate-in fade-in slide-in-from-top-1">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <span className="text-warning font-semibold block mb-1">{t('profBook.roomEquippedTitle')}</span>
                    {t('profBook.roomEquippedMsg', { room: selectedRoom })}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedDate && selectedSlot && (
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-semibold text-foreground mb-3 flex justify-between">
                <span>{t('profBook.chooseDevice')}</span>
                <span className="text-muted-foreground font-normal">{t('profBook.available', { count: availableDatashows.length })}</span>
              </label>
              <select
                value={selectedDatashow}
                onChange={(e) => setSelectedDatashow(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                disabled={availableDatashows.length === 0}
              >
                {availableDatashows.length === 0 ? (
                  <option value="">{t('profBook.noDatashowAvailable')}</option>
                ) : (
                  availableDatashows.map(ds => (
                    <option key={ds._id} value={ds._id}>{ds.numero} - {ds.marque} {ds.modele}</option>
                  ))
                )}
              </select>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || !selectedDate || !selectedSlot || !selectedRoom || !selectedDatashow || (currentWeekStatus && !currentWeekStatus.isOpen)}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 mt-6"
          >
            {submitting ? t('profBook.submitting') : t('profBook.confirmBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessorBook;
