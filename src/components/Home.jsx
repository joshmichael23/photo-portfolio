import React from 'react'
import { useEffect, useState } from 'react'
import About from './About'
import Contact from './Contact'

function shuffleImages(images) {
    const shuffledImages = [...images]

    for (let index = shuffledImages.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        ;[shuffledImages[index], shuffledImages[randomIndex]] = [shuffledImages[randomIndex], shuffledImages[index]]
    }

    return shuffledImages
}

function Home() {
    const [images, setImages] = useState(null)
    const [folder, setFolder] = useState('*')
    const [visibleCount, setVisibleCount] = useState(6)
    const [modal, setModal] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        setVisibleCount(6)
        setSelectedImage(null)
        setModal(false)

        fetch(`/api/images?folder=${folder}`)
            .then((response) => {
                if (!response.ok) throw new Error('Unable to load images')
                return response.json()
            })
            .then((loadedImages) => {
                setImages(shuffleImages(loadedImages))
                setIsLoading(false)
            })
            .catch(() => {
                setImages([])
                setIsLoading(false)
            })
    }, [folder])

    useEffect(() => {
        document.body.style.overflow = modal ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
    }, [modal])

    const selectedIndex = images && selectedImage
        ? images.findIndex((image) => image.public_id === selectedImage.public_id)
        : -1

    const closeModal = () => {
        setModal(false)
        setSelectedImage(null)
    }

    const changeImage = (offset) => {
        const visibleLength = Math.min(visibleCount, images?.length ?? 0)
        if (!visibleLength || selectedIndex < 0) return

        const nextIndex = (selectedIndex + offset + visibleLength) % visibleLength
        setSelectedImage(images[nextIndex])
    }

    return (
        <>
        <div className={`image-gallery ${isLoading ? 'is-loading' : 'is-loaded'}`} aria-busy={isLoading}>

            {isLoading && (
                <div className="loading-overlay" role="status" aria-label="Loading images">
                    <span className="loading-spinner" aria-hidden="true"></span>
                </div>
            )}

           
            <select className="folder-select" onChange={(e) => setFolder(e.target.value)} value={folder}>
                <option value="*">All</option>
                <option value="night">Night</option>
                <option value="street">Street</option>
            </select>
            
            {images && (
                <div className="image-grid">
                    {images.slice(0, visibleCount).map((image) => (
                        <img
                            key={image.public_id}
                            src={image.url}
                            alt={image.public_id}
                            onClick={() => { setModal(true); setSelectedImage(image) }}
                        />
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
                    <p className="image-position">
                        {selectedIndex + 1} / {visibleCount}
                    </p>
                    <div onClick={closeModal} className="close-button btn">
                        <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </div>
                    <div className="prev-button btn" onClick={() => changeImage(-1)}>
                        <svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </div>
                    <div className="image-modal-content">
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.public_id}
                            onClick={closeModal}
                        />
                    </div>
                    <div className="next-button btn" onClick={() => changeImage(1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                </div>
            }
        </div>
        <About />
        <Contact />
        </>
    )
}

export default Home