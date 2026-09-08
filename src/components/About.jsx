import React from 'react'
import image from '../assets/IMG_2304.jpg'
const About = () => {
  return (
    <div id="about"className="about-section">
        <h2>About</h2>
        <img src={image} alt="Josh Olea" />
        <p>I’m a photographer drawn to honest moments, quiet details, and the stories found in everyday life.</p>
        <div className="location">
          <p className='location-label'>Location</p>
          <p>Naga City, Camarines Sur</p>
        </div>
    </div>
  )
}

export default About