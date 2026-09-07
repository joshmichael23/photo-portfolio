import { useState } from 'react'

function Contact() {
  const [status, setStatus] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('sending')

    const form = event.currentTarget
    const fields = Object.fromEntries(new FormData(form).entries())

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })

      if (!response.ok) throw new Error('Unable to send message')

      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div id="contact" className="contact-section">
      <div className="contact-intro">
        <p className="eyebrow">Get in touch</p>
        <h2>Contact me</h2>
        <p>Have a project, collaboration, or question? Send me a message.</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>

        <div className="form-field">
          <label htmlFor="subject">Subject</label>
          <input id="subject" name="subject" type="text" required />
        </div>

        <div className="form-field">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="7" required />
        </div>

        <button className="contact-submit" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send message'}
        </button>

        {status === 'success' && (
          <p className="form-success" role="status">Thanks, your message was sent.</p>
        )}

        {status === 'error' && (
          <p className="form-error" role="alert">Unable to send your message. Please try again.</p>
        )}
      </form>
    </div>
  )
}

export default Contact