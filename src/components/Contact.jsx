import React from 'react'
import { useState } from 'react'

function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    event.currentTarget.reset()
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

        <button className="contact-submit" type="submit">Send message</button>

        {submitted && (
          <p className="form-success" role="status">Thanks, your message is ready to be sent.</p>
        )}
      </form>
    </main>
  )
}

export default Contact