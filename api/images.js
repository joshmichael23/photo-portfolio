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
    const { searchParams } = new URL(request.url, 'http://localhost')
    const folder = searchParams.get('folder') || '*'
    const mode = searchParams.get('mode')
    const limit = Math.min(Math.max(Number.parseInt(searchParams.get('limit') || '6', 10) || 6, 1), 100)
    const cursor = searchParams.get('cursor')

    if (mode === 'folders') {
      const result = await cloudinary.api.sub_folders('portfolio')
      const folders = [
        'All',
        ...(result.folders || [])
          .map((item) => item.path.replace(/^portfolio\//i, ''))
          .filter(Boolean),
      ]

      response.status(200).json(folders)
      return
    }

    let search = cloudinary.search
      .expression(getFolderExpression(folder))
      .sort_by('created_at', 'desc')
      .max_results(limit)

    if (cursor) search = search.next_cursor(cursor)

    const result = await search.execute()

    response.status(200).json({
      images: result.resources.map((image) => ({
        url: image.secure_url,
        width: image.width,
        height: image.height,
        public_id: image.public_id,
        created_at: image.created_at,
      })),
      nextCursor: result.next_cursor || null,
    })
  } catch (error) {
    console.error('Cloudinary request failed:', error)
    response.status(500).json({ error: 'Unable to load images' })
  }
}