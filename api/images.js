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

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const subfolder = new URL(request.url, 'http://localhost').searchParams.get('folder') || '*'
    const result = await cloudinary.search
      .expression(getFolderExpression(subfolder))
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute()

    response.status(200).json(result.resources.map((image) => ({
      url: image.secure_url,
      width: image.width,
      height: image.height,
      public_id: image.public_id,
    })))
  } catch (error) {
    console.error('Cloudinary request failed:', error)
    response.status(500).json({ error: 'Unable to load images' })
  }
}