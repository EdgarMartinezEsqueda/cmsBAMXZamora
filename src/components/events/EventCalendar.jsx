import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { mexicoDay } from "../../../shared/content/events.js";
import { categoryStyle, monthTitle } from "./eventFormat";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

const shiftMonth = (month, delta) => {
  const [year, number] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, number - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
};

/**
 * Calendario del mes con un punto de color (por categoría) en los días con eventos.
 * Tocar un día con eventos lo selecciona; tocarlo otra vez quita la selección.
 */
export default function EventCalendar({ month, events, selectedDay, onSelectDay, onChangeMonth, loading = false }) {
  const [year, number] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, number, 0)).getUTCDate();
  // Lunes = 0 … domingo = 6.
  const firstWeekday = (new Date(Date.UTC(year, number - 1, 1)).getUTCDay() + 6) % 7;
  const byDay = new Map();
  for (const event of events) {
    const day = mexicoDay(event.startDate);
    byDay.set(day, [...(byDay.get(day) ?? []), event]);
  }
  const today = mexicoDay(new Date());
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => onChangeMonth(shiftMonth(month, -1))} aria-label="Mes anterior"
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100"><FiChevronLeft aria-hidden="true" /></button>
        <h3 className="text-lg font-bold capitalize text-gray-900" aria-live="polite">{monthTitle(month)}</h3>
        <button type="button" onClick={() => onChangeMonth(shiftMonth(month, 1))} aria-label="Mes siguiente"
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100"><FiChevronRight aria-hidden="true" /></button>
      </div>

      <div className={`grid grid-cols-7 gap-1 text-center text-sm transition-opacity ${loading ? "opacity-50" : ""}`}>
        {WEEKDAYS.map((weekday, index) => <span key={index} className="pb-2 text-xs font-semibold text-gray-400" aria-hidden="true">{weekday}</span>)}
        {cells.map((dayNumber, index) => {
          if (!dayNumber) return <span key={`vacio-${index}`} />;
          const day = `${month}-${String(dayNumber).padStart(2, "0")}`;
          const dayEvents = byDay.get(day) ?? [];
          const selected = selectedDay === day;
          return (
            <button
              key={day}
              type="button"
              disabled={dayEvents.length === 0}
              onClick={() => onSelectDay(selected ? null : day)}
              aria-pressed={selected}
              aria-label={`${dayNumber}${dayEvents.length ? `, ${dayEvents.length} evento${dayEvents.length > 1 ? "s" : ""}` : ""}`}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-lg font-medium transition
                ${selected ? "bg-verdeLogo text-white" : dayEvents.length ? "text-gray-900 hover:bg-verde-50" : "cursor-default text-gray-400"}
                ${day === today && !selected ? "ring-2 ring-amarilloLogo" : ""}`}
            >
              {dayNumber}
              {dayEvents.length > 0 && (
                <span className="absolute bottom-1 flex gap-0.5" aria-hidden="true">
                  {dayEvents.slice(0, 3).map((event) => (
                    <span key={event.slug} className={`h-1.5 w-1.5 rounded-full ${selected ? "bg-white" : categoryStyle(event.category).dot}`} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-gray-500">Toca un día marcado para ver sus actividades.</p>
    </div>
  );
}
