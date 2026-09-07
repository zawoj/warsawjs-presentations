import config from '@payload-config'
import { getPayload } from 'payload'

import './styles.css'

export const dynamic = 'force-dynamic'

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))

export default async function HomePage() {
  const payload = await getPayload({ config })
  const { docs: events } = await payload.find({
    collection: 'events',
    where: { status: { equals: 'published' } },
    sort: 'date',
  })

  return (
    <main className="schedule-shell">
      <header className="schedule-header">
        <span>WARSAWJS / SCHEDULE</span>
        <a href="/admin">Open CMS ↗</a>
      </header>

      <section className="schedule-hero">
        <p>Upcoming community events</p>
        <h1>JavaScript lives here.</h1>
      </section>

      <section className="event-list" aria-label="Published WarsawJS events">
        {events.length === 0 && (
          <article className="event-card event-card--empty">
            <span>NO PUBLISHED EVENTS</span>
            <h2>Add one in Payload Admin.</h2>
          </article>
        )}

        {events.map((event, index) => (
          <article className="event-card" key={event.id}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h2>{event.title}</h2>
            <time dateTime={event.date}>{formatDate(event.date)}</time>
          </article>
        ))}
      </section>
    </main>
  )
}
