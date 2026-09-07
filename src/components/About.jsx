import React from 'react'
import image from '../assets/IMG_2304.jpg'
const About = () => {
  return (
    <div id="about"className="about-section">
        <h2>About</h2>
        <img src={image} alt="Your Name" />
        <p>I’m a photographer drawn to honest moments, quiet details, and the stories found in everyday life.</p>
        <p className="location">Location</p>
        <p>Naga City, Camarines Sur</p>
    </div>
  )
}

export default About