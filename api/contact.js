import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { name, email, subject, message } = request.body || {}

  if (![name, email, subject, message].every((value) => typeof value === 'string' && value.trim())) {
    response.status(400).json({ error: 'All fields are required' })
    return
  }

  if (!isValidEmail(email.trim())) {
    response.status(400).json({ error: 'A valid email is required' })
    return
  }

  try {
    const senderAddress = process.env.SMTP_FROM || process.env.SMTP_USER
    const recipientAddress = process.env.CONTACT_TO || process.env.SMTP_USER

    await transporter.sendMail({
      from: senderAddress,
      to: recipientAddress,
      replyTo: email.trim(),
      subject: subject.trim(),
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    })

    response.status(200).json({ message: 'Message sent' })
  } catch (error) {
    console.error('Contact email failed:', error)
    response.status(500).json({ error: 'Unable to send message' })
  }
}
