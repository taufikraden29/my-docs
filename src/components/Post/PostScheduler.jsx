import { useState, useEffect } from 'react'

export const PostScheduler = ({ scheduledDate, onScheduleChange, status }) => {
  const [isScheduled, setIsScheduled] = useState(!!scheduledDate)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  useEffect(() => {
    if (scheduledDate) {
      const d = new Date(scheduledDate)
      setDate(d.toISOString().split('T')[0])
      setTime(d.toTimeString().slice(0, 5))
      setIsScheduled(true)
    }
  }, [scheduledDate])

  const handleToggle = () => {
    setIsScheduled(!isScheduled)
    if (isScheduled) {
      onScheduleChange(null)
      setDate('')
      setTime('')
    }
  }

  const handleDateTimeChange = () => {
    if (date && time) {
      const scheduledDateTime = new Date(`${date}T${time}`)
      onScheduleChange(scheduledDateTime.toISOString())
    }
  }

  useEffect(() => {
    if (isScheduled && date && time) {
      handleDateTimeChange()
    }
  }, [date, time])

  const getMinDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 5)
    return now.toISOString().split('T')[0]
  }

  return (
    <div className="card border-2 border-blue-100 bg-blue-50/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="font-semibold text-gray-900">📅 Schedule Post</h3>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isScheduled}
            onChange={handleToggle}
            className="rounded border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">Enable scheduling</span>
        </label>
      </div>

      {isScheduled && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publish Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getMinDateTime()}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publish Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          {date && time && (
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">
                  Will be published on{' '}
                  <span className="font-semibold text-blue-600">
                    {new Date(`${date}T${time}`).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </span>
              </div>
            </div>
          )}

          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Note about scheduling:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Post status will be set to "scheduled"</li>
                  <li>Post will auto-publish at the scheduled time</li>
                  <li>You can edit or cancel before publish time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
