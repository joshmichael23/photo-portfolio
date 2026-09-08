import { createServer } from 'node:http'
import { v2 as cloudinary } from 'cloudinary'
import nodemailer from 'nodemailer'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function getFolderExpression(subfolder = '*') {
  if (subfolder === '*') return 'folder:portfolio/*'
  if (!/^[a-zA-Z0-9_-]+$/.test(subfolder)) throw new Error('Invalid folder')
  return `folder:portfolio/${subfolder}`
}

const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const senderAddress = process.env.SMTP_FROM || process.env.SMTP_USER
const recipientAddress = process.env.CONTACT_TO || process.env.SMTP_USER

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk
      if (body.length > 10000) {
        reject(new Error('Request body too large'))
        request.destroy()
      }
    })

    request.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })

    request.on('error', reject)
  })
}

function isValidContactForm(form) {
  return [form.name, form.email, form.subject, form.message].every(
    (value) => typeof value === 'string' && value.trim().length > 0,
  )
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url, 'http://localhost')

  if (request.method === 'POST' && requestUrl.pathname === '/api/contact') {
    try {
      const form = await readRequestBody(request)

      if (!isValidContactForm(form)) {
        response.writeHead(400, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ error: 'All fields are required' }))
        return
      }

      await mailTransporter.sendMail({
        from: senderAddress,
        to: recipientAddress,
        replyTo: form.email.trim(),
        subject: form.subject.trim(),
        text: `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`,
      })

      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ message: 'Message sent' }))
    } catch (error) {
      console.error('Contact email failed:', error)
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ error: 'Unable to send message' }))
    }
    return
  }

  if (request.method !== 'GET' || requestUrl.pathname !== '/api/images') {
    response.writeHead(404)
    response.end('Not found')
    return
  }

  try {
    const mode = requestUrl.searchParams.get('mode')

    if (mode === 'folders') {
      const result = await cloudinary.api.sub_folders('portfolio')
      const folders = [
        'All',
        ...(result.folders || [])
          .map((item) => item.path.replace(/^portfolio\//i, ''))
          .filter(Boolean),
      ]

      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(folders))
      return
    }

    const subfolder = requestUrl.searchParams.get('folder') || '*'
    const result = await cloudinary.search
      .expression(getFolderExpression(subfolder))
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute()

    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(result.resources.map((image) => ({
      url: image.secure_url,
      width: image.width,
      height: image.height,
      public_id: image.public_id,
      created_at: image.created_at,
    }))))
  } catch (error) {
    console.error('Cloudinary request failed:', error)
    response.writeHead(500, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ error: 'Unable to load images' }))
  }
})

server.listen(3001, () => {
  console.log('Image API listening on http://localhost:3001')
})