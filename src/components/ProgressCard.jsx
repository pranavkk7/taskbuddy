const RADIUS = 34
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function message({ total, done, active }) {
  if (total === 0) return 'Add your first task to get going.'
  if (active === 0) return 'Everything is done. Nice work!'
  if (done === 0) return 'A fresh list. Pick one and start.'
  return `${active} to go. Keep it up!`
}

/** Today's progress: a ring that fills as tasks are completed, with the numbers beside it. */
export default function ProgressCard({ stats }) {
  const { total, done, percent } = stats
  return (
    <section className="progress" aria-label="Progress">
      <div
        className="ring"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Tasks completed"
      >
        <svg viewBox="0 0 80 80" aria-hidden="true">
          <defs>
            <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#c7d2fe" />
            </linearGradient>
          </defs>
          <circle className="ring-track" cx="40" cy="40" r={RADIUS} />
          <circle
            className="ring-value"
            cx="40"
            cy="40"
            r={RADIUS}
            stroke="url(#ring-gradient)"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
          />
        </svg>
        <span className="ring-label">{percent}%</span>
      </div>
      <div className="progress-text">
        <p className="progress-count">
          {total === 0 ? (
            <strong>No tasks yet</strong>
          ) : (
            <>
              <strong>{done}</strong> of <strong>{total}</strong> done
            </>
          )}
        </p>
        <p className="progress-message">{message(stats)}</p>
      </div>
    </section>
  )
}
