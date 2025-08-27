import React from 'react'
import Datepicker from './components/Datepicker'

export default function App() {
  const [selectedDate, setSelectedDate] = React.useState(null)
  return (
    <div className="app">
  <h1 className="text-3xl font-bold text-indigo-600">Hello KBTG</h1>
      <div className="mt-4">
        <Datepicker value={selectedDate} onChange={setSelectedDate} />
      </div>
      <div className="mt-2 text-gray-700">
        Selected date: {selectedDate ? selectedDate.toLocaleDateString() : '-'}
      </div>
    </div>
  )
}
