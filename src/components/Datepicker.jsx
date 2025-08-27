import React, { useMemo, useState, useCallback } from 'react'

// A simple datepicker converted from the provided Vue component.
// Internal state only (uncontrolled). Optionally you can extend with value/onChange.
export default function Datepicker({ value, onChange }) {
  // Allow controlled (value provided) or uncontrolled (internal state)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)

  const today = useMemo(() => new Date(), [])
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const selected = value ?? selectedDate

  const formattedDate = useMemo(
    () => (selected ? selected.toLocaleDateString() : ''),
    [selected]
  )

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const daysInMonth = useCallback((year, month) => new Date(year, month + 1, 0).getDate(), [])

  const calendarDays = useMemo(() => {
    const days = []

    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()

    // previous month days
    const prevMonthDays = daysInMonth(currentYear, currentMonth - 1)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
        otherMonth: true,
      })
    }

    // current month days
    const thisMonthDays = daysInMonth(currentYear, currentMonth)
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({ date: new Date(currentYear, currentMonth, i), otherMonth: false })
    }

    // next month days (fill to 6 weeks grid => 42 cells)
    const nextDays = 42 - days.length
    for (let i = 1; i <= nextDays; i++) {
      days.push({ date: new Date(currentYear, currentMonth + 1, i), otherMonth: true })
    }

    return days
  }, [currentMonth, currentYear, daysInMonth])

  const currentMonthName = useMemo(
    () => new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' }),
    [currentMonth, currentYear]
  )

  const toggleCalendar = useCallback(() => setShowCalendar((s) => !s), [])

  const prevMonth = useCallback(() => {
    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1)
        return 11
      }
      return m - 1
    })
  }, [])

  const nextMonth = useCallback(() => {
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1)
        return 0
      }
      return m + 1
    })
  }, [])

  const selectDate = useCallback(
    (day) => {
      if (day.otherMonth) return
      if (onChange) onChange(day.date)
      else setSelectedDate(day.date)
      setShowCalendar(false)
    },
    [onChange]
  )

  const isSelected = useCallback(
    (day) => selected && day.date.toDateString() === selected.toDateString(),
    [selected]
  )

  return (
    <div className="relative inline-block">
      <input
        type="text"
        readOnly
        value={formattedDate}
        onClick={toggleCalendar}
        placeholder="Select date"
        className="w-40 p-2 border border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showCalendar && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-50 p-4">
          {/* header */}
          <div className="flex justify-between items-center mb-2">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-200 rounded" aria-label="Previous month">
              &lt;
            </button>
            <span className="font-medium">
              {currentMonthName} {currentYear}
            </span>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-200 rounded" aria-label="Next month">
              &gt;
            </button>
          </div>

          {/* weekdays */}
          <div className="grid grid-cols-7 text-center mb-1">
            {weekdays.map((day) => (
              <span key={day} className="font-semibold text-gray-700">
                {day}
              </span>
            ))}
          </div>

          {/* days */}
          <div className="grid grid-cols-7 text-center">
            {calendarDays.map((day) => (
              <span
                key={day.date.toISOString()}
                onClick={() => selectDate(day)}
                className={[
                  'p-2 cursor-pointer rounded-full',
                  day.otherMonth ? 'text-gray-400' : '',
                  isSelected(day) ? 'bg-blue-500 text-white' : '',
                  !day.otherMonth ? 'hover:bg-blue-100' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {day.date.getDate()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
