import React from 'react'
import { useEffect, useState } from 'react'

function Home() {
  const [images, setImages] = useState(null)
  const [folder] = useState('night')
  const [visibleCount, setVisibleCount] = useState(6)
  const [modal, setModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetch(`/api/images?folder=${folder}`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load images')
        return response.json()
      })
      .then(setImages)
      .catch(() => setImages([]))
  }, [folder])

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [modal])

  return (
    <div className="image-gallery">

      {images && (
        <div className="image-grid">
          {images.slice(0, visibleCount).map((image) => (
            <img key={image.public_id} src={image.url} alt={image.public_id} onClick={() => { setModal(true); setSelectedImage(image) }} />
          ))}
        </div>
      )}

      {images && visibleCount < images.length && (
        <button className="see-more-button" type="button" onClick={() => setVisibleCount((count) => count + 6)}>
          See more
        </button>
      )}
      
      {modal && selectedImage &&
        <div className="image-modal">
            <p>{images.length}</p>
          <div className="image-modal-content">
          <img src={selectedImage.url} alt={selectedImage.public_id} onClick={() => { setModal(false); setSelectedImage(null) }} />
          </div>
        </div>
      }
    </div>
  )
}

export default Home