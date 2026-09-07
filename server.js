import { createServer } from 'node:http'
import { v2 as cloudinary } from 'cloudinary'

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

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url, 'http://localhost')

  if (request.method !== 'GET' || requestUrl.pathname !== '/api/images') {
    response.writeHead(404)
    response.end('Not found')
    return
  }

  try {
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